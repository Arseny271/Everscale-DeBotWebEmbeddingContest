import React from 'react';
import { TonClient } from '@tonclient/core';
import { libWeb } from '@tonclient/lib-web';

import { IFrameMessagesController } from "./js/iframe-messages-controller"
import { RouterUtils } from "./utils/router-utils"

const search = RouterUtils.getSearch();
const parentOrigin = search.origin;
const network = ({ mainnet: "main", testnet: "net" })[search.network || ""];

const TON_CLIENT_CONFIG = {
  network: {
      endpoints: [`${network}1.ton.dev`, `${network}5.ton.dev`],
      message_processing_timeout: 60000,
      message_retries_count: 3
  }
};

(() => {
  TonClient.useBinaryLibrary(libWeb);
})();

const iFrameMessagesController = new IFrameMessagesController(parentOrigin);
const tonClient = new TonClient(TON_CLIENT_CONFIG);

const AppContext = React.createContext({ tonClient, iFrameMessagesController });

export { AppContext, tonClient }
