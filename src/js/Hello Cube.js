import {
  createScene,
  createCamera,
  createRenderer,
  createCube,
  createLight,
  createBgCube
} from "/src/js/initialize.js";

import * as THREE from "/node_modules/three/build/three.module.js";

import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136/examples/jsm/controls/OrbitControls.js';

let renderer, scene, camera, cube, sphere, sphere2, mirrorSphereCamera;

function init() {
  scene = createScene();
  camera = createCamera({ x: 7, y: 0, z: 5 }, 75, 0.1, 100);
  renderer = createRenderer();

  const bgCube = createBgCube();

  scene.background = bgCube;

  renderer.render(scene, camera);

  cube = createCube();

  // Sphere
  const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(1024);
  mirrorSphereCamera = new THREE.CubeCamera(0.05, 50, cubeRenderTarget);
  scene.add(mirrorSphereCamera);
  const mirrorSphereMaterial = new THREE.MeshBasicMaterial({ envMap: cubeRenderTarget.texture });

  const geometry = new THREE.IcosahedronGeometry(2, 10);
  const sphereMaterial = new THREE.MeshLambertMaterial({ envMap: bgCube });
  sphere = new THREE.Mesh(geometry, mirrorSphereMaterial);

  const geometry2 = new THREE.IcosahedronGeometry(2, 10);
  const material = new THREE.MeshPhongMaterial({ color: 0x00FFFF });
  sphere2 = new THREE.Mesh(geometry2, material);

  sphere2.material.transparent = true
  sphere2.material.opacity = 0.5

  sphere.position.x = 5;

  const light = createLight();

  const orbitControls = new OrbitControls(camera, renderer.domElement);

  scene.add(sphere);
  scene.add(sphere2);
  scene.add(light);
  scene.add(cube);
}

function animate(time) {
  time *= 0.001;
  cube.rotation.x = time;
  cube.rotation.y = time;

  sphere2.position.x = sphere.position.x;
  sphere2.position.y = sphere.position.y;
  sphere2.position.z = sphere.position.z;

  sphere.getWorldPosition(mirrorSphereCamera.position);
  mirrorSphereCamera.update(renderer, scene);

  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}

init();
animate();

document.onkeydown = evt => {
  console.log(evt.key);
}