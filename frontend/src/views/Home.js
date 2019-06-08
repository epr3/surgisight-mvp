import React from "react";
import openSocket from "socket.io-client";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
  }

  state = {
    videoStreamInterval: null
  };

  handleVideo = stream => {
    this.videoRef.current.srcObject = stream;
    const FPS = 60;
    const socket = openSocket("http://localhost:3000");
    this.setState({
      videoStreamInterval: setInterval(() => {
          socket.emit("stream", this.getFrame());
        }, 1000 / FPS)
    });
  };

  videoError = err => {
    alert(err.message);
  };

  getFrame = () => {
    const canvas = document.createElement("canvas");
    canvas.width = this.videoRef.current.videoWidth;
    canvas.height = this.videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(this.videoRef.current, 0, 0);
    const data = canvas.toDataURL("image/webp");
    return data;
  };

  componentDidMount() {
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia ||
      navigator.oGetUserMedia;
    if (navigator.getUserMedia) {
      navigator.getUserMedia(
        { video: true },
        this.handleVideo,
        this.videoError
      );
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.videoStreamInterval);
  }

  render() {
    return <video ref={this.videoRef} autoPlay />;
  }
}

export default Home;
