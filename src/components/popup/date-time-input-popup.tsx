import React, { useState } from "react";
import Calendar from "react-calendar";
import TimeField from "react-simple-timefield";

import { PopupWindow, PopupWindowHookOutputs } from "./popup-window";


interface DateTimePopupWindowProps {
  settings: PopupWindowHookOutputs;
  needInputTime: boolean;
  needInputDate: boolean;
  defaultDatetime: Date;
  minDatetime: Date;
  maxDatetime: Date;
  onSelect: (timestamp: number) => void;
}

const DateTimePopupWindow = (props: DateTimePopupWindowProps) => {
  const [ date, setDate ] = useState<Date>(props.defaultDatetime);
  const [ time, setTime ] = useState<string>("00:00");

  const onChangeDate = (value: Date) => setDate(value);
  const onInputTime = (e: any) => { setTime(e.target.value) }

  const timeVal = time.split(":").map(v => parseInt(v));
  const currentDate = (date as any / 1) + timeVal[0] * 60 * 60 * 1000 + timeVal[1] * 60 * 1000;
  const timestamp = currentDate as any / 1000 | 0;

  return <PopupWindow className = "datetime-input-popup-body" settings = { props.settings }>
    <div className = "debot-chat-popup-header datetime-input-header">
      <p className = "close" onClick = {() => props.settings.close()}>Close</p>
      <p className = "header">Choose a date</p>
      <p className = "select" onClick = { () => props.onSelect(timestamp) }>Enter</p>
    </div>
    <div className = "datetime-input-wrapper">
      { props.needInputDate && <div className = "datetime-input-block datetime-calendar">
        <Calendar value = { date } onChange = { onChangeDate } locale = "en-EN"
          minDate = { props.minDatetime } maxDate = { props.maxDatetime }/>
      </div> }
      { props.needInputTime && <div className = "datetime-input-block datetime-timeinput">
        <div className = "datetime-timeinput-row">
          <p>Time</p>
          <TimeField onChange = { onInputTime } value = { time } colon = ":"/>
        </div>
      </div> }
    </div>
  </PopupWindow>
}

export { DateTimePopupWindow }
