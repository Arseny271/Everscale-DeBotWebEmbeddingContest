import { TonClient, DebotModule, AppDebotBrowser, RegisteredDebot, DebotHandle, Abi } from '@tonclient/core';

import { MessagesStore, Message } from "../stores/message-store"
import { UserInfoStore } from "../stores/user-info-store"
import { DebotsStore } from "../stores/debots-store"

import { DebotInterfaceConstructorParams } from "./supported-interfaces/debot-interface"
import { DEBOT_INTERFACES } from "./debot-interfaces"

import { DebotInterface } from "./supported-interfaces/debot-interface"

import { UserInfoInterface } from "./supported-interfaces/user-info"
import { AddressInputInterface } from "./supported-interfaces/address-input"
import { AmountInputInterface } from "./supported-interfaces/amount-input"
import { NumberInputInterface } from "./supported-interfaces/number-input"
import { TerminalInterface } from "./supported-interfaces/terminal"
import { MenuInterface } from "./supported-interfaces/menu"
import { QRCodeInterface } from "./supported-interfaces/qrcode"
import { ConfirmInputInterface } from "./supported-interfaces/confirm-input"
import { CountryInputInterface } from "./supported-interfaces/country-input"
import { DateTimeInputInterface } from "./supported-interfaces/date-time-input"
import { MediaInterface } from "./supported-interfaces/media"
import { SigningBoxInputInterface } from "./supported-interfaces/signing-box-input"
import { EncryptionBoxInputInterface } from "./supported-interfaces/encryption-box-input"
import { AutoCompleteInputInterface } from "./supported-interfaces/auto-complete-input"
import { IFrameMessagesController } from "./iframe-messages-controller"

type RegisteredDebotExtended = {
  registered_debot: RegisteredDebot;
  required_interfaces: string[];
  debot_handle: DebotHandle;
  debot_abi: Abi;
};

class DebotBrowser {
  private messagesStore: MessagesStore;
  private userInfoStore: UserInfoStore;
  private debotsStore: DebotsStore;

  private client: TonClient;
  private address: string;
  private module: DebotModule;
  private appDebotBrowser: AppDebotBrowser;

  private registeredDebots: {[key: string]: RegisteredDebotExtended} = {};
  private debotInterfaces: {[key: string]: DebotInterface};

  private iFrameMessagesController: IFrameMessagesController;
  private interceptInterfaces: {[key: string]: string };

  constructor(client: TonClient,
    messagesStore: MessagesStore,
    userInfoStore: UserInfoStore,
    debotsStore: DebotsStore,
    iFrameMessagesController: IFrameMessagesController,
    interceptInterfaces: {[key: string]: string },
    address: string) {

    /* Stores */
    this.messagesStore = messagesStore;
    this.userInfoStore = userInfoStore;
    this.debotsStore = debotsStore;
    this.iFrameMessagesController = iFrameMessagesController;
    this.interceptInterfaces = interceptInterfaces;

    /* Ton client info */
    this.client = client;
    this.address = address;
    this.module = new DebotModule(client);

    /* Debot interface constructor options */

    const options: DebotInterfaceConstructorParams = {
      tonClient: client,
      sendToDebotCallback: (p: any) => this.module.send(p),
      showMessageCallback: this.showMessageCallback.bind(this)
    }

    this.debotInterfaces = {
      AutoCompleteInput: new AutoCompleteInputInterface(options, this.iFrameMessagesController),
      UserInfo: new UserInfoInterface(options, userInfoStore),
      SigningBoxInput: new SigningBoxInputInterface(options, userInfoStore),
      EncryptionBoxInput: new EncryptionBoxInputInterface(options, userInfoStore),
      Terminal: new TerminalInterface(options),
      Menu: new MenuInterface(options),
      AddressInput: new AddressInputInterface(options, userInfoStore),
      AmountInput: new AmountInputInterface(options),
      ConfirmInput: new ConfirmInputInterface(options),
      CountryInput: new CountryInputInterface(options),
      DateTimeInput: new DateTimeInputInterface(options),
      NumberInput: new NumberInputInterface(options),
      QRCode: new QRCodeInterface(options),
      Media: new MediaInterface(options)
    }


    /* App Debot Browser */

    this.appDebotBrowser = {
      log: (params: any) => {},
      switch: (params: any) => {},
      switch_completed: () => {},
      show_action: (params: any) => {},
      input: (params: any) => {},
      invoke_debot: (params: any) => {},

      get_signing_box: this.onDebotGetSigningBox.bind(this),
      approve: this.onDebotApprove.bind(this),
      send: this.onDebotSend.bind(this),
    } as any;
  }

  async init(): Promise<void> {
    await this.registerDebot(this.address);
  }

