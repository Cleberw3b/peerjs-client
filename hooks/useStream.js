import React, { useRef } from 'react';

export default function useStream(mediaStream) {
    const videoRef = useRef();

    if (mediaStream && videoRef.current && !videoRef.current.srcObject) {
        videoRef.current.srcObject = mediaStream;
    }

    const handleCanPlay = () => {
        videoRef.current.play();
    }

    return [videoRef, handleCanPlay];
};