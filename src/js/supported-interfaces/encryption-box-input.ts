import { DebotInterface } from "./debot-interface"
import { UserInfoStore } from "../../stores/user-info-store"
import { BinUtils } from "../../utils/bin-utils"

class EncryptionBoxInputInterface extends DebotInterface {
  private userInfoStore: UserInfoStore;

  constructor(callbacks: any, userInfoStore: UserInfoStore) {
    super(callbacks);

    this.userInfoStore = userInfoStore;
    this.setMethods({
      getSupportedAlgorithms: this.getSupportedAlgorithms.bind(this)
    });
  }

  async getSupportedAlgorithms(body: any) {
    return { result: { names: [
      BinUtils.stringToHex("ChaCha20"),
      BinUtils.stringToHex("NaclBox"),
      BinUtils.stringToHex("NaclSecretBox")
    ]}};
  }
}

export { EncryptionBoxInputInterface }
