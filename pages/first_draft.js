import React, { useState, useEffect, useRef } from 'react';
import useConnectedPeers from '../hooks/useConnectedPeers';

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

const userMediaConfig = { audio: { echoCancellation: true, noiseSuppression: true }, video: { facingMode: "user" } };
const audioOnly = { audio: true, video: false };
const peerConfig = { 'iceServers': [{ 'urls': ['stun:stun.l.google.com:19302'] }] };
const peerConfig2 = {
  host: '127.0.0.1',
  // secure: true,
  port: 5000,
  path: '/peerjs',
  config: {
    'iceServers': [{ 'urls': ['stun:stun.l.google.com:19302'] }]
  },
  debug: 3
};

function getRandomId() {
  let min = Math.ceil(10000000);
  let max = Math.floor(99999999);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const Home = () => {
  const [myPeer, setPeer] = useState(null);
  const [remoteId, setRemoteId] = useState(null);
  const [call, setCall] = useState(null);
  const [peerInfo, setPeerInfo] = useState(null);
  const [callMessage, setCallMessage] = useState(null);
  const connectedPeers = useConnectedPeers();
  const isClient = typeof window === "object";

  const remoteVideoRef = useRef();
  const localVideoRef = useRef();

  const handleCanPlayRemote = () => {
    remoteVideoRef.current.play();
  }
  const handleCanPlayLocal = () => {
    localVideoRef.current.play();
  }

  useEffect(() => {
    if (myPeer) {
      return () => {
        myPeer.disconnect();
        myPeer.destroy();
      }
    }
  }, [myPeer])


  function createPeer() {

    let peer;
    import('peerjs').then(() => {
      peer = new Peer(getRandomId(), peerConfig2);

      peer.on('open', () => {
        setPeer(peer);
        setPeerInfo("Your id is " + peer.id);
      })

      peer.on('connection', (dataConnection) => {
      })

      peer.on('call', (call) => {
        setCallMessage('receiving call from ' + call.peer);
        // TODO change constraints to be audio only
        navigator.mediaDevices.getUserMedia(userMediaConfig)
          .then((localstream) => {
            if (localstream && localVideoRef.current && !localVideoRef.current.srcObject) {
              localVideoRef.current.srcObject = localstream;
            }
            setCall(call);
            // Answer the call with an A/V stream.
            call.answer(localstream);

            // Play the remote stream
            call.on('stream', (remoteStream) => {
              if (remoteStream && remoteVideoRef.current && !remoteVideoRef.current.srcObject) {
                remoteVideoRef.current.srcObject = remoteStream;
              }
            });

            call.on('close', () => {
              setCallMessage("The call has ended");
              hangUp();
            });

            call.on('error', (error) => {
              console.log(error);
              hangUp();
            })
          })
          .catch(error => { console.log(error); });
      });

      peer.on('disconnected', () => {
        setPeerInfo("peer desconnected");
        setPeer(null);
      });

      peer.on('close', () => {
        setPeerInfo("peer closed");
        setPeer(null);
      });

      peer.on('error', (error) => {
        console.log("peer error", error);
        setPeer(null);
      });

    }).catch(error => { console.log(error) });
  }

  function makeCall() {
    if (isClient) {
      if (remoteId === '') {
        setCallMessage('insert id to connect');
        return;
      }

      navigator.mediaDevices.getUserMedia(userMediaConfig)
        .then(function (localstream) {

          if (localstream && localVideoRef.current && !localVideoRef.current.srcObject) {
            localVideoRef.current.srcObject = localstream;
          }

          let thisCall = myPeer.call(remoteId, localstream);
          setCall(thisCall);
          thisCall.on('stream', function (remoteStream) {
            if (remoteStream && remoteVideoRef.current && !remoteVideoRef.current.srcObject) {
              remoteVideoRef.current.srcObject = remoteStream;
            }
            setCallMessage('Connected to ' + thisCall.peer);
          });

          thisCall.on('close', () => {
            setCallMessage("call closed");
            hangUp();
          });

          thisCall.on('error', (error) => {
            console.log("call error", error);
            hangUp();
          });
        }).catch(function (error) {
          console.log('Failed to get local stream', error);
        });
    }
  }

  function hangUp() {
    if (call) {
      call.close();
    }
    setCall(null)
    remoteVideoRef.current.srcObject = null;
  }

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>
        Recording from camera and voice
      </h1>
      {connectedPeers && connectedPeers.map(p => (
        <p key={p} id="peersOnline" style={{ textAlign: "center" }}>
          {p}
        </p>
      ))}
      <p id="peerId" style={{ textAlign: "center" }}>
        {peerInfo && peerInfo}
      </p>
      <p id="message" style={{ textAlign: "center" }}>
        {callMessage && callMessage}
      </p>
      <span> Insert RemoteID </span>
      <input onChange={event => setRemoteId(event.target.value)} />
      {!myPeer && (<button onClick={() => createPeer()}> Create Peer </button>)}
      {!call && myPeer && (<button onClick={() => makeCall()}> Call </button>)}
      {call && myPeer && (<button onClick={() => hangUp()}> Hang Up </button>)}
      <div style={styleCamara} >
        <div style={videoDiv} >
          <video ref={remoteVideoRef} onCanPlay={handleCanPlayRemote} autoPlay playsInline muted />
        </div>
        <div style={videoDiv} >
          <video ref={localVideoRef} onCanPlay={handleCanPlayLocal} autoPlay playsInline muted />
        </div>
      </div>
    </div>
  )
}
export default Home