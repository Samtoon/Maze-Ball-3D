import {
  createScene,
  createCamera,
  createRenderer,
  createCube,
  createLight,
  createBgCube
} from "/src/js/initialize.js";

import MirrorSphere from "/src/js/MirrorSphere.js";

import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136/examples/jsm/controls/OrbitControls.js';

let renderer, scene, camera, cube, sphere;

function init() {
  scene = createScene();
  camera = createCamera({ x: 7, y: 0, z: 5 }, 75, 0.1, 100);
  renderer = createRenderer();

  const bgCube = createBgCube();

  scene.background = bgCube;

  renderer.render(scene, camera);

  cube = createCube();

  // Sphere
  sphere = new MirrorSphere(scene);

  const light = createLight();

  const orbitControls = new OrbitControls(camera, renderer.domElement);

  scene.add(light);
  scene.add(cube);

  console.log(sphere);
}

function animate(time) {
  time *= 0.001;
  cube.rotation.x = time;
  cube.rotation.y = time;

  sphere.update(renderer, scene);

  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}

init();
animate();

document.onkeydown = evt => {
  console.log(evt.key);
}