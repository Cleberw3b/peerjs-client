import React, { useState, useEffect } from 'react';
import ConnectedPeers from '../components/connectedPeers/connectedPeers';
import Chat from '../components/chat/chat';
import CallButton from '../components/callButton/callButton';
import useConnectedPeers from '../hooks/useConnectedPeers';
import usePeer from '../hooks/usePeer';
import useStream from '../hooks/useStream';
import "../components/videoLayout/videoLayout.scss"
import useAlertBox from '../hooks/useAlertBox';

const userMediaConfig = { audio: { echoCancellation: true, noiseSuppression: true }, video: { facingMode: "user" } };

const Home = () => {

  const connectedPeers = useConnectedPeers();
  const { myPeer, myPeerID, peerRemoteStream } = usePeer();
  const [showSideContent, setShowSideContent] = useState(false);
  const [setRemoteStream, remoteVideoRef, handleCanPlayRemote] = useStream();
  const [setLocalStream, localVideoRef, handleCanPlayLocal] = useStream();
  const [isCalling, setIsCalling] = useState(false);
  const { showAlert } = useAlertBox();
  let remoteId;

  useEffect(() => {
    if (peerRemoteStream)
      setRemoteStream(peerRemoteStream)
  }, [peerRemoteStream])

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
      showAlert('insert id to connect');
      return;
    }

    navigator.mediaDevices.getUserMedia(userMediaConfig)
      .then(function (localstream) {
        let call = myPeer.call(remoteId, localstream);
        setIsCalling(true);
        setLocalStream(localstream);
        call.on('stream', (remoteStream) => {
          setRemoteStream(remoteStream);
          showAlert('Connected to ' + call.peer);
        });

        call.on('close', () => {
          showAlert("call closed");
          call.close();
        });

        call.on('error', (error) => {
          console.log("call error", error);
          call.close();
        });
      }).catch((error) => {
        console.log('Failed to get local stream', error);
      });
  }

  return (
    <>
      <div id="alertBox"></div>
      <div className="container">
        <div className="principal-content">
          <h1>Democracy Earth ID Validation Conference</h1>
          <div className="conference-layout" >
            <div className="main-stream">
              {isCalling ? (<video ref={localVideoRef} onCanPlay={handleCanPlayLocal} autoPlay playsInline muted />) :
                (<video ref={remoteVideoRef} onCanPlay={handleCanPlayRemote} autoPlay playsInline muted />)
              }
            </div>
            <div className="listeners-box">
              <div className="listener-stream l1" >
                {isCalling ? (<video ref={remoteVideoRef} onCanPlay={handleCanPlayRemote} autoPlay playsInline muted />) :
                  (<video ref={localVideoRef} onCanPlay={handleCanPlayLocal} autoPlay playsInline muted />)
                }
              </div>
            </div>
          </div>
          {/* <CallButton /> */}
        </div>
        <div className="side-content">
          {showSideContent &&
            (<>
              <ConnectedPeers connectedPeers={connectedPeers} myPeerID={myPeerID} callAvailable={callAvailable} />
              <Chat />
            </>)
          }
        </div>
      </div>
    </>
  )
}

export default Home