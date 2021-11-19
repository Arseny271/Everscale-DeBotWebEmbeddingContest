import { DebotInterface } from "./debot-interface"
import { BinUtils } from "../../utils/bin-utils"

class MediaInterface extends DebotInterface {
  constructor(callbacks: any) {
    super(callbacks);
    this.setMethods({
      getSupportedMediaTypes: this.getSupportedMediaTypes.bind(this),
      output: this.output.bind(this)
    });
  }

  async output(body: any) {
    const { prompt, data } = body.value;

    this.showMessage({ type: "media", data: BinUtils.hexToString(data)});
    this.showMessage({ type: "print", text: BinUtils.hexToString(prompt)});
    return { result: { result: 0 }};
  }

  async getSupportedMediaTypes(body: any) {
    return { result: { mediaTypes: [
      BinUtils.stringToHex("image/png"),
      BinUtils.stringToHex("image/jpg"),
      BinUtils.stringToHex("image/jped"),
      BinUtils.stringToHex("image/bmp"),
      BinUtils.stringToHex("image/gif"),
      BinUtils.stringToHex("image/svg+xml"),
      BinUtils.stringToHex("image/webp"),
    ]}};
  }
}

export { MediaInterface }
