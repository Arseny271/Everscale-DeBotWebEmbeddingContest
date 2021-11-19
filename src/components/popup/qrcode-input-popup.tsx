import React, { useState } from "react";
import QrReader from "react-qr-reader"
import { PopupWindow, PopupWindowHookOutputs } from "./popup-window"

interface QrCodePopupWindowProps {
  settings: PopupWindowHookOutputs;
  onScanData: (value: any) => void;
}

const QrCodePopupWindow = (props: QrCodePopupWindowProps) => {
  const [error, setError] = useState<boolean>(false);
  const onScanError = (err: any) => setError(true);

  return <PopupWindow className = "qrcode-input-popup-body" settings = { props.settings }>
    <div className = "debot-chat-popup-header">
      <p className = "close" onClick = {() => props.settings.close()}>Close</p>
      <p className = "header">Scan a QR code</p>
    </div>
    <div className = {error?"qrcode-container error":"qrcode-container"}>
      { props.settings.isActive && <QrReader
        showViewFinder = { false}
        onError = { onScanError }
        onScan = { props.onScanData }
      />}
      { error && <div className = "qrcode-scan-error-block">
        <p>To scan QR codes, allow access to your device's camera</p>
      </div> }
    </div>
  </PopupWindow>
}

export { QrCodePopupWindow }
