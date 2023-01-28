import {
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  BoxGeometry,
  MeshPhongMaterial,
  Mesh,
  DirectionalLight
} from "/node_modules/three/build/three.module.js";

function createRenderer() {
  //Get document's canvas
  const canvas = document.querySelector('#canvas');
  const renderer = new WebGLRenderer({ canvas: canvas });
  renderer.setSize(window.innerWidth, window.innerHeight);

  return renderer
}

function createCamera(fov = 75, near = 0.1, far = 5) {
  const aspect = window.innerWidth / window.innerHeight;
  const camera = new PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2;
  return camera
}

function createScene() {
  return new Scene()
}

function createCube(boxWidth = 1, boxHeight = 1, boxDepth = 1, materialConfig = { color: 0x44aa88 }) {
  const geometry = new BoxGeometry(boxWidth, boxHeight, boxDepth);
  const material = new MeshPhongMaterial(materialConfig);

  //Meshes need both a geometry and a material
  return new Mesh(geometry, material);
}

function createLight(color = 0xFFFFFF, intensity = 1, posX = -1, posY = 2, posZ = 4) {
  const light = new DirectionalLight(color, intensity);
  light.position.set(posX, posY, posZ);

  return light
}

export { createCamera, createCube, createLight, createRenderer, createScene }