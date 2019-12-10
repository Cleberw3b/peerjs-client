import React, { useState } from 'react';
import "./chat.scss"

export default function Chat() {

    const messages = [
        { peerid: 123456, message: "hi there", date: 53452637 },
        { peerid: 235234, message: "hi there", date: 52312355 },
        { peerid: 235234, message: "hi there", date: 52312355 },
        { peerid: 235234, message: "hi there", date: 52312355 },
        { peerid: 235234, message: "hi there", date: 52312355 },
        { peerid: 235234, message: "hi there", date: 52312355 },
        { peerid: 235234, message: "hi there", date: 52312355 },
        { peerid: 235234, message: "hi there", date: 52312355 },
        { peerid: 235234, message: "hi there", date: 52312355 },
        { peerid: 235234, message: "hi there", date: 52312355 },
        { peerid: 235234, message: "hi there", date: 52312355 },
        { peerid: 235234, message: "hi there", date: 52312355 },
        { peerid: 235234, message: "hi there", date: 52312355 },
        { peerid: 235234, message: "hi there", date: 52312355 },
        { peerid: 235234, message: "hi there", date: 52312355 },
        { peerid: 235234, message: "hi there", date: 52312355 },
        { peerid: 235234, message: "hi there", date: 52312355 },
        { peerid: 235234, message: "hi there", date: 52312355 },
        { peerid: 235234, message: "hi there", date: 52312355 },
        { peerid: 235234, message: "hi there", date: 52312355 },
        { peerid: 235234, message: "hi there", date: 52312355 },
        { peerid: 235234, message: "hi there", date: 52312355 },
        { peerid: 235234, message: "hi there", date: 52312355 },
        { peerid: 235234, message: "hi there", date: 52312355 },
        { peerid: 235234, message: "hi there", date: 52312355 },
        { peerid: 235234, message: "hi there", date: 52312355 },
        { peerid: 235234, message: "hi there", date: 52312355 },
        { peerid: 235234, message: "hi there", date: 52312355 },
        { peerid: 235234, message: "hi there", date: 52312355 },
        { peerid: 235234, message: "hi there", date: 52312355 },
        { peerid: 235234, message: "hi there", date: 52312355 },
        { peerid: 235234, message: "hi there", date: 52312355 },
        { peerid: 235234, message: "hi there", date: 52312355 },
        { peerid: 235234, message: "hi there", date: 52312355 },
        { peerid: 235234, message: "hi there", date: 52312355 },
        { peerid: 235234, message: "hi there", date: 52312355 },
        { peerid: 325231, message: "hi there", date: 54238631 }
    ];
    let count = 0;

    return (
        <div className="chat">
            <h1>Chat</h1>
            <div className="chat-message-box">
                {messages && messages.map(msg => {
                    count++;
                    return (
                        <span key={count} className="chat-message">
                            {msg.peerid} : {msg.message}
                        </span>
                    )
                })}
            </div>
            <div className="chat-send-box">
                <input type="text" />
                <button onClick={() => send()}>></button>
            </div>
        </div>
    )
}