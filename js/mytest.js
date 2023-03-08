import * as THREE from "https://unpkg.com/three@0.126.1/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";
import { DragControls } from "https://cdn.jsdelivr.net/npm/three@0.115/examples/jsm/controls/DragControls.js";

let renderer, scene, camera;
let cameraControls;
let angulo = -0.01;

let esferaCubo;

init();
loadScene();
render();

function init() {
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(new THREE.Color(0xFFFFFF));
  document.getElementById('container').appendChild(renderer.domElement);

  scene = new THREE.Scene();

  var aspectRatio = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(50, aspectRatio, 0.1, 100);
  camera.position.set(1, 1.5, 2);
  camera.lookAt(0, 0, 0);

  cameraControls = new OrbitControls(camera, renderer.domElement);
  cameraControls.target.set(0, 0, 0);

  window.addEventListener('resize', updateAspectRatio);
}

function loadScene() {
  const material = new THREE.MeshBasicMaterial( { color: 'yellow', wireframe: true } );
  const geoEsfera = new THREE.SphereGeometry(1, 20, 20);
  const esfera = new THREE.Mesh(geoEsfera, material);
  esfera.position.x = 1;

  const glloader = new GLTFLoader();

  glloader.load('models/radiator/scene.gltf', function (gltf) {
    gltf.scene.position.y = 1;
    gltf.scene.rotation.y = -Math.PI / 2;
    esfera.add(gltf.scene);

  }, undefined, function (error) {

    console.error(error);

  });

  esferaCubo = new THREE.Object3D();
  esferaCubo.position.y = 1.5;
  scene.add(esferaCubo);
  esferaCubo.add(esfera);
  scene.add(new THREE.AxesHelper(1));

}
function updateAspectRatio() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

function update() {
  // Cambios para actualizar la camara segun mvto del raton
  cameraControls.update();

  // Movimiento propio del cubo
/*   cubo.rotation.y += angulo;
  cubo.rotation.x += angulo / 2; */
}

function render() {
  requestAnimationFrame(render);
  update();
  renderer.render(scene, camera);
}

