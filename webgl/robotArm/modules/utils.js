import * as THREE from "three";
const fileLoader = new THREE.FileLoader();

export function loadFile(filePath) {
  return new Promise((resolve) => {
    fileLoader.load(filePath, (data) => {
      resolve(data);
    });
  });
}
