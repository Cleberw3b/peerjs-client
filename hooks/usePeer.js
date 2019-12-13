import React, { useState, useEffect, useCallback } from "react";
import { getRandomId } from "../public/js/util";

const audioOnlyConfig = { audio: true, video: false };

const config = { 'iceServers': [{ 'urls': ['stun:stun.l.google.com:19302'] }] };

const localConfig = {
    host: '127.0.0.1',
    // secure: true,
    port: 5000,
    path: '/peerjs',
    config: {
        'iceServers': [{ 'urls': ['stun:stun.l.google.com:19302'] }]
    },
    debug: 1 // from 0 up to 3
};

export default function usePeer(addRemoteStream) {
    const [myPeer, setPeer] = useState(null);
    const [myPeerID, setMyPeerID] = useState(null);
    const [messages, setMessages] = useState([]);

    const addMessage = (message) => {
        console.log(message);
        setMessages([
            ...messages,
            {
                date: Date.now(),
                message: message
            }
        ]);
    };

    const cleanUp = () => {
        if (myPeer) {
            myPeer.disconnect();
            myPeer.destroy();
        }
        setPeer(null);
        setMyPeerID(null);
    }

    useEffect(() => {
        import('peerjs').then(() => {
            const peer = new Peer(getRandomId(), localConfig);

            peer.on('open', () => {
                setPeer(peer);
                setMyPeerID(peer.id);
            })

            peer.on('call', (call) => {
                addMessage('receiving call from ' + call.peer)

                navigator.mediaDevices.getUserMedia(audioOnlyConfig)
                    .then((stream) => {
                        // Answer the call with an A/V stream.
                        call.answer(stream);

                        // Play the remote stream
                        call.on('stream', (remoteStream) => {
                            addRemoteStream(remoteStream, call.peer);
                        });

                        call.on('close', () => {
                            addMessage("The call has ended");
                            // setPeerRemoteStream(null)
                        });

                        call.on('error', (error) => {
                            addMessage(error);
                            // setPeerRemoteStream(null)
                        });
                    }).catch(error => { console.log(error); });
            });

            peer.on('disconnected', () => {
                addMessage("Peer desconnected");
                cleanUp()
            });

            peer.on('close', () => {
                addMessage("Peer closed remotetly");
                cleanUp()
            });

            peer.on('error', (error) => {
                console.log("peer error", error);
                cleanUp()
            });

        }).catch(error => { console.log(error) });

        return () => {
            cleanUp()
        }
    }, [])

    return [myPeer, myPeerID];
}