import React, { useState, useEffect } from 'react';
import useWebSocket from '../hooks/useWebSocket';
import usePeer from '../hooks/usePeer';
import useRemoteStreams from '../hooks/useRemoteStream';
import useUserMedia from '../hooks/useUserMedia';
import Live from '../components/live/live';
import Lobby from '../components/lobby/lobby';

const Home = () => {

  const localstream = useUserMedia();
  const { socket, connectedPeers, messages, sendMessage, connect, disconnect } = useWebSocket();
  const [remoteStreams, addRemoteStream, removeRemoteStream] = useRemoteStreams();
  const [myPeer, myPeerID] = usePeer(addRemoteStream, removeRemoteStream);
  const [isConnected, setConnected] = useState(false);
  const [peersOnline, setPeersOnline] = useState([]);

  useEffect(() => {
    if (connectedPeers && myPeerID !== undefined) {
      setPeersOnline(connectedPeers.filter(peer => peer !== myPeerID));
    }
  }, [connectedPeers, myPeerID])

  useEffect(() => {
    return () => { hangUp() };
  }, [])

  const hangUp = () => {
    setConnected(false);
    disconnect(myPeerID);
    Object.keys(myPeer.connections).map(conn => {
      if (myPeer.connections[conn][0]) myPeer.connections[conn][0].close();
    })
  }

  const call = (remoteid) => {
    let call = myPeer.call(remoteid, localstream);

    call.on('stream', (remoteStream) => {
      addRemoteStream(remoteStream, call.peer);
      console.log('Connected to ' + call.peer);
    });

    call.on('close', () => {
      console.log("call closed");
      removeRemoteStream(call.peer);
      call.close();
    });

    call.on('error', (error) => {
      console.log("call error", error);
      removeRemoteStream(call.peer);
      call.close();
    });
  }

  const joinMetting = () => {
    if (socket.readyState !== 1 || myPeerID === undefined) return;
    setConnected(true);
    connect(myPeerID);
    for (const peer of peersOnline) {
      call(peer);
    }
  }

  return (
    <>{isConnected
      ?
      <Live disconnect={hangUp} messages={messages} myPeerId={myPeerID} myStream={localstream} remoteStreams={remoteStreams} sendMessage={sendMessage} />
      :
      <Lobby myStream={localstream} peersOnlineCount={peersOnline.length} myPeerId={myPeerID} join={joinMetting} />
    }
    </>
  )
}

Home.getInitialProps = async () => {
  return { data: "" };
};

export default Home