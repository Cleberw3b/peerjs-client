import React, { useState, useEffect } from 'react';
import VideoLayout from '../components/videoLayout';
import useUserMedia from '../hooks/useUserMedia';

var config = { 'iceServers': [{ 'urls': ['stun:stun.l.google.com:19302'] }] };
const alignCenter = { textAlign: "center" };

const Home = () => {
  const localStream = useUserMedia();
  const [remoteId, setRemoteId] = useState('');
  const [message, setMessage] = useState('');
  const [remoteStream, setRemoteStream] = useState(null);
  const [error, setError] = useState(null);
  const [peer, setPeer] = useState(null);
  const [call, setCall] = useState(null);

  const createPeer = async () => {
    import('peerjs').then(async () => {
      let myPeer = await new Peer(config);
      setPeer(myPeer);
    })
  }

  useEffect(() => {
    if (!peer)
      createPeer();
    else
      return () => {
        peer.destroy();
      };
  }, [])

  useEffect(() => {
    if (peer) {
      peer.on('open', () => { });
      peer.on('connection', dataConnection => { });
      peer.on('call', (call) => {

        // Answer the call, providing our mediaStream
        call.answer(localStream);
        // receive answer and set as remoteStream
        call.on('stream', (remstream) => {
          setRemoteStream(remstream);
        });
        call.on('close', () => {
          setRemoteStream(null);
        });
      });

      peer.on('close', () => { });
      peer.on('error', error => setError(error));
    }
    console.log(peer);
    console.log(error);
  }, [peer])

  useEffect(() => {
    if (call) {
      // receive answer and set as remoteStream
      call.on('stream', (stream) => {
        setRemoteStream(stream);
      });
      call.on('close', () => {
        setRemoteStream(null);
      });
      call.on('error', error => setError(error));
    }
    console.log(call);
    console.log(error);
    return;
  }, [call])

  async function makeCall() {
    if (peer && remoteId !== '' && localStream) {
      const newCall = await peer.call(remoteId, localStream);
      setCall(newCall);
    } else {
      if (!peer)
        setMessage("peer not created yet");
      else if (remoteId === '')
        setMessage("insert id to connect");
    }
  }

  return (
    <div>
      <h1 style={alignCenter}>
        Recording from camera and voice
      </h1>
      <p style={alignCenter}>
        Your peerID is {peer && peer.id}
      </p>
      <p style={alignCenter}>
        {message}
      </p>
      <p style={alignCenter}>
        Error -> {error && error.message || error}
      </p>
      <span> Insert RemoteID </span>
      <input onChange={event => setRemoteId(event.target.value)} />
      <button onClick={() => makeCall()}> Call </button>
      <VideoLayout localStream={localStream} remoteStream={remoteStream} />
    </div>
  )
}
export default Home
