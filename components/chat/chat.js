import React, { useState, useEffect, useRef } from 'react';
import "./chat.scss"

export default function Chat({ myPeerId, messages, sendMessage, close }) {

    const inputRef = useRef(null);
    const messageBoxEndRef = useRef(null);
    const [message, setMessage] = useState('');
    const send = () => {
        inputRef.current.focus();
        console.log(myPeerId);
        if (message === '') return;
        sendMessage(myPeerId, message);
        setMessage('');
    }

    useEffect(() => {
        inputRef.current.focus();
    }, [])

    useEffect(() => {
        messageBoxEndRef.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    }, [messages])

    return (
        <div className="chat" onClick={() => inputRef.current.focus()}>
            <div className="chat-top">
                <h1>Chat</h1>
                <div className="chat-close-button" onClick={close}>x</div>
            </div>
            <div className="chat-message-box">
                {messages && messages.map((msg, i) => {
                    return (
                        <div key={i} className={`chat-message ${msg.peerId === myPeerId ? "my-message" : "remote-message"}`}>
                            <span>{msg.peerId}</span>
                            <br />
                            <span>{msg.message}</span>
                        </div>
                    )
                })}
                <div ref={messageBoxEndRef}></div>
            </div>
            <div className="chat-send-box">
                <input ref={inputRef}
                    type="text"
                    value={message}
                    onChange={event => setMessage(event.target.value)}
                    onKeyDown={event => {
                        if (event.key === "Enter") send();
                    }}
                />
                <button onClick={() => send()}>></button>
            </div>
        </div>
    )
}