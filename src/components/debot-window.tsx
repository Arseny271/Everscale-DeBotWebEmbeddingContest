import React, { useState } from "react";
import { observer, inject } from "mobx-react";
import QRCode from "react-qr-code";

import { ResizedTextarea } from "./input/resized-textaera"

import { usePopupWindow } from "./popup/popup-window";
import { CountryPopupWindow } from "./popup/country-input-popup";
import { DateTimePopupWindow } from "./popup/date-time-input-popup";
import { QrCodePopupWindow } from "./popup/qrcode-input-popup";

import { MessagesStore, MessageInfo, MessageItem } from "../stores/message-store"
import { TonClientHooks } from "../utils/hooks"
import { AmountUtils } from "../utils/amount-utils"

import { ChatHeader } from "./debot-header"

interface ChatMessageProps {
  message: MessageInfo;
}

/* Messages */

const ChatWindowMessagePrint = (props: ChatMessageProps) => {
  const { message } = props.message as any;
  return <div className = {`debot-chat-message-inner ${message.style||""}`}>
    <div className = "debot-chat-message-inner-text">
      { message.text }
    </div>
  </div>
}

const ChatWindowMessageInput = (props: ChatMessageProps) => {
  const { message } = props.message as any;
  return <div className = "debot-chat-message-inner">
    <div className = "debot-chat-message-inner-text">
      { message.prompt }
    </div>
  </div>
}

const ChatWindowMessageAddressInput = ChatWindowMessageInput;
const ChatWindowMessageAmountInput = ChatWindowMessageInput;
const ChatWindowMessageNumberInput = ChatWindowMessageInput;
const ChatWindowMessageConfirmInput = ChatWindowMessageInput;
const ChatWindowMessageCountryInput = ChatWindowMessageInput;
const ChatWindowMessageDateTimeInput = ChatWindowMessageInput;
const ChatWindowMessageQrcodeRead = ChatWindowMessageInput;

const ChatWindowMessageApprove = (props: ChatMessageProps) => {
  const { message } = props.message as any;
  const { transaction } = message;
  const { fee, out } = transaction;

  const feeStr = fee.toString().padStart(10, "0");
  const totalStr = out.reduce((previousValue: number, currentValue: any) => {
    return currentValue.amount + previousValue;
  }, 0).toString().padStart(10, "0");

  return <div className = "debot-chat-message-inner message-approve">
    <div className = "debot-chat-message-approve">
      <div className = "debot-chat-message-approve-header">
        <b>Transaction confirmation</b>
      </div>
      <div className = "debot-chat-message-approve-fees">
        <b>Total</b>
        <p>{totalStr.slice(0, -9)}<span>{`,${totalStr.slice(-9)} TON`}</span></p>
      </div>
      <div className = "debot-chat-message-approve-fees">
        <b>Fees</b>
        <p>{feeStr.slice(0, -9)}<span>{`,${feeStr.slice(-9)} TON`}</span></p>
      </div>
    </div>
  </div>
}

const ChatWindowMessageMenu = (props: ChatMessageProps) => {
  const { message } = props.message as any;
  return <div className = "debot-chat-message-inner">
    <div className = "debot-chat-message-inner-text">
      { message.title }
    </div>
  </div>
}

const ChatWindowMessageQrcodeDraw = (props: ChatMessageProps) => {
  const { message } = props.message as any;
  const { intercept } = message;

  const iFrameMessagesController = TonClientHooks.useIFrameMessagesController();
  const clickable = intercept === "all" || intercept === "popup";

  const onClick = () => {
    if (!clickable) return;
    iFrameMessagesController.send(message);
  }

  return <div className = "debot-chat-message-inner">
    <div className = "debot-chat-message-inner-qrcode" onClick = { onClick } style = {{ cursor: clickable?"pointer":"default" }}>
      <QRCode size = { 175 } value = { message.text } />
    </div>
  </div>
}

const ChatWindowMessageMedia = (props: ChatMessageProps) => {
  const { message } = props.message as any;
  const { intercept } = message;

  const iFrameMessagesController = TonClientHooks.useIFrameMessagesController();
  const clickable = intercept === "all" || intercept === "popup";

  const onClick = () => {
    if (!clickable) return;
    iFrameMessagesController.send(message);
  }

  return <div className = "debot-chat-message-inner message-media">
    <div style = {{ cursor: clickable?"pointer":"default" }} className = "message-media-wrapper">
      <img className = "message-media-media" alt = "media" src = { message.data } onClick = { onClick }/>
    </div>
  </div>
}


