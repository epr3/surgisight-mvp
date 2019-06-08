import React from "react";
import openSocket from "socket.io-client";

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
        <img ref={this.imageRef} src="" alt="videoFeed" />
        <ThreeScene />
      </div>
    );
  }
}

export default Broadcast;
