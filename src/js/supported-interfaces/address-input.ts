import { DebotInterface } from "./debot-interface"
import { UserInfoStore } from "../../stores/user-info-store"
import { BinUtils } from "../../utils/bin-utils"

class AddressInputInterface extends DebotInterface {
  private userInfoStore: UserInfoStore;

  constructor(callbacks: any, userInfoStore: UserInfoStore) {
    super(callbacks);

    this.userInfoStore = userInfoStore;
    this.setMethods({
      get: this.get.bind(this),
    });
  }

  async get(body: any) {
    const { prompt } = body.value;
    const wallets = this.userInfoStore.getWallets();

    return new Promise<any>((resolve) => {
      this.showMessage({
        prompt: BinUtils.hexToString(prompt), type: "input-address",
        onInput: resolve, items: wallets.map(wallet => { return {
          title: wallet.title, description: "", handlerId: ""
        }})
      })
    }).then(({ value, index }) => {
      if (index !== undefined) {
        const wallet = wallets[index];
        this.showMessage({ type: "print", text: wallet.title}, "right");
        this.showMessage({ type: "print", text: wallet.address }, "right");
        return { result: { value: wallet.address }};
      } else {
        this.showMessage({ type: "print", text: value }, "right");
        return { result: { value }};
      }
    });
  }
}

export { AddressInputInterface }
