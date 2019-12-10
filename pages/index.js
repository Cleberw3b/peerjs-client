import React, { useState, useEffect } from 'react';
import ConnectedPeers from '../components/connectedPeers/connectedPeers';
import Chat from '../components/chat/chat';
import CallButton from '../components/callButton/callButton';
import VideoLayout from '../components/videoLayout/videoLayout';
import useConnectedPeers from '../hooks/useConnectedPeers';
import usePeer from '../hooks/usePeer';

const userMediaConfig = { audio: { echoCancellation: true, noiseSuppression: true }, video: { facingMode: "user" } };

const Home = () => {

  const connectedPeers = useConnectedPeers();
  const { myPeer, myPeerID, remoteStream } = usePeer();
  const [showSideContent, setShowSideContent] = useState(false)
  let remoteId;

  useEffect(() => {
  }, [])

  useEffect(() => {
    if (connectedPeers && connectedPeers.length > 0 && myPeerID !== undefined) {
      setShowSideContent(true);
      remoteId = connectedPeers.find(peer => peer !== myPeerID)
    }

  }, [connectedPeers, myPeerID])

  const callAvailable = () => {
    makeCall()
  }

  function makeCall() {
    if (remoteId === '') {
      console.log('insert id to connect');
      return;
    }

    navigator.mediaDevices.getUserMedia(userMediaConfig)
      .then(function (localstream) {

        let call = myPeer.call(remoteId, localstream);

        call.on('stream', function (remoteStream) {
          console.log(remoteStream);
          // if (remoteStream && remoteVideoRef.current && !remoteVideoRef.current.srcObject) {
          //   remoteVideoRef.current.srcObject = remoteStream;
          // }
          console.log('Connected to ' + call.peer);
        });

        call.on('close', () => {
          console.log("call closed");
          call.close();
        });

        call.on('error', (error) => {
          console.log("call error", error);
          call.close();
        });
      }).catch(function (error) {
        console.log('Failed to get local stream', error);
      });
  }


  return (
    <>
      <div id="alertBox"></div>
      <div className="container">
        <div className="principal-content">
          <h1>Democracy Earth ID Validation Conference</h1>
          <VideoLayout />
          <CallButton />
        </div>
        <div className="side-content">
          {showSideContent && <ConnectedPeers connectedPeers={connectedPeers} myPeerID={myPeerID} callAvailable={callAvailable} />}
          <Chat />
        </div>
      </div>
    </>
  )
}

export default Home