/* Inputs */

const ChatWindowInputInput = (props: ChatMessageProps) => {
  const { message } = props.message as any;
  const [ text, setText ] = useState<string>("")
  const onInput = (e: any) => {setText(e.target.value)}
  const rows = text.split(/\r\n|\r|\n/).length;

  return <div className = "debot-chat-input-input">
    <ResizedTextarea value = {text} onInput = {onInput} rows = { rows } placeholder = "Write a message"/>
    <div className = "debot-chat-input-send" onClick = {() => { message.onInput({value: text}) }}/>
  </div>;
}

const ChatWindowInputAddressInput = (props: ChatMessageProps) => {
  const { message } = props.message as any;

  const TonClientUtils = TonClientHooks.useTonClientUtils();
  const [ text, setText ] = useState<string>("");
  const [ valid, setValid ] = useState<boolean>(true);

  const showSendButton = valid && text.length > 0;

  const onInput = (e: any) => {
    const address = e.target.value.replace(/\s+/g, "");
    e.target.value = address;
    if (address.length !== 0) {
      TonClientUtils.get_address_type({ address })
        .then(() => setValid(true), () => setValid(false));
    } else setValid(true);
    setText(address);
  }

  const onSend = () => {
    TonClientUtils.convert_address({ address: text, output_format: { type: "Hex" }})
      .then(({ address }) => { message.onInput({ value: address })})
  }

  return <React.Fragment>
    <div className = "debot-chat-input-input">
      <ResizedTextarea value = { text } onInput = { onInput } rows = { 1 } placeholder = "Address"/>
      { showSendButton && <div className = "debot-chat-input-send" onClick = { onSend }/> }
    </div>
    {!valid && <p className = "debot-chat-input-error">Invalid address</p>}
  </React.Fragment>
}

const ChatWindowInputAmountInput = (props: ChatMessageProps) => {
  const { message } = props.message as any;
  const { min, max, decimals } = message;

  const [ text, setText ] = useState<string>("");
  const [ valid, setValid ] = useState<boolean>(true);

  const amountMin = AmountUtils.print(min, decimals);
  const amountMax = AmountUtils.print(max, decimals);
  const amountInfo = `min ${amountMin} - max ${amountMax}`;

  const onInput = (e: any) => {
    const amount = e.target.value;
    const valid = (AmountUtils.compare(amount, amountMin, decimals) !== -1)
      && (AmountUtils.compare(amount, amountMax, decimals) !== 1);

    setValid(valid);
    setText(amount);
  }

  const onSend = () => message.onInput({ value: AmountUtils.normalize(text, decimals)});

  return <React.Fragment>
    <p className = "debot-chat-input-amount-info">{ amountInfo }</p>
    <div className = "debot-chat-input-input">
      <ResizedTextarea value = { text } onInput = { onInput } rows = { 1 } placeholder = "Amount..."/>
      {valid && text.length > 0 && <div className = "debot-chat-input-send" onClick = { onSend }/>}
    </div>
  </React.Fragment>
}

const ChatWindowInputNumberInput = (props: ChatMessageProps) => {
  const { message } = props.message as any;
  const { min, max } = message;

  const [ text, setText ] = useState<string>("");
  const [ valid, setValid ] = useState<boolean>(true);
  const amountInfo = `min ${min} - max ${max}`;

  const onInput = (e: any) => {
    try {
      const input = e.target.value.replace(/[^0-9-]+/g,"");
      const amount = BigInt(input);
      const minInt = BigInt(min);
      const maxInt = BigInt(max);

      const valid = (minInt <= amount) && (amount <= maxInt);
      setValid(valid);
      setText(input);
    } catch (error) { }
  }

  const onSend = () => message.onInput({ value: AmountUtils.normalize(text, 0)});

  return <React.Fragment>
    <p className = "debot-chat-input-amount-info">{ amountInfo }</p>
    <div className = "debot-chat-input-input">
      <ResizedTextarea value = { text } onInput = { onInput } rows = { 1 } placeholder = "Number..."/>
      {valid && text.length > 0 && <div className = "debot-chat-input-send" onClick = { onSend }/>}
    </div>
  </React.Fragment>
}



/* Post Message */

