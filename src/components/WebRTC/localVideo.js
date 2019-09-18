import React from 'react'
import './video.css'
import io from 'socket.io-client'
import { getUserMedia, peer } from './helper/media-access';

class LocalVideo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      config : { // eslint-disable-line no-unused-vars
        'iceServers': [{
          'urls': ['stun:stun.l.google.com:19302']
        }]
      },
      socket: {},
    }
    this.getUserMedia = getUserMedia();
  }
  componentDidMount() {
    const vm = this;
    const socket = io.connect(process.env.REACT_APP_SIGNALING_SERVER);
    const peerConnections = {};
    this.setState({socket})
    this.getUserMedia.then(stream => {
      this.localVideo.srcObject = stream;
      socket.emit('broadcaster');
    })
    socket.on('answer', function(id, description) {
      peerConnections[id].setRemoteDescription(description);
    });
    
    socket.on('watcher', function(id) {
      const peerConnection = new peer(vm.state.config);
      peerConnections[id] = peerConnection;
      let stream = vm.localVideo.srcObject;
            stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
      peerConnection.createOffer()
      .then(sdp => peerConnection.setLocalDescription(sdp))
      .then(function () {
        socket.emit('offer', id, peerConnection.localDescription);
      });
      peerConnection.onicecandidate = function(event) {
        if (event.candidate) {
          socket.emit('candidate', id, event.candidate);
        }
      };
    });
    
    socket.on('candidate', function(id, candidate) {
      peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
    });
    
    socket.on('bye', function(id) {
      peerConnections[id] && peerConnections[id].close();
      delete peerConnections[id];
    });
  }

  // componentWillUnmount() {
  //   this.state.socket.disconnect();
  // }
  render() {
    return (
      <div className="video-wrapper">
        <div className="local-video-wrapper">
          <video
            autoPlay
            id="localVideo"
            muted
            ref={video => (this.localVideo = video)}
          />
        </div>
      </div>
    )
  }
}

export default LocalVideo