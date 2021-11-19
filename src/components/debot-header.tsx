import React from "react";
import { observer, inject } from "mobx-react";

import { DebotsStore } from "../stores/debots-store"
//import { Icon } from "./informs/icon"


interface ChatHeaderProps {
  address: string;
}

const ChatHeader = inject("debotsStore")(observer((props: ChatHeaderProps) => {
  const debotsStore: DebotsStore = (props as any).debotsStore;

  const debotInfo = debotsStore.getDebotInfo(props.address);
  if (!debotInfo) return <div className = "debot-chat-header"/>

  return <div className = "debot-chat-header">
    <img className = "debot-chat-header-icon" alt = "icon" src = { debotInfo.icon }/>
    <div className = "debot-chat-header-name">
      <b>{debotInfo.name}</b>
      <p>Everscale DeBot</p>
    </div>
    {/*<Icon url = "/icons/info.svg" iconColor = "#777777" iconSize = "32px"/>
    <div className = "debot-info-sideblock">
      <div className = "debot-info-sideblock-main">
        <img className = "debot-info-sideblock-icon" alt = "icon" src = { debotInfo.icon }/>
        <div className = "debot-info-sideblock-headers">
          <p className = "debot-info-sideblock-name">{debotInfo.name}</p>
          <p className = "debot-info-sideblock-caption">{debotInfo.caption}</p>
        </div>
        <Icon url = "/icons/info.svg" iconColor = "#777777" iconSize = "32px"/>
      </div>
    </div>*/}
  </div>
}));

export { ChatHeader };
