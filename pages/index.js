import React, { useState, useEffect } from 'react';
import VideoLayout from '../components/videoLayout';
import usePeer from '../hooks/usePeer'
import useUserMedia from '../hooks/useUserMedia';
import useCall from '../hooks/useCall';

const alignCenter = { textAlign: "center" };

const Home = () => {
  const localStream = useUserMedia();
  const [remoteId, setRemoteId] = useState('');
  const [message, setMessage] = useState('');
  const { peer, peerID, peerConnections, peerError } = usePeer(localStream);
  const { calling, call, callError, remoteStream } = useCall();

  function setDelayMsg(msg) {
    setMessage(msg);
    setTimeout(() => {
      setMessage(null);
    }, 2000)
  }

  useEffect(() => {
    const id = setTimeout(() => {
      setMessage("");
    }, 2000);
    return clearTimeout(id);
  }, [message])

  async function makeCall() {
    if (peer && remoteId !== '') {
      setMessage("Connecting...");
      await calling(peer, remoteId, localStream);
    } else {
      if (!peer)
        setDelayMsg("peer not created yet");
      else if (remoteId === '')
        setDelayMsg("insert id to connect");
    }
  }

  return (
    <div>
      <h1 style={alignCenter}>
        Recording from camera and voice
      </h1>
      <p style={alignCenter}>
        Your peerID is {peerID}
      </p>
      <p style={alignCenter}>
        {message}
      </p>
      <p style={alignCenter}>
        peerError -> {peerError && peerError.message}
      </p>
      <p style={alignCenter}>
        callError -> {callError && callError.message}
      </p>
      <span> Insert RemoteID </span>
      <input onChange={event => setRemoteId(event.target.value)} />
      <button onClick={() => makeCall()}> Call </button>
      <VideoLayout localStream={localStream} remoteStream={remoteStream} />
    </div>
  )

}
export default Home
