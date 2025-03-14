import * as THREE from "three";

function createRenderer() {
  const WIDTH = window.innerWidth;
  const HEIGHT = window.innerHeight;
  const canvas = document.querySelector("#myCanvas");

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas,
    alpha: true,
  });
  renderer.setSize(WIDTH, HEIGHT);
  renderer.setClearColor(0xffffff, 0);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  return renderer;
}

function createCamera() {
  const WIDTH = window.innerWidth;
  const HEIGHT = window.innerHeight;
  const camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT);
  camera.position.z = 50;

  return camera;
}

function createScene() {
  
  const scene = new THREE.Scene();

  return scene;
}

function createTorusMesh() {
  const torusKnotGeometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
  return torusKnotGeometry;
}

export { createScene, createTorusMesh, createRenderer, createCamera };