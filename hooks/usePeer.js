import React, { useState, useEffect, useCallback } from "react";
import { getRandomId } from "../public/js/util";

const audioOnlyConfig = { audio: true, video: false };
const userMediaConfig = {
    audio: { echoCancellation: true, noiseSuppression: true },
    video: { facingMode: "user" }
};

const config = { 'iceServers': [{ 'urls': ['stun:stun.l.google.com:19302'] }] };

const localConfig = {
    host: 'live.democracy.earth',
    secure: true,
    port: 5000,
    path: '/peerjs',
    config,
    debug: 0 // from 0 up to 3
};

export default function usePeer(addRemoteStream, removeRemoteStream) {
    const [myPeer, setPeer] = useState(null);
    const [myPeerID, setMyPeerID] = useState(null);

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
            const peer = myPeer ? myPeer : new Peer(getRandomId(), localConfig);

            peer.on('open', () => {
                setPeer(peer);
                setMyPeerID(peer.id);
            })

            peer.on('call', (call) => {
                console.log('receiving call from ' + call.peer)

                navigator.mediaDevices.getUserMedia(userMediaConfig)
                    .then((stream) => {
                        // Answer the call with an A/V stream.
                        call.answer(stream);

                        // Play the remote stream
                        call.on('stream', (remoteStream) => {
                            addRemoteStream(remoteStream, call.peer);
                        });

                        call.on('close', () => {
                            console.log("The call has ended");
                            removeRemoteStream(call.peer);
                        });

                        call.on('error', (error) => {
                            console.log(error);
                            removeRemoteStream(call.peer);
                        });
                    }).catch(error => { console.log(error); });
            });

            peer.on('disconnected', () => {
                console.log("Peer desconnected");
                cleanUp()
            });

            peer.on('close', () => {
                console.log("Peer closed remotetly");
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