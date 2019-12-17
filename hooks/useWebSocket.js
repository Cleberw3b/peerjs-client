import React, { useState, useEffect, useCallback } from 'react';

export default function useWebSocket() {
    const [socket, setSocket] = useState(null);
    const [connectedPeers, setConnectedPeers] = useState([]);
    const [messages, setMessages] = useState([]);
    const socketURL = 'ws://138.68.7.115:5050';

    const getPeers = () => {
        return JSON.stringify({ type: 'peers' })
    }

    const getChatMessages = () => {
        return JSON.stringify({ type: 'allMessages' })
    }

    const cleanUp = () => {
        setConnectedPeers([]);
        setMessages([]);
    }

    const sendMessage = useCallback(
        (peerId, message) => {
            let data = JSON.stringify({
                type: 'message',
                message: {
                    peerId,
                    message,
                    date: Date.now()
                }
            })
            socket.send(data);
        }
    )

    useEffect(() => {
        const ws = socket ? socket : new WebSocket(socketURL);

        setSocket(ws);

        ws.onopen = (event) => {
            console.log('connected');
            ws.send(getPeers());
            ws.send(getChatMessages());
        };

        ws.onclose = (event) => {
            console.log('disconnected');
            cleanUp();
        };

        ws.onmessage = (event) => {
            let data = JSON.parse(event.data);
            switch (data.type) {
                case 'message':
                    setMessages(messages => [
                        ...messages,
                        data.message
                    ])
                    break;
                case 'allMessages':
                    setMessages(data.allMessages)
                    break;
                case 'peers':
                    setConnectedPeers(data.connectedPeers);
                    break;
                case 'updatePeers':
                    ws.send(getPeers());
                    break;
                default:
                    console.log("Message from websock not indentified");
            }
        };

        ws.onerror = (error) => {
            console.log(error);
        };

        return () => {
            ws.close();
            cleanUp();
        };
    }, [])

    return { connectedPeers, messages, sendMessage };
};