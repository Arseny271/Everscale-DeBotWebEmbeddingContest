import { useState } from 'react';
import { InputUtils } from "../utils/input-utils"
import { Icon } from "../components/informs/icon"

import "./generate-page.css"

interface GeneratePageTypes {}

const THEME_TAGS = [
	"--chat-background-color",
	"--chat-background-secondary-color",
	"--chat-background-border-color",
	"--chat-header-background-color",
	"--chat-primary-text-color",
	"--chat-primary-inverted-text-color",
	"--chat-default-text-color",
	"--chat-default-secondary-text-color",
	"--chat-default-secondary-2-text-color",
	"--chat-input-error-color",
	"--chat-camera-not-ready-background-color",
	"--chat-camera-not-ready-text-color",
	"--debot-message-bubble-color",
	"--debot-message-text-color",
	"--user-message-bubble-color",
	"--user-message-text-color",
	"--confirm-yes-bubble-color",
	"--confirm-yes-text-color",
	"--confirm-no-bubble-color",
	"--confirm-no-text-color",
	"--chat-button-border-color",
	"--chat-button-text-color",
	"--chat-button-background-color"
]

const LIGHT_THEME = {
	"--chat-background-color": "#fcfcfc",
	"--chat-background-secondary-color": "#f0f0f0",
	"--chat-background-border-color": "#e2e3e4",
	"--chat-header-background-color": "#ffffff",
	"--chat-primary-text-color": "#0073c4",
	"--chat-primary-inverted-text-color": "#ffffff",
	"--chat-default-text-color": "#000000",
	"--chat-default-secondary-text-color": "#888888",
	"--chat-default-secondary-2-text-color": "#b6b8ba",
	"--chat-input-error-color": "#f44336",
	"--chat-camera-not-ready-background-color": "#131719",
	"--chat-camera-not-ready-text-color": "#ffffff",
	"--debot-message-bubble-color": "#f4f4f4",
	"--debot-message-text-color": "#000000",
	"--user-message-bubble-color": "#0083e0",
	"--user-message-text-color": "#ffffff",
	"--confirm-yes-bubble-color": "#36c05c",
	"--confirm-yes-text-color": "#ffffff",
	"--confirm-no-bubble-color": "#e71717",
	"--confirm-no-text-color": "#ffffff",
	"--chat-button-border-color": "#0073c4",
	"--chat-button-text-color": "#0073c4",
	"--chat-button-background-color": "#ffffff",
}

const DARK_THEME = {
	"--chat-background-color": "#20262a",
	"--chat-background-secondary-color": "#292f32",
	"--chat-background-border-color": "#32373b",
	"--chat-header-background-color": "#1e2124",
	"--chat-primary-text-color": "#0083e0",
	"--chat-primary-inverted-text-color": "#ffffff",
	"--chat-default-text-color": "#ffffff",
	"--chat-default-secondary-text-color": "#adb0b1",
	"--chat-default-secondary-2-text-color": "#b6b8ba",
	"--chat-input-error-color": "#d7180a",
	"--chat-camera-not-ready-background-color": "#131719",
	"--chat-camera-not-ready-text-color": "#ffffff",
	"--debot-message-bubble-color": "#292f32",
	"--debot-message-text-color": "#ffffff",
	"--user-message-bubble-color": "#0073c4",
	"--user-message-text-color": "#ffffff",
	"--confirm-yes-bubble-color": "#36c05c",
	"--confirm-yes-text-color": "#ffffff",
	"--confirm-no-bubble-color": "#e71717",
	"--confirm-no-text-color": "#ffffff",
	"--chat-button-border-color": "#0073c4",
	"--chat-button-text-color": "#0083e0",
	"--chat-button-background-color": "#20262a",
}

const INTERCEPTED_INTERFACES_LIST = [
  "menu", "input", "input-address", "input-confirm", "input-amount",
  "input-number", "input-qrcode", "input-country", "input-date-time",
  "media", "draw-qrcode"
];

const INTERCEPTED_INTERFACES = {
  "menu": ["none", "all"],
  "input": ["none", "all"],
  "input-address": ["none", "all"],
  "input-confirm": ["none", "all"],
  "input-amount": ["none", "all"],
  "input-number": ["none", "all"],
  "input-qrcode": ["none", "popup", "all"],
  "input-country": ["none", "popup", "all"],
  "input-date-time": ["none", "popup", "all"],
  "media": ["none", "popup"],
  "draw-qrcode": ["none", "popup"],
};

const INTERCEPTED_DEFAULT = {
  "menu": "none",
  "input": "none",
  "input-address": "none",
  "input-confirm": "none",
  "input-amount": "none",
  "input-number": "none",
  "input-qrcode": "none",
  "input-country": "none",
  "input-date-time": "none",
  "media": "none",
  "draw-qrcode": "none",
};


