import React from 'react'
import Peer from 'peerjs'

class Video extends React.Component {

    // this component render users local video and provide buttons for manage video stream
    constructor(props) {
        super(props);
        this.state = {stream: null, error: null, videos: [], peer: null, peers: []}
        this.streamVideo = this.streamVideo.bind(this);
        this.stopVideo = this.stopVideo.bind(this);
        this.callTo = this.callTo.bind(this);
    }

    componentDidMount() {
        this.props.socket.emit('addPeer');

        this.props.socket.on('getOtherPeers', (peers) => {
            const peerArray = peers.filter(peer => peer !== this.state.peer.id);
            this.setState({peers: peerArray});
            if (this.state.stream) {
                this.state.peers.forEach(peer => this.callTo(peer, this.state.stream));
            }
        })

        if (this.state.peer) {
            this.state.peer.on('call', function (call) {
                call.on('stream', stream => {
                    this.setState(prevState => ({
                        videos: [...prevState.videos, stream]
                    }));
                });
                if (this.state.stream) {
                    call.answer(this.state.stream);
                }
            })
            this.state.peer.on('open', function (id) {
            })

        }

        // server send peer id to user and then client construct peer object.
        this.props.socket.on('getPeerId', (data) => {
            this.setState({peer: new Peer(data)})
        })
    }

    callTo(id, stream) {
        const call = this.state.peer.call(id, stream);
    }

    // when user click on button app get user media data, set state of component and render video in the "my-video" video element.
    streamVideo() {
        const comp = this;
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(function(stream) {
                comp.setState({ error: null });
                comp.setState({ stream: stream});
                document.getElementById('my-video').srcObject = comp.state.stream;
                comp.state.peers.forEach(peer => this.state.peer.connect(peer));
                comp.state.peers.forEach(peer => this.callTo(peer, stream));
            })
            .catch(function(err) {
                comp.setState({error: err.text})
            });
    }

    // when user click on button app stop getting media data and set state "stream" on null.
    stopVideo() {
        this.state.stream.getTracks().forEach(function(track) {
            track.stop();
        });
        document.getElementById('my-video').srcObject = null;
        this.setState({stream: null});
    }

    render() {
        return (
            <div>
                <div className={"d-flex flex-row bd-highlight my-2"}>
                    {this.state.stream && <video autoPlay id={'my-video'} style={{height: "25%", width: "25%"}}></video>}
                </div>
                {(!this.state.stream || !this.state.stream.active) &&
                <div><button className={"btn btn-dark"} onClick={this.streamVideo}>Stream Video</button></div>}
                {(this.state.stream && this.state.stream.active) &&
                <div><button className={"btn btn-danger"} onClick={this.stopVideo}>Stop Video</button></div>}
                {this.state.error && <div className={'alert alert-danger my-2'}>{this.state.error}</div>}
            </div>
        );
    }
}

export default Video;