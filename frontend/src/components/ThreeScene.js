import React from "react";
import * as THREE from "three";
import { withLeapContainer } from "./leap";

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
    items: [],
    hands: null
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
  initFingers = () => {
    const { fingers } = this.props.frame;

    this.setState({ items: [] });

    if (fingers && fingers.length) {
      this.setState({
        items: fingers.map(item => ({
          x: item.stabilizedTipPosition[0],
          y: item.stabilizedTipPosition[1],
          z: item.stabilizedTipPosition[2]
        }))
      });
    } else {
      // No fingers
      this.setState({
        items: []
      });
    }
  };
  componentDidMount() {
    this.initFingers();
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
    //ADD SPHERE
    // this.geometries = [];
    // for (let i = 0; i < 10; i++) {
    //   this.geometries.push(
    //     new THREE.SphereGeometry(10, 10, 10, 0, Math.PI * 2, 0, Math.PI * 2)
    //   );
    // }
    // const material = new THREE.MeshBasicMaterial({ color: "#433F81" });
    // this.spheres = this.geometries.map(
    //   geometry => new THREE.Mesh(geometry, material)
    // );
    // this.spheres.forEach(sphere => {
    //   this.scene.add(sphere);
    // });
    this.armMeshes = [];
    this.boneMeshes = [];
    this.start();
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
    this.boneMeshes.forEach((item) => {
      this.scene.remove(item);
    });

    if (hands) {
      hands.forEach(hand => {
        hand.fingers.forEach(finger => {
          for (let i = 0; i < finger.bones.length; i++) {
            if (countBones++ === 0) {
              continue;
            }
            var boneMesh =
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
