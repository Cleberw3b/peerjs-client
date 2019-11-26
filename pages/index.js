import React, { useState, useEffect } from 'react';
import VideoLayout from '../components/videoLayout';
import usePeer from '../hooks/usePeer'
import useUserMedia from '../hooks/useUserMedia';

const alignCenter = { textAlign: "center" };

const Home = () => {
  const localStream = useUserMedia();
  const [remoteStream, setRemoteStream] = useState(null);
  const [remoteId, setRemoteId] = useState('');
  const [message, setMessage] = useState('');
  const [peer, id, connections, error] = usePeer(localStream);

  function setDelayMsg(msg) {
    setMessage(msg);
    setTimeout(() => {
      setMessage(null);
    }, 2000)
  }

  async function makeCall() {
    if (peer && remoteId !== '') {
      try {
        setMessage("Connecting...");
        const call = await peer.call(remoteId, localStream);
        if (call) setMessage(null);
        call.on('stream', (stream) => {
          console.log(stream);
          setRemoteStream(stream);
        });
        console.log(call);
        call.on('error', error => console.log(error));
        if (call) setMessage(null);
      } catch (error) {
        setDelayMsg(error.message);
      }
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
        Your peerID is {id}
      </p>
      <p style={alignCenter}>
        {message}
      </p>
      <p style={alignCenter}>
        {error && error.message}
      </p>
      <span> Insert RemoteID </span>
      <input onChange={event => setRemoteId(event.target.value)} />
      <button onClick={() => makeCall()}> Call </button>
      <VideoLayout localStream={localStream} remoteStream={remoteStream} />
    </div>
  )

}
export default Home
