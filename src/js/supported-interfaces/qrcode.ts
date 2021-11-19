import { DebotInterface } from "./debot-interface"
import { BinUtils } from "../../utils/bin-utils"

class QRCodeInterface extends DebotInterface {
  constructor(callbacks: any) {
    super(callbacks);
    this.setMethods({
      scan: this.read.bind(this),
      read: this.read.bind(this),
      draw: this.draw.bind(this)
    });
  }

  async read(body: any) {
    const { prompt } = body.value;

    return new Promise<any>((resolve) => {
      this.showMessage({
        prompt: (prompt !== undefined)?BinUtils.hexToString(prompt):"Scan QR code",
        type: "input-qrcode", onInput: resolve
      })
    }).then(({ value, status }) => {
      this.showMessage({ type: "print", text: value }, "right");
      return { result: { value: BinUtils.stringToHex(value), result: 0 }};
    });
  }

  async draw(body: any) {
    const { prompt, text } = body.value;

    this.showMessage({
      type: "draw-qrcode",
      text: BinUtils.hexToString(text),
      prompt: BinUtils.hexToString(prompt)
    })
    this.showMessage({
      type: "print",
      text: BinUtils.hexToString(prompt)
    })

    return { result: { result: 0 }};
  }
}

export { QRCodeInterface }
