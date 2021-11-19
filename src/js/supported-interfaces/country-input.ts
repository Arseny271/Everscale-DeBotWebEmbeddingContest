import { DebotInterface } from "./debot-interface"
import { BinUtils } from "../../utils/bin-utils"
import { COUNTRIES_LIST } from "../countries-list"

class CountryInputInterface extends DebotInterface {
  constructor(callbacks: any) {
    super(callbacks);
    this.setMethods({
      get: this.get.bind(this)
    });
  }

  async get(body: any) {
    const { prompt, permitted, banned } = body.value;

    const permittedList: any = permitted.map((c: string) => BinUtils.hexToString(c));
    const bannedList: any = banned.map((c: string) => BinUtils.hexToString(c));
    const countries = COUNTRIES_LIST
      .filter((country) => (permittedList.length>0)?(permittedList.indexOf(country[1]) !== -1):true)
      .filter((country) => (bannedList.length>0)?(bannedList.indexOf(country[1]) === -1):true)

    return new Promise<any>((resolve) => {
      this.showMessage({
        prompt: BinUtils.hexToString(prompt),
        type: "input-country", countries,
        onInput: resolve
      })
    }).then(({ value }) => {
      this.showMessage({ type: "print", text: value }, "right");
      return { result: { value: BinUtils.stringToHex(value)}}
    });
  }
}

export { CountryInputInterface }
