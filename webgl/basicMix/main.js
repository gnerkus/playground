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
  u_firstColor: {
      type: "v3",
      value: new THREE.Vector3(1.0, 0.0, 0.0)
  },
  u_secondColor: {
      type: "v3",
      value: new THREE.Vector3(0.0, 0.0, 1.0)
  },
  u_count: {
      type: "f",
      value: 1.0
  },
  u_index: {
      type: "f",
      value: 0.0
  }
};

ShaderLoader(
  "shaders/mix.vert",
  "shaders/mix.frag",
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