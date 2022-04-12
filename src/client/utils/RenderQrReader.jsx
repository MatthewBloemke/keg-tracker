import { QrReader } from 'react-qr-reader'
import React from 'react'

const RenderQrReader = ({cameraMode, handleScan}) => {
    if (cameraMode) {
        return (
            <QrReader
                constraints={{facingMode: "user"}}
                onResult={(result, error) => {
                    if (!!result) {
                        handleScan(result?.text);
                    }
                }}
    
            />
        )
    } else {
        return (
            <QrReader
                constraints={{facingMode: 'environment'}}
                onResult={(result, error) => {
                    if (!!result) {
                        handleScan(result?.text);
                    }
                }}
    
            />
        )
    }
}

export default RenderQrReader;