const GeneratePage = (props: GeneratePageTypes) => {
  const [address, setAddress] = InputUtils.useInputHtmlEditable("0:5f05095ff76770295995bfbe2e9f0f3d7e9d07d3756e553354b84766606b1095");
  const [site, setSite] = InputUtils.useInputHtmlEditable("https://example.com");
  const [currentTheme, setCurrentTheme] = useState<any>(LIGHT_THEME);
  const [theme, setTheme] = useState<string>("0");
  const [network, setNetwork] = useState<string>("0");
  const [intercepted, setIntercepted] = useState<any>(INTERCEPTED_DEFAULT);
  const [extended, setExtended] = useState<boolean>(false);

  const DEBROWSER_URL = "https://debot.ever.arsen12.ru";
  const ENCODED_ADDRESS = `?address=${encodeURIComponent(address)}`;
  const ENCODED_NETWORK = `&network=${encodeURIComponent(["mainnet", "testnet"][network as any])}`;
  const ENCODED_CUSTOM_THEME = (theme === "2")?`&colors=${encodeURIComponent(`[${THEME_TAGS.map(k => `${k}:${currentTheme[k]}`).join(",")}]`)}`:"";
  const ENCODED_THEME = (theme !== "2")?`&theme=${encodeURIComponent(["light", "dark"][theme as any])}`:"";
  const ENCODED_ORIGIN = (extended)?`&origin=${encodeURIComponent(site)}`:"";
  const ENCODED_INTERCEPTED = (extended)?`&intercept=${encodeURIComponent(`[${INTERCEPTED_INTERFACES_LIST.map(k => `${k}:${intercepted[k]}`).join(",")}]`)}`:"";
  const URL = `${DEBROWSER_URL}${ENCODED_ADDRESS}${ENCODED_NETWORK}${ENCODED_CUSTOM_THEME}${ENCODED_THEME}${ENCODED_ORIGIN}${ENCODED_INTERCEPTED}`
  const [iframeUrl, setIframeUrl] = useState<string>(URL);

  const onUpdate = () => {
    setIframeUrl(URL);
  }

  const onColorInput = (tag: string, color: string) => {
    currentTheme[tag] = color;
    setCurrentTheme(Object.assign({}, currentTheme));
  }

  const onInterceptedChange = (tag: string, value: string) => {
    intercepted[tag] = value;
    setIntercepted(Object.assign({}, intercepted));
  }

  return <div className = "wallets-page">
    <div className = "wallets-header">
      <Icon url = "/icons/crystal.svg" iconSize = "65%" iconColor = "var(--chat-default-secondary-text-color)"/>
      <div className = "debot-chat-header-name">
        <b>Generator</b>
        <p>{"<iframe/>"}</p>
      </div>
    </div>

    <div className = "iframe-generator-page">
      <div className = "iframe-wrapper">
        <iframe id = "debot-browser" title = "debot-browser" src = { iframeUrl }>
        </iframe>
      </div>
      <form className = "settings-form">
        <div className = "wallet-info-block-editable">
          <p>DeBot Address</p>
          <input type = "text" value = { address } onInput = { setAddress } name = "wallet-address"/>
        </div>
        <div className = "wallet-info-block-editable-half">
          <div className = "wallet-info-block-editable">
            <p>Network</p>
            <select value = { network } onChange = {(e: any) => setNetwork(e.target.value)}>
              <option value = "0">Mainnet</option>
              <option value = "1">Testnet</option>
            </select>
          </div>
          <div className = "wallet-info-block-editable">
            <p>Theme</p>
            <select value = { theme } onChange = {(e: any) => {
              setTheme(e.target.value); if (e.target.value < 2) {
                setCurrentTheme([LIGHT_THEME, DARK_THEME][e.target.value])
            }}}>
              <option value = "0">Light</option>
              <option value = "1">Dark</option>
              <option value = "2">Custom</option>
            </select>
          </div>
        </div>

        {theme === "2" && <div className = "wallet-info-block-editable">
          <p>Custom theme</p>
          {THEME_TAGS.map((tag: string, i: number) => {
            return <div className = "wallet-custom-theme-row" key = {i}>
              <p>{tag}</p><i style = {{background: currentTheme[tag]}}/>
              <input type = "text" value = { currentTheme[tag] } onInput = {(e: any) => onColorInput(tag, e.target.value)}/>
            </div>
          })}
        </div>}

        <div className = "wallet-info-block-editable">
          <p>Extended mode
            <input type = "checkbox" checked = { extended } onChange = { (e: any) => setExtended(e.target.checked) } name = "site-address"/>
          </p>
        </div>

        {extended && <div className = "wallet-info-block-editable">
          <p>Site Origin</p>
          <input type = "text" value = { site } onInput = { setSite } name = "site-address"/>
        </div>}

        {extended && <div className = "wallet-info-block-editable">
          <p>Interception of interface calls</p>
          {INTERCEPTED_INTERFACES_LIST.map((tag: string, i: number) => {
            return <div className = "wallet-custom-theme-row" key = {i}>
              <p>{tag}</p>
              <select value = { intercepted[tag] } onChange = {(e: any) => {
                onInterceptedChange(tag, e.target.value);
              }}>
                {(INTERCEPTED_INTERFACES as any)[tag].map((val: string, i: number) => {
                  return <option key = {i} value = {val}>{val}</option>
                })}
              </select>

            </div>
          })}
        </div>}
        <div className = "wallet-info-buttons" style = {{marginTop: "auto"}}>
          <div className = "wallet-save-button" onClick = { onUpdate }> Update </div>
        </div>


      </form>
    </div>
    <div className = "iframe-generator-result-wrapper">
      <div className = "iframe-generator-result">
        <div className = "wallet-info-block-editable">
          <p>Result</p>
          <textarea value = { `<iframe id="debot-browser" title="debot-browser" src="${iframeUrl}"></iframe>` }/>
        </div>
      </div>
    </div>
  </div>
};



export { GeneratePage };
