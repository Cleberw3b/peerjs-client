import React from 'react'
import LocalStream from '../localStream/localStream';
import "./lobby.scss"

export default function Lobby({ myStream, peersOnlineCount, myPeerId, join }) {

    return (
        <div className="lobby">
            <div className="header">
                <div className="logo">
                    <img src="/static/images/democracy-earth.png" />
                </div>
                <div className="user">
                    {myPeerId && `User ID ${myPeerId}`}
                </div>
            </div>
            <div className="live-status">
                <LocalStream userMedia={myStream} classStyle={"my-video"} />
                <div className="ready">
                    Ready to join?
                </div>
                <div className="participants">
                    {peersOnlineCount === 0 && 'Be the first to join'}
                    {peersOnlineCount === 1 && `${peersOnlineCount} participant online`}
                    {peersOnlineCount > 1 && `${peersOnlineCount} participants online`}
                </div>
                <div className="enter-room-button" onClick={() => join()}>
                    Join Meeting
                </div>
            </div>
        </div>
    )
}
