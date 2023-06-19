import ShaderLoader from "../modules/shaderLoader.js";
import {
  createScene,
  createTorusMesh,
  createRenderer,
} from "../modules/torusScene.js";

const renderer = createRenderer();
const scene = createScene();
const torusKnotGeometry = createTorusMesh();

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

ShaderLoader(
  "shaders/rimLight.vert",
  "shaders/rimLight.frag",
  function (vertex, fragment) {
    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      extensions: {
        derivatives: true,
      },
    });

    const torusKnot = new THREE.Mesh(torusKnotGeometry, shaderMaterial);
    scene.add(torusKnot);
    torusKnot.rotation.set(0.4, 0.2, 0);

    function render() {
      requestAnimationFrame(render);
      renderer.render(scene, camera);
    }
    render();
  }
);
