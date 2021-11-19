import { DebotInterface } from "./debot-interface"
import { BinUtils } from "../../utils/bin-utils"

class ConfirmInputInterface extends DebotInterface {
  constructor(callbacks: any) {
    super(callbacks);
    this.setMethods({
      get: this.get.bind(this)
    });
  }

  async get(body: any) {
    const { prompt } = body.value;

    return new Promise<any>((resolve) => {
      this.showMessage({
        prompt: BinUtils.hexToString(prompt), type: "input-confirm",
        onInput: resolve
      })
    }).then(({ value }) => {
      this.showMessage({ type: "print", text: value?"Yes":"No", style: value?"confirm-success":"confirm-fail" }, "right")
      return { result: { value }}
    })
  }
}

export { ConfirmInputInterface }
