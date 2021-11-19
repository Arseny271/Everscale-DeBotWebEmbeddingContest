import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { DeBrowserMessagesInterceptor } from "./js/browser-messages-interceptor";

import { usePopupWindow } from "./components/popup/popup-window";
import { CountryPopupWindow } from "./components/popup/country-input-popup";
import { DateTimePopupWindow } from "./components/popup/date-time-input-popup";
import { QrCodePopupWindow } from "./components/popup/qrcode-input-popup";

import reportWebVitals from './reportWebVitals';

import './scrollbar.css';
import './themes.css';
import './main.css';
import "./index.css";

const BROWSER_ORIGIN = "https://debot.ever.arsen12.ru";

const App = () => {
	const [ promise, setPromise ] = useState<any>({ resolve: ()=>{}, reject: ()=>{} });
	const [ countryList, setCountryList ] = useState<any>([]);
	const [ dateTimeMessage, setDateTimeMessage ] = useState<any>({});

	const qrcodeReadWindow = usePopupWindow({});
	const countryInputWindow = usePopupWindow({});
	const dateTimeInputWindow = usePopupWindow({});

	const onQrCodeScan = (data: any) => {
		if (!data) return;
		promise.resolve({ value: data, status: 0 });
		qrcodeReadWindow.close();
	}

	const onCountryInput = (value: string) => {
		promise.resolve({ value });
		countryInputWindow.close();
	}

	const onDateTimeSelect = (timestamp: number) => {
		promise.resolve({ value: timestamp });
		dateTimeInputWindow.close();
	}

	useEffect(() => {
		const deBrowserMessagesInterceptor = new DeBrowserMessagesInterceptor("debot-browser", BROWSER_ORIGIN);
		deBrowserMessagesInterceptor.setListener(async (message: any) => {
			console.log("RECEIVE MESSAGE", message);

			if (message.type === "input-qrcode") {
				qrcodeReadWindow.open();
				return new Promise((resolve, reject) => { setPromise({resolve, reject})})
			} else if (message.type === "input-country") {
				setCountryList(message.countries);
				countryInputWindow.open();
				return new Promise((resolve, reject) => { setPromise({resolve, reject})})
			} else if (message.type === "input-date-time") {
				const { needInputTime, needInputDate, defaultDatetime,
					minDatetime, maxDatetime } = message;

				setDateTimeMessage({ needInputTime, needInputDate,
					defaultDatetime: new Date(defaultDatetime?defaultDatetime:new Date()),
					minDatetime: new Date(minDatetime?minDatetime:0),
					maxDatetime: new Date(maxDatetime?maxDatetime:new Date())
				});
				dateTimeInputWindow.open();
				return new Promise((resolve, reject) => { setPromise({resolve, reject})})
			} else if (message.type === "input-auto-complete") {
				const { request } = message;
				const answer: any = {};
				request.values.forEach((e: any) => { answer[e.value] = e.default });

				return { status: 0, ...answer };
			} else if (message.type === "media" && message.intercept === "popup") {
				return {};
			} else if (message.type === "draw-qrcode" && message.intercept === "popup") {
				return {};
			}

			throw new Error();
		})
	}, []);

	return <React.Fragment>
		<div className = "iframe-wrapper">
			<iframe id="debot-browser" title="debot-browser" src="https://debot.ever.arsen12.ru?address=0%3A5f05095ff76770295995bfbe2e9f0f3d7e9d07d3756e553354b84766606b1095&network=testnet&theme=dark&origin=https%3A%2F%2Fexample.debot.ever.arsen12.ru&intercept=%5Bmenu%3Anone%2Cinput%3Anone%2Cinput-address%3Anone%2Cinput-confirm%3Anone%2Cinput-amount%3Anone%2Cinput-number%3Anone%2Cinput-qrcode%3Apopup%2Cinput-country%3Apopup%2Cinput-date-time%3Apopup%2Cmedia%3Anone%2Cdraw-qrcode%3Anone%5D"></iframe>
			<p>iframe</p>
		</div>
		<QrCodePopupWindow settings = { qrcodeReadWindow } onScanData = { onQrCodeScan }/>
		<CountryPopupWindow settings = { countryInputWindow } onSelect = { onCountryInput } countries = { countryList }/>
		<DateTimePopupWindow settings = { dateTimeInputWindow } onSelect = { onDateTimeSelect } { ...dateTimeMessage } />
	</React.Fragment>
}

(() => ReactDOM.render(
    <React.StrictMode>
			<App/>
    </React.StrictMode>,
    document.getElementById('root')
))();

reportWebVitals();
