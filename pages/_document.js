import React from 'react'
import Document, { Head, Main, NextScript } from 'next/document';

export default class extends Document {
    render() {
        return (
            <html lang="pt-br">
                <Head>
                    <script src="https://unpkg.com/peerjs@1.0.0/dist/peerjs.min.js" />

                    <script dangerouslySetInnerHTML={{
                        __html: `
                        const mediaConfig = {audio: {echoCancellation: true, noiseSuppression: true}, video: { facingMode: "user" }};
                        
                        var span, remoteVideo, peer;
                        window.onload = function() {
                            remoteVideo = document.querySelector('#remoteVideo');
                            span = document.querySelector('#span');
                        }

                        window.addEventListener("unload", cleanUp, false);

                        function cleanUp(){
                            peer.disconnect();
                            peer.destroy();
                        }

                        const peerConfig = { 'iceServers': [{ 'urls': ['stun:stun.l.google.com:19302'] }] };
                        peer = new Peer(peerConfig);

                        function getPeer(){
                            return peer;
                        }

                        function getPeerId(){
                            return peer.id;
                        }

                        peer.on('call', function(call) {
                            navigator.mediaDevices.getUserMedia(mediaConfig)
                            .then(function(stream) {
                                span.textContent='receiving call from ' + call.peer;
                                call.answer(stream); // Answer the call with an A/V stream.
                                call.on('stream', function(remoteStream) {
                                    playRemoteStream(remoteStream);
                                })
                            })
                            .catch(function(error) {
                                console.log(error);
                            });
                        });

                        peer.on('disconnected', () => {
                            console.log("peer desconnected");
                        });

                        peer.on('close', () => {
                            console.log("peer closed");
                        });

                        peer.on('error', (error) => {
                            console.log("peer error", error);
                        });

                        function makeCall(remoteID){
                            if(remoteID === ''){
                                span.textContent='insert id to connect';
                                return;
                            }
                            navigator.mediaDevices.getUserMedia(mediaConfig)
                            .then(function(localstream) {
                                var call = peer.call(remoteID, localstream);
                                call.on('stream', function(remoteStream) {
                                    span.textContent='Connected to ' + remoteID;
                                    playRemoteStream(remoteStream);
                                });
                                call.on('close', () => {
                                    console.log("call closed");
                                });
                                call.on('error', (error) => {
                                    console.log("call error", error);
                                });
                            }).catch(function(error) {
                                console.log('Failed to get local stream', error);
                            });
                        }

                        function removeRemoteStream(){
                            remoteVideo.srcObject = null;
                        }

                        function playRemoteStream(stream){

                            if ('srcObject' in remoteVideo) {
                                remoteVideo.srcObject = stream;
                            } else {
                                remoteVideo.src = window.URL.createObjectURL(stream); // for older browsers
                            }

                            var playPromise = remoteVideo.play();

                            if (playPromise !== undefined) {
                                playPromise.then(_ => {
                                    // Automatic playback started!
                                    // Show playing UI.
                                })
                                .catch(error => {
                                    console.log(error);
                                    // Auto-play was prevented
                                    // Show paused UI.
                                });
                            }
                        }
                    `
                    }} />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </html>
        )
    }
}