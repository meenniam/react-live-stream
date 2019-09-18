import React,{Component} from 'react'
import io from 'socket.io-client'
import { peer } from './helper/media-access'

class WatchLive extends Component {
    constructor(props){
        super(props);
        this.state = {
            config : { // eslint-disable-line no-unused-vars
              'iceServers': [{
                'urls': ['stun:stun.l.google.com:19302']
              }]
            },
            socket: {},
          }
    }
    componentDidMount() {
        const vm = this;
        let peerConnection;
        const socket = io.connect(process.env.REACT_APP_SIGNALING_SERVER);
        this.setState({socket})
        socket.on('offer', function(id, description) {
            console.log('id', id);
            console.log('description', description);
            peerConnection = new peer(vm.state.config);
            peerConnection.setRemoteDescription(description)
            .then(() => peerConnection.createAnswer())
            .then(sdp => peerConnection.setLocalDescription(sdp))
            .then(function () {
                socket.emit('answer', id, peerConnection.localDescription);
            });
            peerConnection.ontrack = function(event) {
                vm.remoteVideo.srcObject = event.streams[0];
            };
            peerConnection.onicecandidate = function(event) {
                if (event.candidate) {
                    socket.emit('candidate', id, event.candidate);
                }
            };
        });

        socket.on('candidate', function(id, candidate) {
            peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
        .catch(e => console.error(e));
        });

        socket.on('connect', function() {
            socket.emit('watcher');
        });

        socket.on('broadcaster', function() {
            socket.emit('watcher');
        });

        socket.on('bye', function() {
            peerConnection.close();
        });
    }
    render() {
        return (
            <div className="live-container">
                <div className="live-list-card">
                    <div className="local-video-wrapper">
                        <video
                            autoPlay
                            id="remoteVideo"
                            ref={video => (this.remoteVideo = video)}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default WatchLive