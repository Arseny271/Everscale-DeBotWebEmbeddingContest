import { useContext } from 'react';
import { UtilsModule } from '@tonclient/core';
import { AppContext } from "../application-context";

import { IFrameMessagesController } from "../js/iframe-messages-controller"


function useTonClient() {
  const { tonClient } = useContext(AppContext);
  return tonClient;
}

function useTonClientUtils(): UtilsModule {
  const { tonClient } = useContext(AppContext);
  return tonClient.utils;
}

function useIFrameMessagesController(): IFrameMessagesController {
  const { iFrameMessagesController } = useContext(AppContext);
  return iFrameMessagesController;
}

const TonClientHooks = {
  useIFrameMessagesController,
  useTonClientUtils,
  useTonClient
}

export { TonClientHooks }
