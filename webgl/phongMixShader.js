/**
 * This is a basic asynchronous shader loader for THREE.js.
 *
 * It uses the built-in THREE.js async loading capabilities to load shaders from files!
 *
 * `onProgress` and `onError` are standard TREE.js stuff. Look at
 * https://threejs.org/examples/webgl_loader_obj.html for an example.
 *
 * @param {String} vertex_url URL to the vertex shader code.
 * @param {String} fragment_url URL to fragment shader code
 * @param {function(String, String)} onLoad Callback function(vertex, fragment) that take as input the loaded vertex and fragment contents.
 * @param {function} onProgress Callback for the `onProgress` event.
 * @param {function} onError Callback for the `onError` event.
 */
function ShaderLoader(vertex_url, fragment_url, onLoad, onProgress, onError) {
    var vertex_loader = new THREE.XHRLoader(THREE.DefaultLoadingManager);
    vertex_loader.setResponseType("text");
    vertex_loader.load(
      vertex_url,
      function (vertex_text) {
        var fragment_loader = new THREE.XHRLoader(THREE.DefaultLoadingManager);
        fragment_loader.setResponseType("text");
        fragment_loader.load(fragment_url, function (fragment_text) {
          onLoad(vertex_text, fragment_text);
        });
      },
      onProgress,
      onError
    );
  }
  
  const WIDTH = window.innerWidth;
  const HEIGHT = window.innerHeight;
  const canvas = document.querySelector("#myCanvas");
  
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas, alpha: true });
  renderer.setSize(WIDTH, HEIGHT);
  renderer.setClearColor(0xffffff, 0);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);
  
  const scene = new THREE.Scene();
  
  const camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT);
  camera.position.z = 50;

  scene.add(camera);
  
  const torusKnotGeometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
  
  const uniforms = {
    u_firstColor: {
        type: "v3",
        value: new THREE.Vector3(1.0, 0.0, 0.0)
    },
    u_secondColor: {
        type: "v3",
        value: new THREE.Vector3(0.0, 0.0, 1.0)
    },
    u_ambientK: {
        type: "f",
        value: 1.0
    },
    u_diffuseK: {
        type: "f",
        value: 1.0
    },
    u_specularK: {
        type: "f",
        value: 1.0
    },
    u_shininess: {
        type: "f",
        value: 80.0
    },
    u_ambientColor: {
        type: "v3",
        value: new THREE.Vector3(0.75, 0.25, 0.6)
    },
    u_specularColor: {
        type: "v3",
        value: new THREE.Vector3(1.0, 1.0, 1.0)
    },
    u_lightPos: {
        type: "v3",
        value: new THREE.Vector3(1.0, 1.0, -1.0)
    }
  };
  
  // The main problem with async loading is to handle the async flow of the program.
  // This may be make easier with modern JS features such as Promises or async/await.
  //
  // But, for now, we stick to the classic callback style.
  //
  // Because we need the content of the shaders **BEFORE** we can instantiate the
  // material, we need to put everything that need the cube inside the onLoad callback.
  //
  // This can be done better with a bit of refactoring but I hope you get the idea.
  ShaderLoader(
    "shaders/phongMix.vert",
    "shaders/phongMix.frag",
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
  