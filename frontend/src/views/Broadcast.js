import React from "react";
import openSocket from "socket.io-client";

import { LeapProvider } from "../components/leap";

import Legend from "../components/Legend";
import ThreeScene from "../components/ThreeScene";

class Broadcast extends React.Component {
  constructor(props) {
    super(props);
    this.imageRef = React.createRef();
  }

  componentDidMount() {
    const socket = openSocket("http://localhost:3000");
    socket.on("stream", image => {
      this.imageRef.current.src = image;
    });
  }
  render() {
    return (
      <div style={{ position: 'relative' }}>
        <div className="video-container">
          <img ref={this.imageRef} src="" alt="videoFeed" />
        </div>
        <LeapProvider options={{ enableGestures: true }}>
          <ThreeScene />
        </LeapProvider>
        <Legend/>
      </div>
    );
  }
}

export default Broadcast;
