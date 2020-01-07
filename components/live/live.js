
import React, { useState, useEffect } from 'react'
import Chat from '../chat/chat'
import CallButton from '../callButton/callButton';
import ChatIcon from '../icons/chat';
import LocalStream from '../localStream/LocalStream';
import RemoteStream from '../remoteStream/remoteStream';
import './live.scss'

export default function Live({ myPeerId, myStream, messages, sendMessage, remoteStreams, disconnect }) {

    const [showChat, setShowChat] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);
    const [lastMessageCount, setLastMessageCount] = useState(0);

    useEffect(() => {
        if (!showChat) {
            setUnreadCount(messages.length - lastMessageCount);
        }
    }, [messages])

    const openChat = () => {
        setShowChat(!showChat);
        setLastMessageCount(messages.length);
        setUnreadCount(0);
    }

    return (
        <div className="live">
            <div className="header-live">
                <div className="logo-live">
                    <img src="/static/images/democracy-earth.png" />
                </div>
                <div className="stream-logo">
                    <img src="/static/images/live-stream.png" />
                </div>
            </div>
            <RemoteStream remoteStreams={remoteStreams} />
            <LocalStream userMedia={myStream} classStyle={"my-video-live"} />
            {showChat && <Chat myPeerId={myPeerId} messages={messages} sendMessage={sendMessage} close={() => setShowChat(false)} />}
            <div className="footer">
                <div className="button-show-chat" onClick={() => openChat()}>
                    <ChatIcon />
                    <span className="chat-messeger-count">{unreadCount > 0 ? unreadCount : ""}</span>
                </div>
                <CallButton disconnect={disconnect} />
            </div>
        </div>
    )
}