  async start(): Promise<void> {
    const { info } = this.registeredDebots[this.address].registered_debot;

    this.messagesStore.newMessage(this.address, {
      type: "print", text: `${info.name} ${info.version} ${info.publisher}`
    });
    if (info.caption) {
      this.messagesStore.newMessage(this.address, {
        type: "print", text: info.caption
      });
    }
    if (info.hello) {
      this.messagesStore.newMessage(this.address, {
        type: "print", text: info.hello
      });
    }

    return new Promise<void>((resolve) => {
      this.messagesStore.newMessage(this.address, {
        type: "start", text: "Start", onStart: resolve
      });
    }).then(() => {
      return this.module.start({ debot_handle: this.registeredDebots[this.address].debot_handle });
    });
  }

  private async registerDebot(address: string): Promise<RegisteredDebotExtended> {
    if (address in this.registeredDebots) return this.registeredDebots[address];

    return this.module.init({ address }, this.appDebotBrowser).then((registered_debot) => {
      const interfaces = registered_debot.info.interfaces;
      const required_interfaces: string[] = interfaces.map(i => (this.getInterfaceById(i.slice(2)) || {name: i}).name );
      const debot_abi: Abi = { type: "Json", value: registered_debot.debot_abi };
      const debot_handle = registered_debot.debot_handle;

      this.debotsStore.setDebotInfo(address, registered_debot.info);
      return this.registeredDebots[address] = {
        registered_debot, debot_handle,
        required_interfaces, debot_abi
      };
    });
  }



  /* Browser methods */

  private async onDebotSend(params: any): Promise<void> {
    const { message } = params;
    const { parsed } = await this.client.boc.parse_message({ boc: message });

    if (parsed.dst_workchain_id === -31) {
      return this.onDebotInterfaceCall(parsed);
    } else { return this.onDebotMessageCall(parsed)}
  }

  private async onDebotInterfaceCall(message: any): Promise<void> {
    const interfaceInfo = this.getInterfaceById(message.dst);
    if (!interfaceInfo) return;

    const registeredDebot = this.registeredDebots[message.src];
    if (!registeredDebot) return;

    const debotInterface = this.debotInterfaces[interfaceInfo.name];
    if (!debotInterface) return;

    const parsed = await this.client.abi.decode_message_body({
      abi: { type: "Json", value: interfaceInfo.abi },
      body: message.body, is_internal: true,
    });

    await debotInterface.onMethodCall({
      debot_handle: registeredDebot.debot_handle, body: parsed,
      debot_abi: registeredDebot.debot_abi, message: message
    });
  }

  private async onDebotMessageCall(message: any): Promise<void> {
    const registeredDebot = await this.registerDebot(message.dst);

    await this.module.send({
      debot_handle: registeredDebot.debot_handle,
      message: message.boc
    });
  }

  private async onDebotGetSigningBox() {
    const boxes = this.userInfoStore.getSigningBoxes();
    return new Promise((resolve) => {
      this.messagesStore.newMessage(this.address, {
        type: "menu", onInput: resolve, description: "", title: "How would you like to sign?",
        items: boxes.map((box: any, i: number) => { return {
          handlerId: "0", description: "", title: box.title
        }})
      });
    }).then(({ index }: any) => {
      const box = boxes[index];

      this.messagesStore.newMessage(this.address, { type: "print", text: box.title }, "right");
      return { signing_box: box.signingBoxHandle };
    });
  }

  private async onDebotApprove(params: any) {
    const transaction = params.activity;

    return this.client.boc.parse_message({ boc: transaction.msg }).then((result) => {
      transaction.parsed_message = result.parsed;
      return new Promise<boolean>((resolve) => {
        this.messagesStore.newMessage(this.address, {
          type: "approve", transaction, onApprove: (approved: boolean) => resolve(approved)
        });
      })
    }).then((approved) => {
      this.messagesStore.newMessage(this.address, { type: "print", text: approved?"Confirm":"Cancel" }, "right");
      if (approved) this.messagesStore.newMessage(this.address, { type: "print", text: `Sending message ${transaction.parsed_message.id}`})
      return { approved }
    });
  }



  /* Utils */

  private getInterfaceById(id: string): any {
    const splitted = id.split(":");
    return DEBOT_INTERFACES[splitted[splitted.length-1]];
  }


  private showMessageCallback(message: Message, side?: string) {
    const ACCEPTED_INTERCEPTED_INTERFACES = [
      "menu", "input", "input-address", "input-confirm", "input-amount",
      "input-number", "input-qrcode", "input-country", "input-date-time",
      "media", "draw-qrcode"
    ];

    const isInterceptable = ACCEPTED_INTERCEPTED_INTERFACES.indexOf(message.type) !== -1;
    const intercept = isInterceptable?(this.interceptInterfaces[message.type] || "none"):"none";

    const messageIndex = this.messagesStore.newMessage(this.address, { intercept, ...message }, side);
    if (intercept === "all" && "onInput" in message) {
      this.iFrameMessagesController.send(message).then((result) => {
        if ("onInput" in message) {message.onInput(result)};
      }, () => {
        this.messagesStore.updateMessage(messageIndex, this.address, { intercept: "none", ...message }, side);
      });
    }
  }
}

export { DebotBrowser }
