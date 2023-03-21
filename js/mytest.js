// Import necessary modules
import * as THREE from 'three';
import { GLTFLoader } from "GLTFLoader"
import { OrbitControls } from "OrbitControls"

const blackMaterial = new THREE.MeshPhongMaterial({
  color: 0x1f1e1e,
  shininess: 100, // high shininess
  specular: 0x111111, // dark specular color
});
const whiteMaterial = new THREE.MeshPhongMaterial({
  color: "white",
  shininess: 100, // high shininess
  specular: 0x111111, // dark specular color
});

const tiles = [];
const scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
renderer.setClearColor(new THREE.Color(0x727e8a));
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.z = 25;
camera.position.y = 10;
camera.position.x = -10;
controls.update();

const chessboard = generateBoard();
scene.add(chessboard);

const loader = new GLTFLoader();
const chessPiecesGroup = new THREE.Group();
scene.add(chessPiecesGroup);

loadModel("models/rook/scene.gltf", new THREE.Vector3(0, 0, 0), new THREE.Euler(0, 0, 0), true);
loadModel("models/knight/scene.gltf", new THREE.Vector3(1, 0, 0), new THREE.Euler(0, 0, 0), true);
loadModel("models/bishop/scene.gltf", new THREE.Vector3(2, 0, 0), new THREE.Euler(0, 0, 0), true);
loadModel("models/queen/scene.gltf", new THREE.Vector3(3, 0, 0), new THREE.Euler(0, 0, 0), true);
loadModel("models/king/scene.gltf", new THREE.Vector3(4, 0, 0), new THREE.Euler(0, 0, 0), true);
loadModel("models/bishop/scene.gltf", new THREE.Vector3(5, 0, 0), new THREE.Euler(0, 0, 0), true);
loadModel("models/knight/scene.gltf", new THREE.Vector3(6, 0, 0), new THREE.Euler(0, 0, 0), true);
loadModel("models/rook/scene.gltf", new THREE.Vector3(7, 0, 0), new THREE.Euler(0, 0, 0), true);

for (let x = 0; x < 8; x++) {
  loadModel("models/pawn/scene.gltf", new THREE.Vector3(x, 0, 1), new THREE.Euler(0, 0, 0), true);
}

loadModel("models/rook/scene.gltf", new THREE.Vector3(0, 0, 7), new THREE.Euler(0, 0, 0), false);
loadModel("models/knight/scene.gltf", new THREE.Vector3(1, 0, 7), new THREE.Euler(0, 3, 0), false);
loadModel("models/bishop/scene.gltf", new THREE.Vector3(2, 0, 7), new THREE.Euler(0, 0, 0), false);
loadModel("models/queen/scene.gltf", new THREE.Vector3(3, 0, 7), new THREE.Euler(0, 0, 0), false);
loadModel("models/king/scene.gltf", new THREE.Vector3(4, 0, 7), new THREE.Euler(0, 0, 0), false);
loadModel("models/bishop/scene.gltf", new THREE.Vector3(5, 0, 7), new THREE.Euler(0, 0, 0), false);
loadModel("models/knight/scene.gltf", new THREE.Vector3(6, 0, 7), new THREE.Euler(0, 3, 0), false);
loadModel("models/rook/scene.gltf", new THREE.Vector3(7, 0, 7), new THREE.Euler(0, 0, 0), false);

for (let x = 0; x < 8; x++) {
  loadModel("models/pawn/scene.gltf", new THREE.Vector3(x, 0, 6), new THREE.Euler(0, 0, 0), false);
}

function loadModel(modelPath, position, rotation, isWhite) {
  return new Promise((resolve) => {
    loader.load(modelPath, (gltf) => {
      const model = gltf.scene;
      model.position.copy(position);
      model.rotation.copy(rotation);
      model.scale.set(1, 1, 1);
      model.isChessPiece = true;
      model.traverse(function (child) {
        if (child.isMesh) {
          child.material = isWhite ? whiteMaterial : blackMaterial;
        }
      });
      chessPiecesGroup.add(model);
      resolve(model);
    });
  });
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let selectedPiece = null;

function onMouseDown(event) {
  event.preventDefault();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(chessPiecesGroup.children, true);

  if (intersects.length > 0) {
    let rootObject = intersects[0].object;
    while (rootObject.parent !== chessPiecesGroup && rootObject.parent !== null) {
      rootObject = rootObject.parent;
    }
    if (rootObject.isChessPiece) { // Add this condition
      selectedPiece = rootObject;
      controls.enabled = false;
    }
  }
}

function onMouseMove(event) {
  console.log("Mouse moved");
  console.log("Tiles:", tiles);
  if (selectedPiece) {
    console.log(selectedPiece.position);
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(tiles);

    if (intersects.length > 0) {
      const { x, y, z } = intersects[0].point;
      console.log("Intersected tile:", x, y, z);
      const newX = Math.round(x);
      const newY = selectedPiece.position.y;
      const newZ = Math.round(z);

      selectedPiece.position.set(newX, newY, newZ);
    }
  }
}

function onMouseUp(event) {
  event.preventDefault();

  if (selectedPiece) {
    selectedPiece = null;
    controls.enabled = true;
  }
}


function generateBoard() {
  var board, cubeGeo, lightMaterial, blackMaterial;

  lightMaterial = new THREE.MeshPhongMaterial({
    color: 0xc5c5c5,
    shininess: 100,
    specular: 0x111111,
  });
  blackMaterial = new THREE.MeshPhongMaterial({
    color: 0x00000,
    shininess: 100,
    specular: 0x111111,
  });
  cubeGeo = new THREE.BoxGeometry(1, 0.2, 1);
  board = new THREE.Group();

  for (let x = 0; x < 8; x++) {
    for (let z = 0; z < 8; z++) {
      if (z % 2 == false) {
        var cube;
        cube = new THREE.Mesh(
          cubeGeo,
          x % 2 == false ? lightMaterial : blackMaterial
        );
      } else {
        cube = new THREE.Mesh(
          cubeGeo,
          x % 2 == false ? blackMaterial : lightMaterial
        );
      }
      cube.position.set(x, 0, z);
      controls.target.set(x / 2, 0, z / 2);
      board.add(cube);
      tiles.push(cube);
    }
  }
  return board;
}

document.addEventListener('mousedown', onMouseDown, false);
document.addEventListener('mouseup', onMouseUp, false);
document.addEventListener('mousemove', onMouseMove, false);
window.addEventListener("resize", updateAspectRatio);

function updateAspectRatio() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();