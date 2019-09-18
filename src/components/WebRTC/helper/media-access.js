export async function getDisplayStream(){
    return navigator.mediaDevices.getDisplayMedia();
}

export function getUserMedia() {
    return new Promise((resolve, reject) => {
      navigator.getUserMedia = navigator.getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia
      const op = {
        video: {
          width: { min: 160, ideal: 640, max: 1280 },
          height: { min: 120, ideal: 360, max: 720 },
          facingMode: "user"
        },
        audio: true
      }
      navigator.getUserMedia(
        op,
        stream => {
          resolve(stream)
        },
        () => {}
      )
    })
}

export const peer = window.RTCPeerConnection || window.mozRTCPeerConnection || 
window.ebkitRTCPeerConnection || window.msRTCPeerConnection;

export const sessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || 
window.webkitRTCSessionDescription || window.msRTCSessionDescription;