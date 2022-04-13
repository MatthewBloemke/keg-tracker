import { QrReader } from 'react-qr-reader'
import React from 'react'

const RenderQrReader = ({cameraMode, handleScan}) => {
    //console.log(cameraMode)
        return (
            <QrReader
                scanDelay={0}
                constraints={{facingMode: cameraMode}}
                onResult={(result, error) => {
                    if (!!result) {
                        handleScan(result?.text);
                    }
                }}
    
            />
        )
}

export default RenderQrReader;