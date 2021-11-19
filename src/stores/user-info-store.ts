import { makeObservable, observable, action, runInAction } from "mobx"
import { TonClient, SigningBoxHandle } from '@tonclient/core';


export type UserSigningBoxInfo = {
  title: string;
  secretKey: string;
  publicKey: string;
  signingBoxHandle: SigningBoxHandle;
}

export type UserWalletInfo = {
  title: string;
  address: string;
  signingBox?: UserSigningBoxInfo;
}

class UserInfoStore {
  private tonClient: TonClient;
  private wallets: UserWalletInfo[] = [];
  private initPromise: Promise<void>;

  constructor(tonClient: TonClient) {
    this.tonClient = tonClient;

    this.wallets = JSON.parse(window.localStorage.getItem("wallets") || "[]");
    this.wallets.forEach(wallet => {
      if (wallet.signingBox) { wallet.signingBox.signingBoxHandle = -1 }
    });

    makeObservable(this, {
        wallets: observable,
        updateWallet: action,
        addWallet: action,
        removeWallet: action
    } as any);

    this.initPromise = this.init();
  }

  private async init(): Promise<void> {
    await Promise.allSettled(this.wallets.map(async (wallet: UserWalletInfo) => {
      if (!wallet.signingBox) { return }

      const signingBox = wallet.signingBox;
      const secret = signingBox.secretKey;
      return this.tonClient.crypto.nacl_sign_keypair_from_secret_key({ secret }).then(keypair => {
        runInAction(() => { signingBox.publicKey = keypair.public });
        return this.tonClient.crypto.get_signing_box({ secret, public: keypair.public })
      }).then(({ handle }) => {
        runInAction(() => { signingBox.signingBoxHandle = handle });
      }).catch((e: any) => {
        runInAction(() => { delete wallet.signingBox });
      });
    }));

    window.localStorage.setItem("wallets", JSON.stringify(this.wallets));
  }

  public updateWallet(index: number, wallet: UserWalletInfo) {
    this.wallets[index] = wallet;
    window.localStorage.setItem("wallets", JSON.stringify(this.wallets));
  }

  public addWallet(wallet: UserWalletInfo) {
    this.wallets.push(wallet);
    window.localStorage.setItem("wallets", JSON.stringify(this.wallets));
  }

  public removeWallet(index: number) {
    this.wallets = this.wallets.filter((wallet, i) => i !== index);
    window.localStorage.setItem("wallets", JSON.stringify(this.wallets));
  }

  public async awaitInit(): Promise<void> {
    return this.initPromise;
  }

  public getWallets(): UserWalletInfo[] {
    return this.wallets;
  }

  public getSigningBoxes(): UserSigningBoxInfo[] {
    return this.wallets.map(wallet => wallet.signingBox).filter(box => box !== undefined) as any;
  }
}

export { UserInfoStore }