const ChatWindowMessagePostMessageStart = (props: ChatMessageProps) => {
  const { message } = props.message as any;

  return <div className = "debot-chat-menu-buttons">
    <div className = "debot-chat-message message-side-left message-button">
      <div className = "debot-chat-message-inner" onClick = {() => message.onStart()}>
        <div className = "debot-chat-message-inner-text">
          { message.text }
        </div>
      </div>
    </div>
  </div>
}

const ChatWindowMessagePostMessageMenu = (props: ChatMessageProps) => {
  const { message } = props.message as any;

  return <div className = "debot-chat-menu-buttons">
    {message.items.map((item: MessageItem, i: number) => {
      return <div className = "debot-chat-message message-side-left message-button" key = {i}>
        <div className = "debot-chat-message-inner" onClick = {() => message.onInput({ index: i })}>
          <div className = "debot-chat-message-inner-text">
            { item.title }
          </div>
        </div>
      </div>
    })}
  </div>
}

const ChatWindowMessagePostMessageApprove = (props: ChatMessageProps) => {
  const { message } = props.message as any;
  const { onApprove } = message;

  return <div className = "debot-chat-message message-side-left message-button message-approve">
    <div className = "debot-chat-message-inner" onClick = {() => onApprove(true)}>
      <div className = "debot-chat-message-inner-text"> Confirm </div>
    </div>
    <div className = "debot-chat-message-inner" onClick = {() => onApprove(false)}>
      <div className = "debot-chat-message-inner-text"> Cancel </div>
    </div>
  </div>
};

const ChatWindowMessagePostMessageConfirmInput = (props: ChatMessageProps) => {
  const { message } = props.message as any;
  const { onInput } = message;

  return <div className = "debot-chat-message message-side-left message-button message-approve">
    <div className = "debot-chat-message-inner" onClick = {() => onInput({ value: true })}>
      <div className = "debot-chat-message-inner-text"> Yes </div>
    </div>
    <div className = "debot-chat-message-inner" onClick = {() => onInput({ value: false })}>
      <div className = "debot-chat-message-inner-text"> No </div>
    </div>
  </div>
};

const ChatWindowMessagePostMessageAddressInput = ChatWindowMessagePostMessageMenu;

const ChatWindowMessagePostMessageCountryInput = (props: ChatMessageProps) => {
  const { message } = props.message as any;
  const { intercept } = message;

  const iFrameMessagesController = TonClientHooks.useIFrameMessagesController();
  const interceptable = intercept === "popup";

  const selectCountryWindow = usePopupWindow({});
  const onClick = () => {
    if (interceptable) {
      iFrameMessagesController.send(message).then(message.onInput).catch(selectCountryWindow.open);
    } else {
      selectCountryWindow.open()
    }
  }

  const onSelect = (code: string) => {
    setTimeout(() => message.onInput({value: code}), 250);
    selectCountryWindow.close();
  }

  return <div className = "debot-chat-menu-buttons">
    <div className = "debot-chat-message message-side-left message-button">
      <div className = "debot-chat-message-inner" onClick = { onClick }>
        <div className = "debot-chat-message-inner-text">Select</div>
      </div>
    </div>
    <CountryPopupWindow settings = { selectCountryWindow } onSelect = { onSelect } countries = { message.countries }/>
  </div>
}

const ChatWindowMessagePostMessageDateTimeInput = (props: ChatMessageProps) => {
  const { message } = props.message as any;
  const { intercept } = message;

  const iFrameMessagesController = TonClientHooks.useIFrameMessagesController();
  const interceptable = intercept === "popup";

  const selectDateWindow = usePopupWindow({});

  const onClick = () => {
    if (interceptable) {
      iFrameMessagesController.send(message).then(message.onInput).catch(selectDateWindow.open);
    } else {
      selectDateWindow.open();
    }
  }
  const onSelect = (timestamp: number) => {
    /*const returnableDate = new Date(timestamp * 1000);
    const options = {
      hourCycle: "h23",
      timeZone: (needInputTime && !needInputDate)?"UTC":undefined,
      year: needInputDate?"numeric":undefined,
    	month: needInputDate?"short":undefined,
    	day: needInputDate?"numeric":undefined,
      hour: needInputTime?"2-digit":undefined,
      minute: needInputTime?"2-digit":undefined
    } as any;*/

    setTimeout(() => message.onInput({value: timestamp/*, title: returnableDate.toLocaleString("en", options)*/}), 250);
    selectDateWindow.close();
  }

  return <div className = "debot-chat-menu-buttons">
    <div className = "debot-chat-message message-side-left message-button">
      <div className = "debot-chat-message-inner" onClick = { onClick }>
        <div className = "debot-chat-message-inner-text">Select</div>
      </div>
    </div>
    <DateTimePopupWindow settings = { selectDateWindow } { ...message} onSelect = { onSelect }/>
  </div>
}

