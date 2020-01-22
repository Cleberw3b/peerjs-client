import React, { useState, useEffect } from 'react';
import useWebSocket from '../hooks/useWebSocket';
import usePeer from '../hooks/usePeer';
import useRemoteStreams from '../hooks/useRemoteStream';
import useUserMedia from '../hooks/useUserMedia';
import Live from '../components/live/live';
import Lobby from '../components/lobby/lobby';
import FormData from "form-data";
import axios from "axios";

const Home = () => {

  const localstream = useUserMedia();
  const { socket, connectedPeers, messages, sendMessage, connect, disconnect } = useWebSocket();
  const [remoteStreams, addRemoteStream, removeRemoteStream] = useRemoteStreams();
  const [myPeer, myPeerID] = usePeer(addRemoteStream, removeRemoteStream);
  const [isConnected, setConnected] = useState(false);
  const [peersOnline, setPeersOnline] = useState([]);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [mediaStreamBlob, setMediaStreamBlob] = useState(null);

  useEffect(() => {
    if (connectedPeers && myPeerID !== undefined) {
      setPeersOnline(connectedPeers.filter(peer => peer !== myPeerID));
    }
  }, [connectedPeers, myPeerID])

  useEffect(() => {
    if (mediaRecorder) {
      let recordedChunks = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.push(event.data);
          console.log(recordedChunks);
          setMediaStreamBlob(new Blob(recordedChunks, { type: "video/webm" }));
        }
      }
      mediaRecorder.start(3000);
    }
  }, [mediaRecorder])

  useEffect(() => {
    return () => { hangUp() };
  }, [])

  const hangUp = async () => {
    mediaRecorder.stop();
    setConnected(false);
    disconnect(myPeerID);
    Object.keys(myPeer.connections).map(conn => {
      if (myPeer.connections[conn][0]) myPeer.connections[conn][0].close();
    });
    setTimeout(() => {
      uploadStream();
    }, 200);
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

  const joinMetting = async (applicant = false) => {
    if (socket.readyState !== 1 || myPeerID === undefined || localstream === undefined) return;
    setConnected(true);
    connect(myPeerID);
    for (const peer of peersOnline) {
      call(peer);
    }
    if (applicant && localstream) {
      setMediaRecorder(new MediaRecorder(localstream, { mimeType: "video/webm; codecs=vp8,opus" }))
    }
  }

  const uploadStream = async () => {
    const formData = new FormData();
    formData.append('applicantSream' + myPeerID + ".webm", mediaStreamBlob);

    const response = await axios({
      method: 'post',
      url: 'https://live.democracy.earth:5000/ipfsApi/add',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    console.log(response);
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