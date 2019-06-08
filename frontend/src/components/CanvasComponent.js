import React from "react";
import openSocket from "socket.io-client";

const sgn = value => {
  return value >= 0.5 ? 1 : -1;
};

class CanvasComponent extends React.Component {
  componentDidMount() {
    const socket = openSocket("http://localhost:3000");
    socket.on("tap:emit", data => {
      this.updateCanvas(data);
    });
    socket.on("clear:emit", () => {
      this.clearCanvas();
    });
  }
  clearCanvas() {
    const ctx = this.refs.canvas.getContext("2d");
    ctx.clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);
  }
  updateCanvas(data) {
    const ctx = this.refs.canvas.getContext("2d");
    ctx.beginPath();
    ctx.arc(
      ctx.canvas.width * data.coordinates[0] + data.direction[0],
      ctx.canvas.height * (1 - data.coordinates[1]) + data.direction[1],
      5,
      0,
      Math.PI * 2
    );
    ctx.closePath();
    ctx.fill();
  }
  render() {
    return <canvas ref="canvas" />;
  }
}

export default CanvasComponent;
