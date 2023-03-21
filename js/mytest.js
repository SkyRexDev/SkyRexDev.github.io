let renderer, scene, camera;
let cameraControls;
let whiteRook1, whiteRook2, blackRook1, blackRook2;

const material = new THREE.MeshBasicMaterial({
  color: "yellow",
  wireframe: true,
});
const blackMaterial = new THREE.MeshPhongMaterial({
  color: 0x111111,
  shininess: 100,
  specular: 0x111111,
});
const whiteMaterial = new THREE.MeshPhongMaterial({
  color: "white",
  shininess: 100,
  specular: 0x111111,
});

const lightMaterial = new THREE.MeshPhongMaterial({
  color: 0xc5c5c5,
  shininess: 100,
  specular: 0x111111,
});
const darkMaterial = new THREE.MeshPhongMaterial({
  color: 0x00000,
  shininess: 100,
  specular: 0x111111,
});

init();

function init() {
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(new THREE.Color(0x727e8a));
  renderer.outputEncoding = THREE.sRGBEncoding;
  document.getElementById("container").appendChild(renderer.domElement);

  scene = new THREE.Scene();

  var aspectRatio = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(50, aspectRatio, 0.1, 100);
  camera.position.set(1, 1.5, 2);
  camera.lookAt(0, 0, 0);

  cameraControls = new THREE.OrbitControls(camera, renderer.domElement);

  window.addEventListener("resize", updateAspectRatio);
  loadPieces();
  generateBoard();
  light();
  render();
}

function loadPieces() {
  //Rooks
  loadPiece(0, 0, blackMaterial, blackRook1);
  loadPiece(0, 7, blackMaterial, blackRook2);
  loadPiece(7, 0, whiteMaterial, whiteRook1);
  loadPiece(7, 7, whiteMaterial, whiteRook2);
}

function loadPiece(x, z, color, variable) {

  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const box = new THREE.Mesh(boxGeometry, material);
  box.position.x = 0;

  var model = new THREE.Object3D();
  const manager = new THREE.LoadingManager();
  manager.onLoad = function () {
    box.add(model);
    let piece = new THREE.Object3D();
    piece.position.y = 0.65;
    piece.position.x = x;
    piece.position.z = z;
    piece.add(box);
    scene.add(piece);
  };

  const glloader = new THREE.GLTFLoader(manager);
  glloader.load("models/rook/scene.gltf", function (gltf) {
    model = gltf.scene;
    model.position.y = -0.5;
    model.rotation.y = Math.PI / 2;
    model.scale.set(1, 1, 1);

    const textureLoader = new THREE.TextureLoader(manager);
    textureLoader.load("models/textures/Plastic003_2K_Normal.jpeg", function (texture) {
      model.traverse(function (object) {
        if (object.isMesh) {
          object.material = color;
        }
      });
    });
  }, undefined, function (error) {
    console.error(error);
  });
}

function updateAspectRatio() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

function light() {
  // var light;
  // light = new THREE.AmbientLight(0xfffffff, 1);
  // scene.add(light);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(0, 1, 0);
  scene.add(directionalLight);
}

function generateBoard() {
  var board, cubeGeo;
  cubeGeo = new THREE.BoxGeometry(1, 0.2, 1);
  board = new THREE.Group();

  for (let x = 0; x < 8; x++) {
    for (let z = 0; z < 8; z++) {
      if (z % 2 == false) {
        var cube;
        cube = new THREE.Mesh(
          cubeGeo,
          x % 2 == false ? lightMaterial : darkMaterial
        );
      } else {
        cube = new THREE.Mesh(
          cubeGeo,
          x % 2 == false ? darkMaterial : lightMaterial
        );
      }
      cube.position.set(x, 0, z);
      cameraControls.target.set(x / 2, 0, z / 2);
      board.add(cube);
    }
  }
  scene.add(board);
}

function update() {
  // whiteRook1.rotation.y += 0.01;
}

function render() {
  requestAnimationFrame(render);
  update();
  renderer.render(scene, camera);
}
