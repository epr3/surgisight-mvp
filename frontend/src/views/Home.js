import React from "react";
import Peer from "peerjs";

import ThreeHomeScene from "../components/ThreeHomeScene";

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
        video: {
          width: 1920,
          height: 1080,
          facingMode: { exact: "environment" }
        },
        audio: true
      });
      const peer = new Peer("broadcaster", {
        host: "localhost",
        port: 4000,
        path: "/peerjs",
        secure: false
      });
      peer.call("receiver", stream);
      this.videoRef.current.srcObject = stream;
    } catch (e) {
      console.error(e);
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.videoStreamInterval);
  }

  render() {
    return (
      <>
        <ThreeHomeScene />
        <video ref={this.videoRef} autoPlay />
      </>
    );
  }
}

export default Home;
