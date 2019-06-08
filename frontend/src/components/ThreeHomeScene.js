import React from "react";
import * as THREE from "three";
import openSocket from "socket.io-client";
import { parse } from "flatted/esm";

class ThreeHomeScene extends React.Component {
  state = {
    socket: null
  };

  addMesh = meshes => {
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshNormalMaterial();
    var mesh = new THREE.Mesh(geometry, material);
    meshes.push(mesh);

    return mesh;
  };

  updateMesh = (bone, mesh) => {
    const baseBoneRotation = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(0, 0, Math.PI / 2)
    );
    console.log(bone);
    mesh.position.fromArray(bone.center());
    mesh.setRotationFromMatrix(new THREE.Matrix4().fromArray(bone.matrix()));
    mesh.quaternion.multiply(baseBoneRotation);
    mesh.scale.set(bone.width, bone.width, bone.length);

    this.scene.add(mesh);
  };

  componentDidMount() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    //ADD SCENE
    this.scene = new THREE.Scene();
    //ADD CAMERA
    this.camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      1,
      5000
    );
    this.camera.position.set(0, 500, 500);
    // this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    // this.camera.position.set(0, 0, 400);
    this.camera.lookAt(this.scene.position);
    //ADD RENDERER
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      preserveDrawingBuffer: true
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setSize(width, height);
    this.mount.appendChild(this.renderer.domElement);
    this.setState({ socket: openSocket("http://localhost:3000") }, () => {
      this.state.socket.on("scene:emit", data => {
        const objectLoader = new THREE.ObjectLoader();
        objectLoader.parse(data, scene => {
          this.scene = scene;
        });
      });
      this.start();
    });
  }
  componentWillUnmount() {
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
  }
  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  };
  stop = () => {
    cancelAnimationFrame(this.frameId);
  };
  animate = () => {
    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
  };
  renderScene = () => {
    this.renderer.render(this.scene, this.camera);
  };
  render() {
    return (
      <div
        style={{
          width: "100%",
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)"
        }}
        ref={mount => {
          this.mount = mount;
        }}
      />
    );
  }
}

export default ThreeHomeScene;
