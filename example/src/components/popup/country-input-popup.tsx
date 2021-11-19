import React, { useState } from "react";
import { PopupWindow, PopupWindowHookOutputs } from "./popup-window"

interface CountryPopupWindowProps {
  settings: PopupWindowHookOutputs;
  countries: any;
  onSelect: (value: string) => void;
}

const CountryPopupWindow = (props: CountryPopupWindowProps) => {
  const [ search, setSearch ] = useState<string>("");
  const onInput = (e: any) => { setSearch(e.target.value) }

  const countries = props.countries.filter((country: any) => {
    return country[0].toLowerCase().indexOf(search.toLowerCase()) !== -1
  });


  return <PopupWindow className = "country-input-popup-body" settings = { props.settings }>
    <div className = "debot-chat-popup-header country-input-header">
      <p className = "close" onClick = {() => props.settings.close()}>Close</p>
      <p className = "header">Choose a Country</p>
    </div>
    <div className = "debot-chat-popup-header country-input-header search">
      <input type = "text" value = { search } onInput = { onInput } placeholder = "Search..."/>
    </div>
    <div className = "country-input-list custom-scrollbar">{
      countries.map((country: any, i: number) => {
        const backgroundImage = `url(/flags/32x32/${country[1].toLowerCase()}.png)`;
        return <div className = "country-input-item" key = {i} onClick = { () => props.onSelect(country[1]) }>
          <div className = "country-input-item-body">
            <div className = "country-input-item-icon" style = {{backgroundImage}}/>
            <p className = "country-input-item-text">{country[0]}</p>
          </div>
        </div>
      })
    }</div>
  </PopupWindow>
}

export { CountryPopupWindow }