const ChatWindowMessagePostMessageQrcodeRead = (props: ChatMessageProps) => {
  const { message } = props.message as any;
  const { intercept } = message;

  const iFrameMessagesController = TonClientHooks.useIFrameMessagesController();
  const interceptable = intercept === "popup";

  const qrcodeReadWindow = usePopupWindow({});
  const onClick = () => {
    if (interceptable) {
      iFrameMessagesController.send(message).then(message.onInput).catch(qrcodeReadWindow.open);
    } else {
      qrcodeReadWindow.open();
    }
  };

  const onScanData = (data: any) => {
    if (!data) return;
    setTimeout(() => message.onInput({ value: data, status: 0 }), 250);
    qrcodeReadWindow.close();
  }

  return <div className = "debot-chat-menu-buttons">
    <div className = "debot-chat-message message-side-left message-button">
      <div className = "debot-chat-message-inner" onClick = { onClick }>
        <div className = "debot-chat-message-inner-text">Scan</div>
      </div>
    </div>
    <QrCodePopupWindow settings = { qrcodeReadWindow } onScanData = { onScanData } />
  </div>
}


/*  */

const MESSAGES: any = {
  "print": ChatWindowMessagePrint,
  "input": ChatWindowMessageInput,
  "menu": ChatWindowMessageMenu,
  "approve": ChatWindowMessageApprove,
  "input-address": ChatWindowMessageAddressInput,
  "input-amount": ChatWindowMessageAmountInput,
  "input-number": ChatWindowMessageNumberInput,
  "draw-qrcode": ChatWindowMessageQrcodeDraw,
  "input-confirm": ChatWindowMessageConfirmInput,
  "input-country": ChatWindowMessageCountryInput,
  "input-date-time": ChatWindowMessageDateTimeInput,
  "input-qrcode": ChatWindowMessageQrcodeRead,
  "media": ChatWindowMessageMedia,
  "start": null,
}

const INPUTS: any = {
  "input": ChatWindowInputInput,
  "input-address": ChatWindowInputAddressInput,
  "input-amount": ChatWindowInputAmountInput,
  "input-number": ChatWindowInputNumberInput
}

const POST_MESSAGES: any = {
  "input-country": ChatWindowMessagePostMessageCountryInput,
  "input-date-time": ChatWindowMessagePostMessageDateTimeInput,
  "input-qrcode": ChatWindowMessagePostMessageQrcodeRead,

  "menu": ChatWindowMessagePostMessageMenu,
  "approve": ChatWindowMessagePostMessageApprove,
  "input-address": ChatWindowMessagePostMessageAddressInput,
  "input-confirm": ChatWindowMessagePostMessageConfirmInput,
  "start": ChatWindowMessagePostMessageStart
}

interface ChatWindowProps { address: string; }

const ChatWindow = inject("messagesStore")(observer((props: ChatWindowProps) => {
  const messagesStore: MessagesStore = (props as any).messagesStore;
  const messages = messagesStore.getMessages(props.address);
  const lastMessage = messages[messages.length -1];
  if (!lastMessage) return null;

  const lastMessageType = lastMessage.message.type;
  const PostMessageComponent = lastMessage.message.intercept !== "all" && POST_MESSAGES[lastMessageType];
  const InputComponent = lastMessage.message.intercept !== "all" && INPUTS[lastMessageType];

  return <div className = "debot-chat-window">
    <ChatHeader address = { props.address }/>
    <div className = "debot-chat-messages custom-scrollbar">
      {PostMessageComponent && <PostMessageComponent message = { lastMessage }/>}
      {messages.slice(0).reverse().map((message: MessageInfo, i: number) => {
        const messageType = message.message.type;
        const messageSide = message.side;
        const MessageComponent = MESSAGES[messageType];
        const messageClassName = `debot-chat-message message-side-${messageSide}`

        return MessageComponent && <div className = { messageClassName } key = {i}>
          <MessageComponent message = { message }/>
        </div>
      })}
    </div>
    <div className = "debot-chat-input">
      { InputComponent && <InputComponent message = { lastMessage }/>}
    </div>
  </div>
}));

export { ChatWindow };
