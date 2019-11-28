import React, { useState, useEffect, useCallback } from "react";

export default function useCall(setRemoteStream) {
    const [call, setCall] = useState(null);
    const [callError, setError] = useState(null);

    const calling = useCallback(async (peer, remoteId, localStream) => {
        try {
            if (call && call.peer === remoteId && call.open) {
                setError("alread connected")
            } else {
                const newCall = await peer.call(remoteId, localStream);
                setCall(newCall);
            }
        } catch (error) {
            setError(error)
            console.log(error);
        }
    }, [call]);

    useEffect(() => {
        const listen = async () => {
            try {
                if (!call) return;
                let thisCall = call;
                // receive answer and set as remoteStream
                thisCall.on('stream', (stream) => {
                    setRemoteStream(stream);
                });
                thisCall.on('close', () => {
                    setRemoteStream(null);
                });
                thisCall.on('error', error => setError(error));
            } catch (error) {
                setError(error)
            }
        }
        console.log(call);
        console.log(callError);
        listen();
        // return function cleanup() {
        // 
        // }
    }, [call])

    return { calling, call, callError };
}