import { DebotInterface } from "./debot-interface"
import { BinUtils } from "../../utils/bin-utils"

import { IFrameMessagesController } from "../iframe-messages-controller"

class AutoCompleteInputInterface extends DebotInterface {
  private iFrameMessagesController: IFrameMessagesController;

  constructor(callbacks: any, iFrameMessagesController: IFrameMessagesController) {
    super(callbacks);

    this.iFrameMessagesController = iFrameMessagesController;
    this.setMethods({
      get: this.get.bind(this),
    });
  }

  async get(body: any) {
    const { id, values } = body.value;

    const defaultValues: any = {};
    const request = {
      id: BinUtils.hexToString(id),
      values: BinUtils.hexToString(values).split(",").map(v => {
        const info = v.split(":");
        const defaultValue = info.slice(2).join(":");
        defaultValues[info[0]] = defaultValue;

        return { value: info[0], type: info[1], default: defaultValue };
      })
    };

    return this.iFrameMessagesController.send({ type: "input-auto-complete", request }).then((result) => {
      return { result };
    }, (error) => {
      return { result: { status: 0, ...defaultValues }}
    });
  }
}

export { AutoCompleteInputInterface }
