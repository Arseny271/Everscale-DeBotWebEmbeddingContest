import { makeObservable, observable, action } from "mobx"

export type MessageItem = {
  handlerId: string;
  title: string;
  description: string;
}

export type Message = ({
  type: "menu";
  description: string;
  title: string;
  items: MessageItem[];
  onInput: (result: { index: number }) => void;
} | {
  type: "input";
  prompt: string;
  multiline: boolean;
  onInput: (result: { value: string }) => void;
} | {
  type: "input-address";
  prompt: string;
  onInput: (result: { index: number, value: string }) => void;
  items: MessageItem[];
} | {
  type: "input-confirm";
  prompt: string;
  onInput: (result: { value: boolean }) => void;
} | {
  type: "input-amount";
  prompt: string;
  onInput: (result: { value: string }) => void;
  decimals: number;
  min: string;
  max: string;
} | {
  type: "input-number";
  prompt: string;
  min: string;
  max: string;
  onInput: (result: { value: string }) => void;
} | {
  type: "input-qrcode";
  prompt: string;
  onInput: (result: { value: string, status: number }) => void;
} | {
  type: "input-country";
  countries: any[];
  prompt: string;
  onInput: (result: { value: string }) => void;
} | {
  type: "input-date-time";
  needInputTime: boolean;
  needInputDate: boolean;
  prompt: string;
  defaultDatetime: Date;
  minDatetime: Date;
  maxDatetime: Date;
  minuteInterval?: number;
  inTimeZoneOffset?: number;
  onInput: (result: { value: number }) => void;
} | {
  type: "start";
  text: string;
  onStart: () => void;
} | {
  type: "print";
  text: string;
  style?: string;
} | {
  type: "media";
  data: string;
} | {
  type: "approve";
  transaction: any;
  onApprove: (approved: boolean) => void;
} | {
  type: "draw-qrcode";
  prompt: string;
  text: string;
}) & {
  intercept?: string;
}

export type MessageInfo = {
  message: Message;
  side: string;
}

class MessagesStore {
  messagesMap: {[key: string]: MessageInfo[]} = {}

  constructor() {
      makeObservable(this, {
          messagesMap: observable,
          newMessage: action,
          updateMessage: action,
      })
  }

  newMessage(address: string, message: Message, side: string = "left"): number {
    if (!(address in this.messagesMap))
      this.messagesMap[address] = []

    this.messagesMap[address].push({ side, message });
    return this.messagesMap[address].length - 1;
  }

  updateMessage(index: number, address: string, message: Message, side: string = "left") {
    this.messagesMap[address][index] = { side, message };
  }

  getMessages(address: string): MessageInfo[] {
    if (!(address in this.messagesMap)) return [];
    return this.messagesMap[address];
  }
}

export { MessagesStore }
