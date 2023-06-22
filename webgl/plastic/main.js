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
  u_lamina_color: {
    type: "v3",
    value: new THREE.Color('white').convertSRGBToLinear()
  },
  u_lamina_alpha: {
    type: "f",
    value: 1.0
  },
  u_Color1_color: {
    type: "v3",
    value: new THREE.Color('#f0aed2').convertSRGBToLinear(),
  },
  u_Color1_alpha: {
    type: "f",
    value: 1.0
  },
  u_Depth1_alpha: {
    type: "f",
    value: 0.5
  },
  u_Depth1_near: {
    type: "f",
    value: 0.0
  },
  u_Depth1_far: {
    type: "f",
    value: 300.0
  },
  u_Depth1_origin: {
    type: "v3",
    value: new THREE.Vector3(100, 100, 100),
  },
  u_Depth1_colorA: {
    type: "v3",
    value: new THREE.Color('blue').convertSRGBToLinear(),
  },
  u_Depth1_colorB: {
    type: "v3",
    value: new THREE.Color('#00aaff').convertSRGBToLinear(),
  },
  u_Noise1_offset: {
    type: "v3",
    value: new THREE.Vector3(0, 0, 0),
  },
  u_Noise1_scale: {
    type: "f",
    value: 0.5
  },
  u_Noise1_colorA: {
    type: "v3",
    value: new THREE.Color('#666666').convertSRGBToLinear(),
  },
  u_Noise1_colorB: {
    type: "v3",
    value: new THREE.Color('#666666').convertSRGBToLinear(),
  },
  u_Noise1_colorC: {
    type: "v3",
    value: new THREE.Color('#ffffff').convertSRGBToLinear(),
  },
  u_Noise1_colorD: {
    type: "v3",
    value: new THREE.Color('#ffffff').convertSRGBToLinear(),
  },
  u_Noise1_alpha: {
    type: "f",
    value: 1.0
  },
}

ShaderLoader(
  "shaders/plastic.vert",
  "shaders/plastic.frag",
  function (vertex, fragment) {
    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      extensions: {
        derivatives: true,
      },
      side: THREE.BackSide,
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
