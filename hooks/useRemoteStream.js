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

    const removeRemoteStream = useCallback(
        peerId => {
            setRemoteStreams(remoteStreams => {
                let index = remoteStreams.findIndex(remote => remote.peerId === peerId);
                if (index < 0)
                    return [...remoteStreams];
                remoteStreams.splice(index, 1);
                return [...remoteStreams]
            })
        },
        [remoteStreams],
    )
    return [remoteStreams, addRemoteStream, removeRemoteStream];
};