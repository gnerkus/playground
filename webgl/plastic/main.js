import * as THREE from "three";
import ShaderLoader from "../modules/shaderLoader.js";
import {
  createScene,
  createRenderer,
  createTorusGeometry,
  createEnvironment,
} from "../modules/customEnvironmentScene.js";

const renderer = createRenderer();
const { scene, camera } = createScene();
const torusKnotGeometry = createTorusGeometry();

const uniforms = {
  u_lamina_color: {
    type: "v3",
    value: new THREE.Color("#ffffff").convertSRGBToLinear(),
  },
  u_lamina_alpha: {
    type: "f",
    value: 1.0,
  },
  u_Color1_color: {
    type: "v3",
    value: new THREE.Color("blue").convertSRGBToLinear(),
  },
  u_Color1_alpha: {
    type: "f",
    value: 1.0,
  },
  u_Depth1_alpha: {
    type: "f",
    value: 0.5,
  },
  u_Depth1_near: {
    type: "f",
    value: 0.0,
  },
  u_Depth1_far: {
    type: "f",
    value: 300.0,
  },
  u_Depth1_origin: {
    type: "v3",
    value: new THREE.Vector3(100, 100, 100),
  },
  u_Depth1_colorA: {
    type: "v3",
    value: new THREE.Color("#00ffff").convertSRGBToLinear(),
  },
  u_Depth1_colorB: {
    type: "v3",
    value: new THREE.Color("#ff8f00").convertSRGBToLinear(),
  },
  u_Noise1_offset: {
    type: "v3",
    value: new THREE.Vector3(0, 0, 0),
  },
  u_Noise1_scale: {
    type: "f",
    value: 0.5,
  },
  u_Noise1_colorA: {
    type: "v3",
    value: new THREE.Color("#666666").convertSRGBToLinear(),
  },
  u_Noise1_colorB: {
    type: "v3",
    value: new THREE.Color("#666666").convertSRGBToLinear(),
  },
  u_Noise1_colorC: {
    type: "v3",
    value: new THREE.Color("#ffffff").convertSRGBToLinear(),
  },
  u_Noise1_colorD: {
    type: "v3",
    value: new THREE.Color("#ffffff").convertSRGBToLinear(),
  },
  u_Noise1_alpha: {
    type: "f",
    value: 1.0,
  },
};

ShaderLoader(
  "plastic/plastic.vert",
  "plastic/plastic.frag",
  function (vertex, fragment) {
    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: vertex,
      fragmentShader: fragment,
      side: THREE.BackSide,
    });

    const envMap = createEnvironment(shaderMaterial, renderer, scene);

    const torusMaterial = new THREE.MeshStandardMaterial( {
      roughness: 0.1,
      metalness: 0.925,
      envMap: envMap,
    } );

    const torusKnot = new THREE.Mesh(torusKnotGeometry, torusMaterial);
    torusKnot.castShadow = true;
    torusKnot.receiveShadow = true;
    scene.add(torusKnot);

    function render() {
      requestAnimationFrame(render);
      renderer.render(scene, camera);
    }

    render();
  }
);
