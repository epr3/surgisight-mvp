import React from "react";
import * as THREE from "three";
import { withLeapContainer } from "./leap";
import openSocket from "socket.io-client";

function restrictToRange(value, min, max) {
  if (value > max) {
    return max;
  }
  if (value < min) {
    return min;
  }
  return value;
}

function screenFingerPosition(tipPosition, spaceSize) {
  const heightStartScale = 100;
  const widthRatio = window.innerWidth / (2 * spaceSize);
  const heightRatio = window.innerHeight / (2 * spaceSize);
  const x = restrictToRange(tipPosition[0], -spaceSize, spaceSize);
  const y = restrictToRange(
    tipPosition[1] - heightStartScale - spaceSize,
    -spaceSize,
    spaceSize
  );
  const z = tipPosition[2];
  const xNorm = x * widthRatio;
  const yNorm = y * heightRatio;
  const normalizedPosition = [xNorm, yNorm, z];
  return normalizedPosition;
}

class ThreeScene extends React.Component {
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
    // this.camera.lookAt(this.scene.position);
    //ADD RENDERER
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      preserveDrawingBuffer: true
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setSize(width, height);
    this.mount.appendChild(this.renderer.domElement);
    this.boneMeshes = [];
    // const geometry = new THREE.BoxGeometry(50, 50, 50);
    // const material = new THREE.MeshNormalMaterial();
    // const mesh = new THREE.Mesh(geometry, material);
    // mesh.position.set(0, 100, 0);
    // this.scene.add(mesh);
    this.start();
    setInterval(() => {
      let hands = this.props.frame.hands;
      if (hands) {
        this.state.socket.emit("scene", this.scene.toJSON());
      }
    }, 500);
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
    let gestures = this.props.frame.gestures ? this.props.frame.gestures : [];
    if (gestures.length > 0) {
      gestures.forEach(function(gesture) {
        if (gesture.type === "swipe") {
          console.log("e swipe bitches");
        }
      });
    }
    let countBones = 0;
    this.boneMeshes.forEach(item => {
      this.scene.remove(item);
    });

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
