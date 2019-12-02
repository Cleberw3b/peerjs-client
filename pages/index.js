import React, { useState, useEffect } from 'react';
import useStream from '../hooks/useStream';
import useUserMedia from '../hooks/useUserMedia';

const styleCamara = {
  background: "black",
  width: "100%",
  overflow: "hidden",
  display: "flex",
  flexDirection: "collum"
}

const videoDiv = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  pointerEvents: "none",
}

const Home = () => {
  const localStream = useUserMedia();
  const [localVideoRef, handleLocalPlay] = useStream(localStream);
  const [peer, setPeer] = useState(null);
  const [peerId, setpeerId] = useState(null);
  const [remoteId, setRemoteId] = useState(null);

  const isClient = typeof window === "object";

  function handleWhenLoad() {
    setPeer(window.getPeer());
    setpeerId(window.getPeerId());
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isClient) {
        handleWhenLoad();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  function getID() {
    if (isClient) {
      setpeerId(window.getPeerId());
    }
  }

  function makeCall() {
    if (isClient) {
      window.makeCall(remoteId); 'insert id to connect';
    }
  }

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>
        Recording from camera and voice
      </h1>
      <p style={{ textAlign: "center" }}>
        {peerId}
      </p>
      <p id="span" style={{ textAlign: "center" }}>
        {/* append Messages here */}
      </p>
      <span> Insert RemoteID </span>
      <input onChange={event => setRemoteId(event.target.value)} />
      <button onClick={() => makeCall()}> Call </button>
      <button onClick={() => getID()}> Get my ID </button>
      <div style={styleCamara} >
        <div style={videoDiv} >
          <video id={"remoteVideo"} playsInline />
        </div>
        <div style={videoDiv} >
          <video ref={localVideoRef} onCanPlay={handleLocalPlay} playsInline muted />
        </div>
      </div>
    </div>
  )
}
export default Home