import {
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  CubeTextureLoader,
  TextureLoader,
  BoxGeometry,
  MeshBasicMaterial,
  MeshPhongMaterial,
  Mesh,
  DirectionalLight
} from "/node_modules/three/build/three.module.js";

function createRenderer() {
  //Get document's canvas.
  const canvas = document.querySelector('#canvas');
  const renderer = new WebGLRenderer({ canvas: canvas });
  renderer.setSize(window.innerWidth, window.innerHeight);

  return renderer
}

function createCamera(position = { x: 0, y: 0, z: 0 }, fov = 75, near = 0.1, far = 5) {
  const aspect = window.innerWidth / window.innerHeight;
  const camera = new PerspectiveCamera(fov, aspect, near, far);
  camera.position.x = position.x;
  camera.position.y = position.y;
  camera.position.z = position.z;
  return camera
}

function createScene() {
  return new Scene()
}

function createBgCube() {
  // Textures for the bg cube.
  const textures = [
    '/src/textures/cubemap/posx.jpg',
    '/src/textures/cubemap/negx.jpg',
    '/src/textures/cubemap/posy.jpg',
    '/src/textures/cubemap/negy.jpg',
    '/src/textures/cubemap/posz.jpg',
    '/src/textures/cubemap/negz.jpg'
  ];

  // const textures = [
  //   'https://assets.codepen.io/911796/px.jpeg',
  //   'https://assets.codepen.io/911796/nx.jpeg',
  //   'https://assets.codepen.io/911796/py.jpeg',
  //   'https://assets.codepen.io/911796/ny.jpeg',
  //   'https://assets.codepen.io/911796/pz.jpeg',
  //   'https://assets.codepen.io/911796/nz.jpeg'
  // ];

  const cubeLoader = new CubeTextureLoader();
  const cubeTexture = cubeLoader.load(textures);

  return cubeTexture
}

function createCube(boxWidth = 1, boxHeight = 1, boxDepth = 1, materialConfig = { color: 0x44aa88 }) {
  const geometry = new BoxGeometry(boxWidth, boxHeight, boxDepth);
  const material = new MeshPhongMaterial(materialConfig);
  const texture = new TextureLoader().load('/src/textures/crate.gif');
  const textMaterial = new MeshBasicMaterial({ map: texture });

  //Meshes need both a geometry and a material.
  return new Mesh(geometry, textMaterial);
}

function createSphere() {

}

function createLight(color = 0xFFFFFF, intensity = 1, posX = -1, posY = 2, posZ = 4) {
  const light = new DirectionalLight(color, intensity);
  light.position.set(posX, posY, posZ);

  return light
}

export { createCamera, createCube, createLight, createRenderer, createScene, createBgCube }