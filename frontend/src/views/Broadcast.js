import React from "react";
import openSocket from "socket.io-client";

import Peer from "peerjs";
import { LeapProvider } from "../components/leap";

import Legend from "../components/Legend";
import ThreeScene from "../components/ThreeScene";

class Broadcast extends React.Component {
  constructor(props) {
    super(props);
    this.imageRef = React.createRef();
    this.videoRef = React.createRef();
  }

  state = {

  }

  componentDidMount() {
    const peer = new Peer("receiver", {
      host: "localhost",
      port: 4000,
      path: "/peerjs"
    });
    peer.on(
      "call",
      call => {
        call.answer();
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
    const socket = openSocket("http://localhost:3000");
    socket.on("user connected", data => {
      console.log(data);
    });
  }
  render() {
    return (
      <div style={{ position: "relative" }}>
        <div className="video-container">
          <video ref={this.videoRef} autoPlay />
        </div>
        <LeapProvider options={{ enableGestures: true }}>
          <ThreeScene />
        </LeapProvider>
        <Legend />
      </div>
    );
  }
}

export default Broadcast;
