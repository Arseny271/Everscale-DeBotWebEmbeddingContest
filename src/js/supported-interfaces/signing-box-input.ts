import { DebotInterface } from "./debot-interface"
import { UserInfoStore } from "../../stores/user-info-store"
import { BinUtils } from "../../utils/bin-utils"

class SigningBoxInputInterface extends DebotInterface {
  private userInfoStore: UserInfoStore;

  constructor(callbacks: any, userInfoStore: UserInfoStore) {
    super(callbacks);

    this.userInfoStore = userInfoStore;
    this.setMethods({
      get: this.get.bind(this)
    });
  }

  async get(body: any) {
    const { prompt } = body.value;

    const boxes = this.userInfoStore.getSigningBoxes();
    return new Promise((resolve) => {
      this.showMessage({
        type: "menu", description: "", title: BinUtils.hexToString(prompt),
        onInput: resolve, items: boxes.map((box: any, i: number) => { return {
          handlerId: "0", description: "", title: box.title
        }})
      });
    }).then(({ index }: any) => {
      const box = boxes[index];

      this.showMessage({ type: "print", text: box.title }, "right");
      return { result: { handle: box.signingBoxHandle }};
    });
  }
}

export { SigningBoxInputInterface }
