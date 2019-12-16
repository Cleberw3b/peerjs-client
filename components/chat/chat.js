import React, { useState, useEffect } from 'react';
import useWebSocket from '../../hooks/useWebSocket';
import "./chat.scss"

export default function Chat({ myPeerID }) {

    const { messages, sendMessage } = useWebSocket();
    const [message, setMessage] = useState('');

    return (
        <div className="chat">
            <h1>Chat</h1>
            <div className="chat-message-box">
                {messages && messages.map((msg, i) => {
                    return (
                        <span key={i} className="chat-message">
                            {msg.peerId} : {msg.message}
                        </span>
                    )
                })}
            </div>
            <div className="chat-send-box">
                <input type="text" onChange={event => setMessage(event.target.value)} />
                <button onClick={() => sendMessage(myPeerID, message)}>></button>
            </div>
        </div>
    )
}