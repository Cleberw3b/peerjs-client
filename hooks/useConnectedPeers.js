import React, { useState, useEffect } from 'react';

export default function useConnectedPeers() {
    const [connectedPeers, setConnectedPeers] = useState(null);
    const [socket, setSocket] = useState(null);
    const socketURL = 'ws://localhost:5050';

    useEffect(() => {
        const ws = new WebSocket(socketURL);

        ws.onopen = function open() {
            console.log('connected');
        };

        ws.onclose = function close() {
            console.log('disconnected');
        };

        ws.onmessage = function incoming(data) {
            let peersOnline = JSON.parse(data.data);
            setConnectedPeers(peersOnline.connectedPeers);
        };
        setSocket(ws);

        return () => {
            ws.close();
        };
    }, [])

    return connectedPeers;
};