(this["webpackJsonpmy-app"]=this["webpackJsonpmy-app"]||[]).push([[0],{23:function(e,t,n){},32:function(e,t,n){},33:function(e,t,n){},34:function(e,t,n){},35:function(e,t,n){},37:function(e,t,n){"use strict";n.r(t);var i=n(5),s=n.n(i),r=n(9),a=n(7),c=n(3),o=n(1),u=n.n(o),d=n(11),l=n.n(d),p=n(12),m=n(13),j=function(){function e(t,n){Object(p.a)(this,e),this.deBrowserOrigin=void 0,this.iframeId=void 0,this.iframe=void 0,this.window=void 0,this.messageEventListener=this.onMessageEvent.bind(this),this.listener=Object(a.a)(s.a.mark((function e(){return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:case"end":return e.stop()}}),e)}))),this.deBrowserOrigin=n,this.iframeId=t,this.iframe=window.document.getElementById(this.iframeId),this.window=this.iframe?this.iframe.contentWindow:null,window.addEventListener("message",this.messageEventListener)}return Object(m.a)(e,[{key:"onMessageEvent",value:function(e){var t=this;if(null!==this.iframe&&null!==this.window||(this.iframe=window.document.getElementById(this.iframeId),this.window=this.iframe?this.iframe.contentWindow:null),e.origin===this.deBrowserOrigin){var n=JSON.parse(e.data),i=n.key,s=n.payload;this.listener(s).then((function(e){null!==t.window&&t.window.postMessage(JSON.stringify({key:i,payload:e}),t.deBrowserOrigin)}),(function(e){null!==t.window&&t.window.postMessage(JSON.stringify({key:i,payload:e,error:!0}),t.deBrowserOrigin)}))}}},{key:"setListener",value:function(e){this.listener=e}}]),e}(),b=(n(23),n(2)),h=function(e){var t=Object(o.useState)(!1),n=Object(c.a)(t,2),i=n[0],s=n[1];return{open:function(){s(!0)},close:function(){s(!1)},isActive:i,onClose:function(){e.onClose&&e.onClose(),s(!1)}}},f=function(e){var t=e.settings?e.settings.onClose:e.onClose,n=e.settings?e.settings.isActive:e.isActive;return Object(b.jsx)("div",{onMouseDown:function(e){var n;0!==(n=e).target.className.length&&t&&"modal-window-background"===n.target.className.split(" ")[0]&&t()},className:"modal-window-background window-".concat(n?"active":"hidden"),children:Object(b.jsx)("div",{className:"modal-window-wrapper "+e.className,children:Object(b.jsx)("div",{className:"modal-window custom-scrollbar",children:e.children})})})},O=function(e){var t=Object(o.useState)(""),n=Object(c.a)(t,2),i=n[0],s=n[1],r=e.countries.filter((function(e){return-1!==e[0].toLowerCase().indexOf(i.toLowerCase())}));return Object(b.jsxs)(f,{className:"country-input-popup-body",settings:e.settings,children:[Object(b.jsxs)("div",{className:"debot-chat-popup-header country-input-header",children:[Object(b.jsx)("p",{className:"close",onClick:function(){return e.settings.close()},children:"Close"}),Object(b.jsx)("p",{className:"header",children:"Choose a Country"})]}),Object(b.jsx)("div",{className:"debot-chat-popup-header country-input-header search",children:Object(b.jsx)("input",{type:"text",value:i,onInput:function(e){s(e.target.value)},placeholder:"Search..."})}),Object(b.jsx)("div",{className:"country-input-list custom-scrollbar",children:r.map((function(t,n){var i="url(/flags/32x32/".concat(t[1].toLowerCase(),".png)");return Object(b.jsx)("div",{className:"country-input-item",onClick:function(){return e.onSelect(t[1])},children:Object(b.jsxs)("div",{className:"country-input-item-body",children:[Object(b.jsx)("div",{className:"country-input-item-icon",style:{backgroundImage:i}}),Object(b.jsx)("p",{className:"country-input-item-text",children:t[0]})]})},n)}))})]})},w=n(17),v=n(14),x=n.n(v),g=function(e){var t=Object(o.useState)(e.defaultDatetime),n=Object(c.a)(t,2),i=n[0],s=n[1],r=Object(o.useState)("00:00"),a=Object(c.a)(r,2),u=a[0],d=a[1],l=u.split(":").map((function(e){return parseInt(e)})),p=(i/1+60*l[0]*60*1e3+60*l[1]*1e3)/1e3|0;return Object(b.jsxs)(f,{className:"datetime-input-popup-body",settings:e.settings,children:[Object(b.jsxs)("div",{className:"debot-chat-popup-header datetime-input-header",children:[Object(b.jsx)("p",{className:"close",onClick:function(){return e.settings.close()},children:"Close"}),Object(b.jsx)("p",{className:"header",children:"Choose a date"}),Object(b.jsx)("p",{className:"select",onClick:function(){return e.onSelect(p)},children:"Enter"})]}),Object(b.jsxs)("div",{className:"datetime-input-wrapper",children:[e.needInputDate&&Object(b.jsx)("div",{className:"datetime-input-block datetime-calendar",children:Object(b.jsx)(w.a,{value:i,onChange:function(e){return s(e)},locale:"en-EN",minDate:e.minDatetime,maxDate:e.maxDatetime})}),e.needInputTime&&Object(b.jsx)("div",{className:"datetime-input-block datetime-timeinput",children:Object(b.jsxs)("div",{className:"datetime-timeinput-row",children:[Object(b.jsx)("p",{children:"Time"}),Object(b.jsx)(x.a,{onChange:function(e){d(e.target.value)},value:u,colon:":"})]})})]})]})},y=n(15),N=n.n(y),C=function(e){var t=Object(o.useState)(!1),n=Object(c.a)(t,2),i=n[0],s=n[1];return Object(b.jsxs)(f,{className:"qrcode-input-popup-body",settings:e.settings,children:[Object(b.jsxs)("div",{className:"debot-chat-popup-header",children:[Object(b.jsx)("p",{className:"close",onClick:function(){return e.settings.close()},children:"Close"}),Object(b.jsx)("p",{className:"header",children:"Scan a QR code"})]}),Object(b.jsxs)("div",{className:i?"qrcode-container error":"qrcode-container",children:[e.settings.isActive&&Object(b.jsx)(N.a,{showViewFinder:!1,onError:function(e){return s(!0)},onScan:e.onScanData}),i&&Object(b.jsx)("div",{className:"qrcode-scan-error-block",children:Object(b.jsx)("p",{children:"To scan QR codes, allow access to your device's camera"})})]})]})},k=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,38)).then((function(t){var n=t.getCLS,i=t.getFID,s=t.getFCP,r=t.getLCP,a=t.getTTFB;n(e),i(e),s(e),r(e),a(e)}))},D=(n(32),n(33),n(34),n(35),function(){var e=Object(o.useState)({resolve:function(){},reject:function(){}}),t=Object(c.a)(e,2),n=t[0],i=t[1],d=Object(o.useState)([]),l=Object(c.a)(d,2),p=l[0],m=l[1],f=Object(o.useState)({}),w=Object(c.a)(f,2),v=w[0],x=w[1],y=h({}),N=h({}),k=h({});return Object(o.useEffect)((function(){new j("debot-browser","https://debot.ever.arsen12.ru").setListener(function(){var e=Object(a.a)(s.a.mark((function e(t){var n,a,c,o,u,d,l;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(console.log("RECEIVE MESSAGE",t),"input-qrcode"!==t.type){e.next=6;break}return y.open(),e.abrupt("return",new Promise((function(e,t){i({resolve:e,reject:t})})));case 6:if("input-country"!==t.type){e.next=12;break}return m(t.countries),N.open(),e.abrupt("return",new Promise((function(e,t){i({resolve:e,reject:t})})));case 12:if("input-date-time"!==t.type){e.next=19;break}return n=t.needInputTime,a=t.needInputDate,c=t.defaultDatetime,o=t.minDatetime,u=t.maxDatetime,x({needInputTime:n,needInputDate:a,defaultDatetime:new Date(c||new Date),minDatetime:new Date(o||0),maxDatetime:new Date(u||new Date)}),k.open(),e.abrupt("return",new Promise((function(e,t){i({resolve:e,reject:t})})));case 19:if("input-auto-complete"!==t.type){e.next=26;break}return d=t.request,l={},d.values.forEach((function(e){l[e.value]=e.default})),e.abrupt("return",Object(r.a)({status:0},l));case 26:if("media"!==t.type||"popup"!==t.intercept){e.next=30;break}return e.abrupt("return",{});case 30:if("draw-qrcode"!==t.type||"popup"!==t.intercept){e.next=32;break}return e.abrupt("return",{});case 32:throw new Error;case 33:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}())}),[]),Object(b.jsxs)(u.a.Fragment,{children:[Object(b.jsxs)("div",{className:"iframe-wrapper",children:[Object(b.jsx)("iframe",{id:"debot-browser",title:"debot-browser",src:"https://debot.ever.arsen12.ru?address=0%3A5f05095ff76770295995bfbe2e9f0f3d7e9d07d3756e553354b84766606b1095&network=testnet&theme=dark&origin=https%3A%2F%2Fexample.debot.ever.arsen12.ru&intercept=%5Bmenu%3Anone%2Cinput%3Anone%2Cinput-address%3Anone%2Cinput-confirm%3Anone%2Cinput-amount%3Anone%2Cinput-number%3Anone%2Cinput-qrcode%3Apopup%2Cinput-country%3Apopup%2Cinput-date-time%3Apopup%2Cmedia%3Anone%2Cdraw-qrcode%3Anone%5D"}),Object(b.jsx)("p",{children:"iframe"})]}),Object(b.jsx)(C,{settings:y,onScanData:function(e){e&&(n.resolve({value:e,status:0}),y.close())}}),Object(b.jsx)(O,{settings:N,onSelect:function(e){n.resolve({value:e}),N.close()},countries:p}),Object(b.jsx)(g,Object(r.a)({settings:k,onSelect:function(e){n.resolve({value:e}),k.close()}},v))]})});l.a.render(Object(b.jsx)(u.a.StrictMode,{children:Object(b.jsx)(D,{})}),document.getElementById("root")),k()}},[[37,1,2]]]);