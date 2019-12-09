import React from 'react'
import useStream from '../hooks/useStream';

const styleCamara = {
  background: "black",
  width: "100%",
  overflow: "hidden",
  display: "flex",
  flexDirection: "collum"
}

const localVideoDiv = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  pointerEvents: "none",
}

const remoteVideoDiv = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  pointerEvents: "none",
}

export default function VideoLayout({ localStream = null, remoteStream = null }) {
  const [localVideoRef, handleLocalPlay] = useStream(localStream);
  const [remoteVideoRef, handleRemotePlay] = useStream(remoteStream);

  return (
    <>
      <div style={styleCamara} >
        <div id="remoteVideo" style={remoteVideoDiv} >
          {remoteVideoRef ?
            <video ref={remoteVideoRef} onCanPlay={handleRemotePlay} autoPlay playsInline muted />
            : null
          }
        </div>
        <div style={localVideoDiv} >
          <video ref={localVideoRef} onCanPlay={handleLocalPlay} autoPlay playsInline muted />
        </div>
      </div>
    </>
  )
}