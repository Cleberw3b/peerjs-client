import React, { useState, useEffect, useRef, useCallback } from 'react';
import ConnectedPeers from '../components/connectedPeers/connectedPeers';
import Chat from '../components/chat/chat';
import useConnectedPeers from '../hooks/useConnectedPeers';
import usePeer from '../hooks/usePeer';
import useStream from '../hooks/useStream';
import "../components/videoLayout/videoLayout.scss"
import useRemoteStreams from '../hooks/useRemoteStream';
import useUserMedia from '../hooks/useUserMedia';
import useAlertBox from '../hooks/useAlertBox';

const Home = () => {

  const localstream = useUserMedia();
  const [setLocalStream, localVideoRef, handleCanPlayLocal] = useStream();
  const connectedPeers = useConnectedPeers();
  const [remoteStreams, addRemoteStream, removeRemoteStream] = useRemoteStreams()
  const refsArray = useRef([]);
  const [myPeer, myPeerID] = usePeer(addRemoteStream);
  const [showConference, setShowConference] = useState(false);

  useEffect(() => {
    console.log(remoteStreams);
    remoteStreams.map(streamData =>
      refsArray.current[streamData.peerId].srcObject = streamData.stream)
  }, [remoteStreams])

  useEffect(() => {
    setLocalStream(localstream);
  }, [localstream])

  useEffect(() => {
    if (localstream && connectedPeers && connectedPeers.length > 0 && myPeerID !== undefined) {
      setShowConference(true);
    }
  }, [localstream, connectedPeers, myPeerID])

  const call = (remoteid) => {
    let call = myPeer.call(remoteid, localstream);

    call.on('stream', (remoteStream) => {
      addRemoteStream(remoteStream, call.peer);
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
  }

  const makeCall = () => {
    if (connectedPeers && connectedPeers.length > 0 === '') {
      console.log('No Peers to connect with');
      return;
    }

    let peerToConnect = connectedPeers.map((peer) => peer);
    let myPeerIndex = peerToConnect.findIndex(peer => peer === myPeerID);
    if (myPeerIndex >= 0) peerToConnect.splice(myPeerIndex, 1);
    for (const peer of peerToConnect) {
      call(peer);
      console.log("calling peer " + peer)
    }
  }

  return (
    <>
      <div id="alertBox"></div>
      <div className="container">
        <div className="principal-content">
          <h1>Democracy Earth ID Validation Conference</h1>
          <div className="conference-layout" >
            <div className="main-stream">
              <video ref={localVideoRef} onCanPlay={handleCanPlayLocal} autoPlay playsInline muted />
            </div>
            <div className="listeners-box">
              {remoteStreams.map((dataStream, i) => (
                <div key={dataStream.peerId} className="listener-stream">
                  <video
                    ref={ref => refsArray.current[dataStream.peerId] = ref}
                    autoPlay playsInline muted />
                  {dataStream.peerId}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="side-content">
          {showConference &&
            (<>
              <ConnectedPeers connectedPeers={connectedPeers} myPeerID={myPeerID} call={makeCall} />
              <Chat />
            </>)
          }
        </div>
      </div>
    </>
  )
}

Home.getInitialProps = async () => {
  return { data: "" };
};

export default Home