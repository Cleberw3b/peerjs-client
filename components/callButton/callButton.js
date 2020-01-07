import React, { useEffect } from 'react';
import "./callButton.scss"

export default function callButton({ disconnect }) {

    return (
        <div className="callme" onClick={disconnect}>
            <div className="callmeMain"></div>
        </div>
    )
}