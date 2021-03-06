import React, { useState } from 'react';
import './popup-window.css';

export type PopupWindowHookInputs = {
  onClose?: () => void;
}

export type PopupWindowHookOutputs = {
  isActive: boolean;
  onClose: () => void;
  open: () => void;
  close: () => void;
}

const usePopupWindow = (inputs: PopupWindowHookInputs): PopupWindowHookOutputs => {
  const [isActive, isActiveSet] = useState<boolean>(false);

  const onClose = () => {
    if (inputs.onClose) inputs.onClose();
    isActiveSet(false);
  }

  const open = () => {
    isActiveSet(true);
  }

  const close = () => {
    isActiveSet(false);
  }

  return { open, close, isActive, onClose }
}


interface PopupWindowProps {
  isActive?: boolean;
  children?: React.ReactNode;
  onClose?: () => void;
  className?: string;

  settings?: PopupWindowHookOutputs;
}

const PopupWindow: React.FunctionComponent<PopupWindowProps> = (props) => {
  const onClose = props.settings?props.settings.onClose:props.onClose;
  const isActive = props.settings?props.settings.isActive:props.isActive;

  const onCloseCheck = (event: any) => {
    if (event.target.className.length === 0 || !onClose) return;
    if (event.target.className.split(" ")[0] === "modal-window-background")
      onClose();
  }

  return <div onMouseDown = {(e) => onCloseCheck(e)} className = {`modal-window-background window-${isActive?"active":"hidden"}`}>
    <div className = {"modal-window-wrapper " + props.className}>
      <div className = "modal-window custom-scrollbar">
        {props.children}
      </div>
    </div>
  </div>
}

export { PopupWindow, usePopupWindow }
