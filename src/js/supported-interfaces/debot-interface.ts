import { TonClient, ParamsOfSend, Abi, DebotHandle } from '@tonclient/core';
import { Message } from "../../stores/message-store"

export type DebotInterfaceConstructorParams = {
  tonClient: TonClient;
  sendToDebotCallback: (params: ParamsOfSend) => Promise<void>,
  showMessageCallback: (message: Message, side?: string) => void;
}

export type DebotMessageParams = {
  debot_abi: Abi,
  debot_handle: DebotHandle,
  message: any,
  body: any
}

class DebotInterface {
  private initParams: DebotInterfaceConstructorParams;
  private methods: any = {};

  constructor(params: DebotInterfaceConstructorParams) {
    this.initParams = params;
  }

  public async onMethodCall(params: DebotMessageParams) {
    const { name } = params.body;
    if (!(name in this.methods)) return;

    return this.methods[name](params.body).then(({result, options}: any) => {
      return this.sendAnswer(params, result, options);
    });
  }

  protected setMethods(methods: any) {
    this.methods = methods;
  }

  protected async sendAnswer(params: DebotMessageParams, input: any, options: any = {}) {
    const { debot_handle } = params;
    const { handler_id } = options;
    const function_id = parseInt(handler_id?handler_id:params.body.value.answerId);
    const address = params.message.src;
    const abi = params.debot_abi;

    if (function_id === 0) return;

    const { message } = await this.initParams.tonClient.abi.encode_message({
      signer: { type: "None" }, abi, address, call_set: {
        function_name: `0x${function_id.toString(16)}`,
        input: input
      }
    });

    return this.sendToDebot({ debot_handle: debot_handle, message });
  }

  protected showMessage(message: Message, side?: string) {
    this.initParams.showMessageCallback(message, side);
  }

  private async sendToDebot(params: ParamsOfSend): Promise<void> {
    return this.initParams.sendToDebotCallback(params);
  }
}

export { DebotInterface }
