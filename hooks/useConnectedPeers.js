import React, { useState, useEffect } from 'react';

export default function useConnectedPeers() {
    const [connectedPeers, setConnectedPeers] = useState([]);
    const socketURL = 'ws://localhost:5050';

    useEffect(() => {
        const ws = new WebSocket(socketURL);

        ws.onopen = () => {
            console.log('connected');
        };

        ws.onclose = () => {
            console.log('disconnected');
        };

        ws.onmessage = (data) => {
            let peersOnline = JSON.parse(data.data);
            setConnectedPeers(peersOnline.connectedPeers);
        };

        ws.onerror = (error) => {
            console.log(error);
        };

        return () => {
            ws.close();
            setConnectedPeers([]);
        };
    }, [])

    return connectedPeers;
};