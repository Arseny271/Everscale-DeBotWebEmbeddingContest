import { useState } from 'react';
import { observer, inject } from "mobx-react";
import { UserInfoStore, UserWalletInfo } from "../stores/user-info-store";
import { InputUtils } from "../utils/input-utils"
import { Icon } from "../components/informs/icon"

import "./user-page.css"


interface WalletInfoBlockProps {
  index: number;
  wallet: UserWalletInfo;
}


const WalletInfoBlock = inject("userInfoStore")(observer((props: WalletInfoBlockProps ) => {
  const [ titleEdit, setTitleEdit ] = useState<boolean>(false);
  const { userInfoStore }: { userInfoStore: UserInfoStore } = props as any;

  const [title, setTitle] = InputUtils.useInputHtmlEditable(props.wallet.title);
  const [address, setAddress] = InputUtils.useInputHtmlEditable(props.wallet.address);
  const [secretKey, setSecretKey] = InputUtils.useInputHtmlEditable((props.wallet.signingBox || {}).secretKey || "");

  const onSave = () => {
    userInfoStore.updateWallet(props.index, {
      title, address, signingBox: {
        title: `${title} key`,
        secretKey, publicKey: "", signingBoxHandle: -1
      }
    });
  }

  const onDelete = () => {
    userInfoStore.removeWallet(props.index);
  }

  return <div className = "wallet-info-block">
    <div className = "wallet-info-block-header">
      {titleEdit?
        <input type = "text" value = { title } onInput = { setTitle } name = "wallet-title" onBlur = {() => setTitleEdit(false)}/>:
        <p>{title}</p>
      }
      <Icon url = "/icons/edit.svg" iconSize = "45%" onClick = { () => setTitleEdit(true) } iconColor = "var(--chat-default-secondary-text-color)"/>
    </div>
    <form className = "wallet-info-block-info" autoComplete="off">
      <div className = "wallet-info-block-editable">
        <p>Address</p>
        <input type = "text" value = { address } onInput = { setAddress } name = "wallet-address"/>
      </div>
      <div className = "wallet-info-block-editable">
        <p>Secret Key</p>
        <input type = "password" value = { secretKey } onInput = { setSecretKey } name = "wallet-secret-key"/>
      </div>
      <div className = "wallet-info-buttons">
        <div className = "wallet-save-button" onClick = { onSave }> Save </div>
        <div className = "wallet-save-button" onClick = { onDelete }> Delete </div>
      </div>
    </form>
  </div>
}));



interface UserPageTypes {}

const UserPage = inject("userInfoStore")(observer((props: UserPageTypes) => {
  const { userInfoStore }: { userInfoStore: UserInfoStore } = props as any;
  const wallets = userInfoStore.getWallets();

  const createWallet = () => {
    userInfoStore.addWallet({ title: "New wallet", address: ""});
  }

  return <div className = "wallets-page">
    <div className = "wallets-header">
      <Icon url = "/icons/crystal.svg" iconSize = "65%" iconColor = "var(--chat-default-secondary-text-color)"/>

      <div className = "debot-chat-header-name">
        <b>Wallets</b>
        <p>Settings</p>
      </div>
    </div>

    <div className = "wallets-grid">
      { wallets.map((wallet: any, i: number) => <WalletInfoBlock key = {i} index = {i} wallet = { wallet }/>)}

      <div className = "wallets-add-button" onClick = { createWallet }> Add wallet </div>
    </div>
  </div>
}));

export { UserPage };
