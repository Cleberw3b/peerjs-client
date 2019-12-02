import React, { useState, useEffect, useCallback } from "react";

var config = { 'iceServers': [{ 'urls': ['stun:stun.l.google.com:19302'] }] };

export default function usePeer(localStream, setRemoteStream) {
    const [peer, setPeer] = useState(null);
    const [peerError, setError] = useState(null);

    const createPeer = useCallback(async () => {
        try {
            import('peerjs').then(() => {
                let myPeer = peer ? peer : new Peer(config);
                setPeer(myPeer);
            })
        } catch (error) {
            setError(error)
        }
    }, [peer]);

    useEffect(() => {
        const listen = () => {
            try {
                if (!peer) return;

                peer.on('open', () => { });

                peer.on('connection', dataConnection => { });

                peer.on('call', (call) => {
                    // Answer the call, providing our mediaStream
                    call.answer(localStream);
                    // receive answer and set as remoteStream
                    call.on('stream', (stream) => {
                        setRemoteStream(stream);
                    });
                    call.on('close', () => {
                        setRemoteStream(null);
                    });
                });

                peer.on('close', () => { });
                peer.on('error', error => setError(error));

            } catch (error) {
                console.log(error);
                setError(error);
            }
        }
        createPeer();
        listen();
        console.log(peerError);
        console.log(peer);

    }, [peer, peerError])

    useEffect(() => {
        return () => {
            peer.destroy();
        }
    }, [])

    return { peer, peerError, createPeer };
}