import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from "mobx-react";

import { ThemeWrapper } from "./components/theme-wrapper";

import { MessagesStore } from "./stores/message-store";
import { UserInfoStore } from "./stores/user-info-store";
import { DebotsStore } from "./stores/debots-store";

import { tonClient } from "./application-context";

import App from './App';
import reportWebVitals from './reportWebVitals';

import './scrollbar.css';
import './themes.css';
import './index.css';
import './main.css';

const messagesStore = new MessagesStore();
const userInfoStore = new UserInfoStore(tonClient);
const debotsStore = new DebotsStore();

const stores = {
  messagesStore,
  userInfoStore,
  debotsStore
};

(() => {
  ReactDOM.render(
    <React.StrictMode>
      <BrowserRouter>
        <ThemeWrapper>
          <Provider {...stores}>
            <App/>
          </Provider>
        </ThemeWrapper>
      </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
  );
})();

reportWebVitals();
