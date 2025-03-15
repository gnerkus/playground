import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
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

const vertexShader = await loadFile("threejs_toon.vert");
const fragmentShader = await loadFile("threejs_toon.frag");

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

// ========================== REPRODUCING THE CURRENT MATERIALS ====================
const textureLoader = new THREE.TextureLoader();

function getOnProgress(resourceName) {
  return function (xhr) {
    console.log(
      `${resourceName} texture ${(xhr.loaded / xhr.total) * 100}% loaded`
    );
  };
}

const [
  baseEmissiveMap,
  baseMap,
  baseMetalnessMap,
  baseNormalMap,
  baseRoughnessMap,
] = await Promise.all([
  textureLoader.loadAsync(
    "../assets/robot_arm/textures/robot_base_emissive.jpeg",
    getOnProgress("base emissive map")
  ),
  textureLoader.loadAsync(
    "../assets/robot_arm/textures/robot_base_baseColor.jpeg",
    getOnProgress("base map")
  ),
  textureLoader.loadAsync(
    "../assets/robot_arm/textures/robot_base_metallicRoughness.png",
    getOnProgress("base metalness map")
  ),
  textureLoader.loadAsync(
    "../assets/robot_arm/textures/robot_base_normal.jpeg",
    getOnProgress("base normal map")
  ),
  textureLoader.loadAsync(
    "../assets/robot_arm/textures/robot_base_metallicRoughness.png",
    getOnProgress("base roughness map")
  ),
]);

// ROBOT BASE
baseEmissiveMap.colorSpace = "srgb";
baseEmissiveMap.flipY = false;
baseEmissiveMap.wrapS = 1000;
baseEmissiveMap.wrapT = 1000;
baseMap.colorSpace = "srgb";
baseMap.flipY = false;
baseMap.wrapS = 1000;
baseMap.wrapT = 1000;
baseMetalnessMap.flipY = false;
baseMetalnessMap.wrapS = 1000;
baseMetalnessMap.wrapT = 1000;
baseNormalMap.flipY = false;
baseNormalMap.wrapS = 1000;
baseNormalMap.wrapT = 1000;
baseRoughnessMap.flipY = false;
baseRoughnessMap.wrapS = 1000;
baseRoughnessMap.wrapT = 1000;

const robotBaseMaterial = new THREE.MeshStandardMaterial({
  emissiveMap: baseEmissiveMap,
  // TODO: use a color for emissive
  emissive: 0xffffff,
  map: baseMap,
  metalnessMap: baseMetalnessMap,
  metalness: 1,
  side: THREE.DoubleSide,
  normalMap: baseNormalMap,
  roughnessMap: baseRoughnessMap,
  name: "robot_base",
});

// ROBOT ARM
const [armEmissiveMap, armMap, armMetalnessMap, armNormalMap, armRoughnessMap] =
  await Promise.all([
    textureLoader.loadAsync(
      "../assets/robot_arm/textures/robo_arm_emissive.jpeg",
      getOnProgress("arm emissive map")
    ),
    textureLoader.loadAsync(
      "../assets/robot_arm/textures/robo_arm_baseColor.jpeg",
      getOnProgress("arm map")
    ),
    textureLoader.loadAsync(
      "../assets/robot_arm/textures/robo_arm_metallicRoughness.png",
      getOnProgress("arm metalness map")
    ),
    textureLoader.loadAsync(
      "../assets/robot_arm/textures/robo_arm_normal.jpeg",
      getOnProgress("arm normal map")
    ),
    textureLoader.loadAsync(
      "../assets/robot_arm/textures/robo_arm_metallicRoughness.png",
      getOnProgress("arm roughness map")
    ),
  ]);

armEmissiveMap.colorSpace = "srgb";
armEmissiveMap.flipY = false;
armEmissiveMap.wrapS = 1000;
armEmissiveMap.wrapT = 1000;
armMap.colorSpace = "srgb";
armMap.flipY = false;
armMap.wrapS = 1000;
armMap.wrapT = 1000;
armMetalnessMap.flipY = false;
armMetalnessMap.wrapS = 1000;
armMetalnessMap.wrapT = 1000;
armNormalMap.flipY = false;
armNormalMap.wrapS = 1000;
armNormalMap.wrapT = 1000;
armRoughnessMap.flipY = false;
armRoughnessMap.wrapS = 1000;
armRoughnessMap.wrapT = 1000;

const robotarmMaterial = new THREE.MeshStandardMaterial({
  emissiveMap: armEmissiveMap,
  // TODO: use a color for emissive
  emissive: 0xffffff,
  map: armMap,
  metalnessMap: armMetalnessMap,
  metalness: 1,
  side: THREE.DoubleSide,
  normalMap: armNormalMap,
  roughnessMap: armRoughnessMap,
  name: "robo_arm",
});

// ============================ END ================================================

// ============= MESH, TEXTURE & ANIMATIONS LOADER =====================
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("jsm/libs/draco/gltf/");

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

const gltf = await loader.loadAsync("../assets/robot_arm/scene.gltf", (xhr) => {
  console.log(`Robot arm GLTF ${(xhr.loaded / xhr.total) * 100}% loaded`);
});

const model = gltf.scene;

model.traverse((child) => {
  if (child.isMesh) {
    if (child.material.name === "robot_base") {
      child.material = robotBaseMaterial;
    } else if (child.material.name === "robo_arm") {
      child.material = robotarmMaterial;
    }
  }
});

model.position.set(0, 0, 0);
model.scale.set(1, 1, 1);

scene.add(model);

mixer = new THREE.AnimationMixer(model);
mixer.clipAction(gltf.animations[0]).play();

renderer.setAnimationLoop(animate);

window.onresize = function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
};

function animate() {
  const delta = clock.getDelta();

  mixer.update(delta);

  controls.update();

  renderer.render(scene, camera);
}
