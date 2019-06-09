import React from "react";
import vitals from "../vitals.png";

import Peer from "peerjs";
import { LeapProvider } from "../components/leap";

import Legend from "../components/Legend";
import ThreeScene from "../components/ThreeScene";
import CanvasComponent from "../components/CanvasComponent";

class Broadcast extends React.Component {
  constructor(props) {
    super(props);
    this.imageRef = React.createRef();
    this.videoRef = React.createRef();
  }

  componentDidMount() {
    const peer = new Peer("receiver", {
      host: "localhost",
      port: 4000,
      path: "/peerjs",
      secure: false
    });
    peer.on(
      "call",
      call => {
        call.answer();
        console.log("answer");
        call.on("stream", remoteStream => {
          console.log(remoteStream);
          console.log(this.videoRef.current);
          this.videoRef.current.srcObject = remoteStream;
          console.log(this.videoRef.current.srcObject);
        });
      },
      err => {
        console.error("Failed to get local stream", err);
      }
    );
  }
  render() {
    return (
      <div style={{ position: "relative" }}>
        <img className="vitals-img" src={vitals} alt="vitals" />

        <div className="video-container">
          <video ref={this.videoRef} autoPlay />
        </div>
        <CanvasComponent />
        <LeapProvider
          options={{ enableGestures: true, useScreenPosition: true }}
        >
          <ThreeScene />
        </LeapProvider>
        <Legend />
      </div>
    );
  }
}

export default Broadcast;
