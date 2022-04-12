import { QrReader } from 'react-qr-reader'
import React from 'react'

const RenderQrReader = ({cameraMode, handleScan}) => {
    let mode = ""
    if (cameraMode) {
        mode = "user"
    } else {
        mode= "environment"
    }
    return (
        <QrReader
            constraints={{facingMode: mode}}
            onResult={(result, error) => {
                if (!!result) {
                    handleScan(result?.text);
                }
            }}

        />
    )
}

export default RenderQrReader;