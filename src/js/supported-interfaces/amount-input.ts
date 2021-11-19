import { DebotInterface } from "./debot-interface"
import { BinUtils } from "../../utils/bin-utils"

class AmountInputInterface extends DebotInterface {
  constructor(callbacks: any) {
    super(callbacks);
    this.setMethods({
      get: this.get.bind(this),
    });
  }

  async get(body: any) {
    const { prompt, decimals, min, max } = body.value;

    return new Promise<any>((resolve) => {
      this.showMessage({
        prompt: BinUtils.hexToString(prompt), type: "input-amount",
        decimals: parseInt(decimals), min, max, onInput: resolve
      })
    }).then(({ value }) => {
      this.showMessage({ type: "print", text: value}, "right")
      return { result: { value }}
    });
  }
}

export { AmountInputInterface }
