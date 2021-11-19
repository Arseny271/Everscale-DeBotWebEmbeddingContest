import { DebotInterface } from "./debot-interface"
import { BinUtils } from "../../utils/bin-utils"

class TerminalInterface extends DebotInterface {
  constructor(callbacks: any) {
    super(callbacks);
    this.setMethods({
      input: this.input.bind(this),
      print: this.print.bind(this),
      printf: this.printf.bind(this)
    });
  }

  async input(body: any) {
    const { prompt, multiline } = body.value;

    return new Promise<any>((resolve) => {
      this.showMessage({
        prompt: BinUtils.hexToString(prompt),
        type: "input", multiline,
        onInput: resolve
      })
    }).then(({ value }) => {
      this.showMessage({ type: "print", text: value }, "right");
      return { result: { value: BinUtils.stringToHex(value)}};
    });
  }

  async print(body: any) {
    const { message } = body.value;

    this.showMessage({
      type: "print", text: BinUtils.hexToString(message)
    })
    return { result: {}};
  }

  async printf(body: any) {
    const { fmt/*, fargs*/ } = body.value;
    const message = BinUtils.hexToString(fmt);
    const replacer = (match: string, p1: string) => {
      console.log("get", p1);
      return p1;
    }

    this.showMessage({ type: "print", text: message.replace(/\{(.+?)\}/g, replacer)})
    return { result: {}};
  }
}

export { TerminalInterface }
