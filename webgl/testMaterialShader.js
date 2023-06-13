const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(WIDTH, HEIGHT);
renderer.setClearColor(0xdddddd, 1);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT);
camera.position.z = 50;
scene.add(camera);

const torusKnotGeometry = new THREE.TorusKnotGeometry( 10, 3, 100, 16 );

const vertexShader = () => {
    return `
    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x+10.0, position.y, position.z+5.0, 1.0);
    }
    `
}

const fragmentShader = () => {
    return `
    void main() {
        gl_FragColor = vec4(0.0, 0.58, 0.86, 1.0);
    }
    `
}

const shaderMaterial = new THREE.ShaderMaterial({
  vertexShader: vertexShader(),
  fragmentShader: fragmentShader(),
});

const torusKnot = new THREE.Mesh(torusKnotGeometry, shaderMaterial);
scene.add(torusKnot);
torusKnot.rotation.set(0.4, 0.2, 0);

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
render();
