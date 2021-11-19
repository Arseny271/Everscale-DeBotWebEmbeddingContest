import React, { useState, useEffect } from "react";
import { observer, inject } from "mobx-react";
import { DebotBrowser } from "../js/debot-browser"
import { ChatWindow } from "../components/debot-window";

import { TonClientHooks } from "../utils/hooks";
import { RouterUtils } from "../utils/router-utils";



interface DebotPageTypes {}

const DebotPage = inject("debotsStore")(inject("userInfoStore")(inject("messagesStore")(observer((props: DebotPageTypes) => {
  const { messagesStore, userInfoStore, debotsStore } = props as any;

  const iFrameMessagesController = TonClientHooks.useIFrameMessagesController();
  const tonClient = TonClientHooks.useTonClient();

  const { address } = RouterUtils.useSearch();
  const decodedIntercept = RouterUtils.useMapFromSearch("intercept");

  const [browser] = useState<DebotBrowser>(new DebotBrowser(
    tonClient, messagesStore, userInfoStore, debotsStore,
    iFrameMessagesController, decodedIntercept, address));

  useEffect(() => {browser.init().then(() => browser.start())}, [browser])

  return <ChatWindow address = { address }/>
}))));

export { DebotPage };
