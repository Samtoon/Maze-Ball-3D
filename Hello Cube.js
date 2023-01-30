import maze from "./Maze.js";
import * as THREE from "./node_modules/three/build/three.module.js";
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136/examples/jsm/controls/OrbitControls.js';


console.log("hola");


const canvas = document.querySelector('#canvas'); //Get document's canvas
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
const camera = createCamera();
camera.position.z = 10;
const scene = new THREE.Scene();
const geometry = createBox();
const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 });
const cube = maze //Meshes need both a geometry and a material
cube.castShadow = true;
cube.receiveShadow = true;
const light = createLight();
light.castShadow = true;
light.position.set(-1, 2, 4);
scene.add(light);
scene.add(cube);
const controls = new OrbitControls(camera, renderer.domElement);
requestAnimationFrame(render); //Animate cube

function render(time) {
    time *= 0.001;
    //cube.rotation.x = time;
    //cube.rotation.y = time;
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

function createCamera() {
    const fov = 75;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 1000;
    return new THREE.PerspectiveCamera(fov, aspect, near, far);
}

function createBox() {
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    return new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
}

function createLight() {
    const color = 0xFFFFFF;
    const intensity = 1;
    return new THREE.DirectionalLight(color, intensity);
}
