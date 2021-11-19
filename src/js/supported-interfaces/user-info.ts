import { DebotInterface } from "./debot-interface"
import { UserInfoStore } from "../../stores/user-info-store"

class UserInfoInterface extends DebotInterface {
  private userInfoStore: UserInfoStore;

  constructor(callbacks: any, userInfoStore: UserInfoStore) {
    super(callbacks);

    this.userInfoStore = userInfoStore;
    this.setMethods({
      getAccount: this.getAccount.bind(this),
      getSigningBox: this.getSigningBox.bind(this),
      getPublicKey: this.getPublicKey.bind(this)
    });
  }

  async getAccount(body: any) {
    const wallets = this.userInfoStore.getWallets();
    const { address } = wallets[0]?wallets[0]:{address:"0:0000000000000000000000000000000000000000000000000000000000000000"}

    return { result: { value: address }};
  }

  async getSigningBox(body: any) {
    const boxes = this.userInfoStore.getSigningBoxes();
    const { signingBoxHandle } = boxes[0]?boxes[0]:{signingBoxHandle:0};

    return { result: { handle: signingBoxHandle }};
  }

  async getPublicKey(body: any) {
    const boxes = this.userInfoStore.getSigningBoxes();
    const { publicKey } = boxes[0]?boxes[0]:{publicKey:"0"};

    return { result: { value: `0x${publicKey}` }};
  }
}

export { UserInfoInterface }
