import React, { useState, useCallback } from 'react';

export default function useRemoteStreams() {

    const [remoteStreams, setRemoteStreams] = useState([]);

    const addRemoteStream = useCallback(
        (stream, peerId) => {
            setRemoteStreams(remoteStreams => {
                if (!stream || !peerId) return [...remoteStreams];
                if (remoteStreams.length > 3) return [...remoteStreams];
                if (remoteStreams.some(remote => remote.peerId === peerId)) return [...remoteStreams];
                return [...remoteStreams, { peerId: peerId, stream: stream }]
            })
        },
        [remoteStreams],
    )

    // OLD METHOD
    // const changeRemoteStream = useCallback(
    //     (stream) => {
    //         setRemoteStream(stream);
    //     },
    //     [remoteStream],
    // )

    return [addRemoteStream, remoteStreams];
};