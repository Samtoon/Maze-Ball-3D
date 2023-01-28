import {
  createScene,
  createCamera,
  createRenderer,
  createCube,
  createLight
} from "/src/js/initialize.js"

let renderer, scene, camera, cube

function init() {
  scene = createScene();
  camera = createCamera();
  renderer = createRenderer();

  renderer.render(scene, camera);

  cube = createCube();
  const light = createLight();

  scene.add(light);
  scene.add(cube);
}

function animate(time) {
  time *= 0.001;
  cube.rotation.x = time;
  cube.rotation.y = time;
  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}

init();
animate();