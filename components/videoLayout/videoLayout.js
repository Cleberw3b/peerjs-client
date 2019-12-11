import React from 'react'
import "./videoLayout.scss"

export default function videoLayout(remoteVideoRef, handleCanPlayRemote, isCaller = false, id = 1) {

  return (
    <div className={isCaller ? "caller-stream" : `listener-stream l${id}`}>
      <video ref={remoteVideoRef} onCanPlay={handleCanPlayRemote} autoPlay playsInline muted />
    </div>
  )
}