import React from "react";
import openSocket from "socket.io-client";
import Peer from "peerjs";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
  }

  async componentDidMount() {
    if (!("mediaDevices" in navigator) || !("RTCPeerConnection" in window)) {
      alert("Sorry, your browser does not support WebRTC.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true
      });
      const peer = new Peer("broadcaster", {
        host: "localhost",
        port: 4000,
        path: "/peerjs"
      });
      peer.call("receiver", stream);
      this.videoRef.current.srcObject = stream;
      const socket = openSocket("http://localhost:3000");
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    return <video ref={this.videoRef} autoPlay />;
  }
}

export default Home;
