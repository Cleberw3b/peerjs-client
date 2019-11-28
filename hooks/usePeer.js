import React, { useState, useEffect } from "react";

var config = { 'iceServers': [{ 'urls': ['stun:stun.l.google.com:19302'] }] };

export default function usePeer(localStream, setRemoteStream) {
    const [peer, setPeer] = useState(null);
    const [peerID, setPeerID] = useState(null);
    const [peerError, setError] = useState(null);

    useEffect(() => {
        const createPeer = async () => {
            try {
                import('peerjs').then(() => {
                    let newPeer = peer ? peer : new Peer(config);
                    setPeer(newPeer);

                    newPeer.on('open', () => {
                        setPeerID(newPeer.id);
                    });

                    newPeer.on('connection', conn => {

                    });

                    newPeer.on('call', (call) => {
                        // receive answer and set as remoteStream
                        call.on('stream', (stream) => {
                            setRemoteStream(stream);
                        });
                        call.on('close', () => {
                            setRemoteStream(null);
                        });
                        // Answer the call, providing our mediaStream
                        call.answer(localStream);
                    });

                    newPeer.on('close', () => {

                    });

                    newPeer.on('error', error => setError(error));
                })
            } catch (error) {
                console.log(error);
                setError(error);
            }
        }

        createPeer();
        console.log(peerError);

        // return function cleanup() {
        //     if (peer) peer.destroy();
        // }
    }, [peer, peerID, peerError])

    return { peer, peerID, peerError };
}