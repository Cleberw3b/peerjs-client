import React from 'react'
import "./videoLayout.scss"

export default function VideoLayout() {

  return (
    <div className="conference-layout" >
      <div className="caller-stream">
        <video autoPlay playsInline muted />
      </div>
      <div className="listeners-box">
        <div className="listener-stream l1" >
          <video autoPlay playsInline muted />
        </div>
      </div>
    </div>
  )
}