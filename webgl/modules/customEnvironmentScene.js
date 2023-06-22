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

function createScene() {
  const WIDTH = window.innerWidth;
  const HEIGHT = window.innerHeight;
  const scene = new THREE.Scene();

  // camera
  const camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT);
  camera.position.set(0, 0, 5);
  scene.add(camera);

  // first point light
  const pointLight1 = new THREE.PointLight(0xffffff, 1);
  pointLight1.position.set(10, 10, 5);
  scene.add(pointLight1);

  // second point light
  const pointLight2 = new THREE.PointLight(0xffffff, 1);
  pointLight2.position.set(-10, -10, -5);
  scene.add(pointLight2);

  // ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // soft white light
  scene.add(ambientLight);

  return {
    scene,
    camera,
  };
}

function createEnvironment(environmentMaterial, renderer, scene) {
  const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter,
  });
  cubeRenderTarget.texture.type = THREE.HalfFloatType;

  const virtualScene = new THREE.Scene();
  scene.environment = cubeRenderTarget.texture;

  const cubeCamera = new THREE.CubeCamera(0, 300, cubeRenderTarget);
  scene.add(cubeCamera);

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 64),
    environmentMaterial
  );
  sphere.scale.setScalar(100);
  scene.add(sphere);

  sphere.visible = false;
  cubeCamera.position.set(0, 0, 0);
  cubeCamera.update(renderer, scene);

  sphere.visible = true;

  return cubeRenderTarget.texture;
}

function createTorusGeometry() {
  const torusKnotGeometry = new THREE.TorusKnotGeometry(1, 0.25, 256, 24, 1, 3);
  return torusKnotGeometry;
}

export { createScene, createTorusGeometry, createRenderer, createEnvironment };
