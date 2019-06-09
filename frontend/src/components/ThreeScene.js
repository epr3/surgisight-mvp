import React from "react";
import * as THREE from "three";
import { withLeapContainer } from "./leap";
import openSocket from "socket.io-client";

class ThreeScene extends React.Component {
  state = {
    socket: null
  };
  addMesh = meshes => {
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshNormalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.6
    });
    var mesh = new THREE.Mesh(geometry, material);
    meshes.push(mesh);

    return mesh;
  };

  updateMesh = (bone, mesh) => {
    const baseBoneRotation = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(0, 0, Math.PI / 2)
    );

    mesh.position.fromArray(bone.center());
    mesh.setRotationFromMatrix(new THREE.Matrix4().fromArray(bone.matrix()));
    mesh.quaternion.multiply(baseBoneRotation);
    mesh.scale.set(bone.width, bone.width, bone.length);

    this.scene.add(mesh);
  };

  componentDidMount() {
    this.setState({ socket: openSocket("http://localhost:3000") });
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
    this.camera.position.set(0, 250, 500);
    //ADD RENDERER
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      preserveDrawingBuffer: true
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setSize(width, height);
    this.mount.appendChild(this.renderer.domElement);
    this.boneMeshes = [];
    this.cubes = [];
    this.start();
    setInterval(() => {
      this.state.socket.emit("scene", this.scene.toJSON());
    }, 80);
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
    let hands = this.props.frame.hands;
    let countBones = 0;
    this.boneMeshes.forEach(item => {
      this.scene.remove(item);
    });
    let gestures = this.props.frame.gestures ? this.props.frame.gestures : null;
    if (gestures) {
      gestures.forEach(gesture => {
        if (gesture.type === "screenTap" && gesture.state === "stop") {
          const material = new THREE.SpriteMaterial();
          const mesh = new THREE.Sprite(material);
          mesh.scale.set(20, 20, 20);
          this.cubes.push(mesh);
          mesh.position.fromArray(gesture.position);
          this.scene.add(mesh);
        } else if (gesture.type === "swipe" && gesture.state === "stop") {
          this.cubes.forEach(item => {
            this.scene.remove(item);
          });
        }
      });
    }
    if (hands) {
      hands.forEach(hand => {
        hand.fingers.forEach(finger => {
          for (let i = 0; i < finger.bones.length; i++) {
            if (countBones++ === 0) {
              continue;
            }
            let boneMesh =
              this.boneMeshes[countBones] || this.addMesh(this.boneMeshes);
            this.updateMesh(finger.bones[i], boneMesh);
          }
        });
      });
    }
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

export default withLeapContainer(ThreeScene);
