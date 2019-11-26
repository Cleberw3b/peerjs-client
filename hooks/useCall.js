import React, { useState, useEffect, useCallback } from "react";

export default function useCall() {
    const [call, setCall] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [error, setError] = useState(null);

    const calling = useCallback(async (peer, remoteId, localStream) => {
        try {
            const newCall = await peer.call(remoteId, localStream);
            setCall(newCall);
        } catch (error) {
            setError(error)
            console.log(error);
        } calling
    }, []);

    useEffect(() => {
        const listen = async () => {
            try {
                if (!call) return;
                let thisCall = call;
                thisCall.on('stream', (stream) => {
                    setRemoteStream(stream);
                });
                thisCall.on('error', error => console.log(error));
            } catch (error) {
                setError(error)
                console.log(error);
            }
        }
        console.log(call, error, remoteStream);
        listen();
        // return function cleanup() {
        // 
        // }
    }, [call, error, remoteStream])

    return [calling, call, error, remoteStream];
}