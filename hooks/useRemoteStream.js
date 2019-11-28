import React, { useCallback, useState } from 'react';

export default function useRemoteStream() {

    const [remoteStream, setRemoteStream] = useState(null)

    const changeRemoteStream = useCallback(
        (stream) => {
            setRemoteStream(stream);
        },
        [remoteStream],
    )

    return [remoteStream, changeRemoteStream];
};