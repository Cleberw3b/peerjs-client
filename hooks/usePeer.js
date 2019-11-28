import React, { useState, useEffect } from "react";

export default function usePeer(localStream) {
    const [peer, setPeer] = useState(null);
    const [peerID, setPeerID] = useState(null);
    const [peerError, setError] = useState(null);
    const [peerConnections, setPeerConnections] = useState([]);

    useEffect(() => {
        const createPeer = async () => {
            try {
                import('peerjs').then(() => {
                    let newPeer = peer ? peer : new Peer();
                    setPeer(newPeer);

                    newPeer.on('open', () => {
                        setPeerID(newPeer.id);
                    });

                    newPeer.on('connection', conn => {
                        peerConnections.push(conn);
                    });

                    newPeer.on('call', (call) => {
                        // Answer the call, providing our mediaStream
                        call.answer(localStream);
                    });

                    newPeer.on('close', () => {

                    });

                    newPeer.on('error', error => setError(error));
                })
            } catch (error) {
                console.log(error);
            }
        }

        createPeer();
        // console.log(error);
        // console.log(peer);

        // return function cleanup() {
        //     if (peer) peer.destroy();
        // }
    }, [peer, peerID, peerConnections, peerError])

    return { peer, peerID, peerConnections, peerError };
}