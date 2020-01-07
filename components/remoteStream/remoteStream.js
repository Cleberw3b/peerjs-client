import React, { useEffect, useRef } from 'react'
import "./remoteStream.scss"

export default function RemoteStream({ remoteStreams }) {

  const refsArray = useRef([]);

  useEffect(() => {
    remoteStreams.map(streamData =>
      refsArray.current[streamData.peerId].srcObject = streamData.stream)
  }, [remoteStreams])

  return (
    <div className="remote">
      {remoteStreams && remoteStreams.map((dataStream, i, arr) =>
        (
          <div key={dataStream.peerId} className={"remote-stream" + `${arr.length > 1 ? " multiple" : " single"}`}>
            <video onContextMenu={event => event.preventDefault()}
              ref={ref => refsArray.current[dataStream.peerId] = ref}
              autoPlay playsInline />
          </div>
        )
      )}
    </div>
  )
}