import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { CustomRoomEnvironment } from "../modules/CustomRoomEnvironment.js";

import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

import { loadFile } from "../modules/utils.js";

let mixer;

const clock = new THREE.Clock();

const container = document.getElementById("container");
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});
renderer.setSize(WIDTH, HEIGHT);
renderer.setClearColor(0xffffff, 0);
renderer.setPixelRatio(window.devicePixelRatio);

container.appendChild(renderer.domElement);

const pmremGenerator = new THREE.PMREMGenerator(renderer);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xff6900);
scene.environment = pmremGenerator.fromScene(
  new CustomRoomEnvironment(),
  0.04
).texture;

// ============ CAMERA & CONTROLS ===================================
const camera = new THREE.PerspectiveCamera(50, WIDTH / HEIGHT, 1, 100);
camera.position.set(3, 3, 3);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.5, 0);
controls.update();
controls.enablePan = false;
controls.enableDamping = true;
// ========================== END ====================================

// ============= MESH, TEXTURE & ANIMATIONS LOADER =====================
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("jsm/libs/draco/gltf/");

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

loader.load(
  "../assets/robot_arm/scene.gltf",
  function (gltf) {
    const model = gltf.scene;

    console.log(gltf);

    model.position.set(0, 0, 0);
    model.scale.set(1, 1, 1);

    scene.add(model);

    mixer = new THREE.AnimationMixer(model);
    mixer.clipAction(gltf.animations[0]).play();

    renderer.setAnimationLoop(animate);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.log("An error happened");
  }
);

window.onresize = function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
};

function animate() {
  const delta = clock.getDelta();

  mixer.update(delta);

  controls.update();

  // stats.update();

  renderer.render(scene, camera);
}

// ============== CUSTOM SHADER =======================================
const uniforms = {
  u_time: {
    type: "f",
    value: 0.0,
  },
  u_frame: {
    type: "f",
    value: 0.0,
  },
  u_resolution: {
    type: "v2",
    value: new THREE.Vector2(
      window.innerWidth,
      window.innerHeight
    ).multiplyScalar(window.devicePixelRatio),
  },
  u_mouse: {
    type: "v2",
    value: new THREE.Vector2(
      0.7 * window.innerWidth,
      window.innerHeight
    ).multiplyScalar(window.devicePixelRatio),
  },
};

const vertexShader = loadFile("threejs_toon.vert");
const fragmentShader = loadFile("threejs_toon.frag");

const shaderMaterial = new THREE.ShaderMaterial({
  uniforms,
  vertexShader,
  fragmentShader,
  transparent: true,
  extensions: {
    derivatives: true,
  },
  side: THREE.DoubleSide,
});

// ============= END ===========================
