import React, { useState, useEffect } from 'react';
import "./connectedPeers.scss"

export default function ConnectedPeers({ connectedPeers, myPeerID, call }) {

    return (
        <div className="connected-peers">
            <h1>Peers Available</h1>
            <div className="connected-peers-box">
                {connectedPeers && connectedPeers.map(peerID => (
                    <span key={peerID} className="peer-id">
                        {peerID === myPeerID && (`${peerID} Local`)}
                        {peerID !== myPeerID && (`${peerID} Remote`)}
                    </span>
                ))}
            </div>
            <div className="connected-peers-call-button">
                <button onClick={() => call()}>Call Peers</button>
            </div>
        </div>
    )
}