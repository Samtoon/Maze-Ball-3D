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

  cube = createCube();

  // Sphere
  sphere = new MirrorSphere(scene);

  sphere.position = { x: 5, y: 0, z: 0 };

  const light = createLight();

  const orbitControls = new OrbitControls(camera, renderer.domElement);

  scene.add(light);
  scene.add(cube);

  renderer.render(scene, camera);
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
  if (evt.key === 'd') {
    sphere.position.x += 0.1;
  }
  if (evt.key === 'a') {
    sphere.position.x -= 0.1;
  }
  if (evt.key === 'w') {
    sphere.position.y += 0.1;
  }
  if (evt.key === 's') {
    sphere.position.y -= 0.1;
  }
}