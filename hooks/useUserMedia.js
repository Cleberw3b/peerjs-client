import React, { useState, useEffect } from "react";


const ratios = new Map([
  ["default", { width: 640, height: 480 }],
  ["portrait", { width: 375, height: 720 }]
])

const CAPTURE_OPTIONS = {
  audio: true,
  video: { facingMode: "user" }
}

export default function useUserMedia() {
  const [mediaStream, setMediaStream] = useState(null);

  useEffect(() => {
    const enableStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(CAPTURE_OPTIONS);
        setMediaStream(stream);
      } catch (error) {
        console.log(error);
      }
    }

    if (!mediaStream) {
      enableStream();
    } else {
      return () => {
        mediaStream.getTracks().forEach(track => {
          track.stop();
        });
      }
    }
  }, [mediaStream]);

  return mediaStream;
}