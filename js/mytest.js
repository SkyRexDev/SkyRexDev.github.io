import * as THREE from "three"
import {OrbitControls} from "OrbitControls"
import {DragControls} from "DragControls"
import {GLTFLoader} from "GLTFLoader"


let renderer, scene, camera;
let cameraControls, dragControls;
let whiteRook;

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

  cameraControls = new OrbitControls(camera, renderer.domElement);
  

  window.addEventListener("resize", updateAspectRatio);
  loadScene();
  generateBoard();
  light();
  drag();
  render();
}

function drag() {
  dragControls = new DragControls([whiteRook], camera, renderer.domElement);

  dragControls.addEventListener('dragstart', function (event) {
    orbitControls.enabled = false
    event.object.material.opacity = 0.33
  });
  dragControls.addEventListener('dragend', function (event) {
    orbitControls.enabled = true
    event.object.material.opacity = 1
  });
}

function loadScene() {
  const material = new THREE.MeshBasicMaterial({
    color: "yellow",
    wireframe: true,
  });
  const blackMaterial = new THREE.MeshPhongMaterial({
    color: "black",
  });
  const whiteMaterial = new THREE.MeshPhongMaterial({
    color: "white",
    shininess: 100, // high shininess
    specular: 0x111111, // dark specular color
  });
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const box = new THREE.Mesh(boxGeometry, material);
  box.position.x = 0;

  const glloader = new GLTFLoader();

  glloader.load(
    "models/rook/scene.gltf",
    function (gltf) {
      gltf.scene.position.y = -0.5;
      gltf.scene.rotation.y = Math.PI / 2;
      gltf.scene.scale.set(1, 1, 1);
      gltf.scene.traverse(function (child) {
        if (child.isMesh) {
          if (child.material.map) {
            child.material.map = blackMaterial;
            child.material.map.needsUpdate = true;
          }
        }
      });
      box.add(gltf.scene);
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );

  whiteRook = new THREE.Object3D();
  whiteRook.position.y = 0.65;
  scene.add(whiteRook);
  whiteRook.add(box);
}

function updateAspectRatio() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

function light() {
  var light;
  light = new THREE.AmbientLight(0xfffffff, 1);
  scene.add(light);
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
      cameraControls.target.set(x / 2, 0, z / 2);
      board.add(cube);
    }
  }
  scene.add(board);
}

function update() {
  // whiteRook.rotation.y += 0;
}

function render() {
  requestAnimationFrame(render);
  update();
  renderer.render(scene, camera);
}
