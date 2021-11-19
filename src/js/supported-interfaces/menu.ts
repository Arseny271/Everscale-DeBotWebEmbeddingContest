import { DebotInterface } from "./debot-interface"
import { BinUtils } from "../../utils/bin-utils"

class MenuInterface extends DebotInterface {
  constructor(callbacks: any) {
    super(callbacks);
    this.setMethods({
      select: this.select.bind(this)
    });
  }

  async select(body: any) {
    const { description, items, title } = body.value;

    return new Promise<any>((resolve) => {
      this.showMessage({
        title: BinUtils.hexToString(title), type: "menu",
        description: BinUtils.hexToString(description),
        onInput: resolve, items: items.map((item: any, i: number) => { return {
          title: BinUtils.hexToString(item.title),
          description: BinUtils.hexToString(item.description),
          handlerId: item.handlerId
        }}),
      })
    }).then(({ index }) => {
      const item = items[index];

      this.showMessage({ type: "print", text: BinUtils.hexToString(item.title) }, "right")
      return { result: { index }, options: { handler_id: item.handlerId }}
    });
  }
}

export { MenuInterface }
