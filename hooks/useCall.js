import React, { useState, useEffect, useCallback } from "react";

export default function useCall(setRemoteStream) {
    const [call, setCall] = useState(null);
    const [callError, setError] = useState(null);

    const calling = useCallback(async (peer, remoteId, localStream) => {
        try {
            if (call && call.peer === remoteId && call.open) {
                setError("Alread connected");
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
        if (call) {
            // receive answer and set as remoteStream
            call.on('stream', (stream) => {
                setRemoteStream(stream);
            });
            call.on('close', () => {
                setRemoteStream(null);
            });
            call.on('error', error => setError(error));
        }
        console.log(call);
        console.log(callError);
        return;
    }, [call])

    return { calling, call, callError, setCall };
}