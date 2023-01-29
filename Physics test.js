//import Ammo from "ammo";
import * as THREE from "./node_modules/three/build/three.module.js";
import { RigidBody, updatePhysicsWorld, rigidBodies, initPhysicsWorld } from "./Physics World.js";
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136/examples/jsm/controls/OrbitControls.js';

console.log("oh no");
Ammo().then(main);
let physicsWorld;
let scene;
let camera;
let renderer;
let clock;
let controls;
let tmpTransformation;
function main() {
    initPhysicsWorld();
    initGraphicsWorld();
    tmpTransformation = new Ammo.btTransform();
    const cube = createBox({ x: 0, y: 3, z: 0 }, { x: 1, y: 1, z: 1 });
    new RigidBody(cube, "box", 1);
    //rbCube.createBox(1, { x: 0, y: 3, z: 0 }, { x: 1, y: 1, z: 1 });
    const ground = createBox({ x: 0, y: -5, z: 0 }, { x: 20, y: 2, z: 20 });
    new RigidBody(ground, "ground", 0);
    const ball = createSphere({ x: 0, y: 5, z: 0 }, 1);
    new RigidBody(ball, "sphere", 1);
    const ball2 = createSphere({ x: 0, y: 7, z: 0 }, 1);
    new RigidBody(ball2, "sphere", 1);
    //rbGround.createBox(0, { x: 0, y: -5, z: 0 }, { x: 20, y: 2, z: 20 });
    requestAnimationFrame(render);
}

function initGraphicsWorld() {
    clock = new THREE.Clock();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(-25, 20, -25);
    camera.lookAt(new THREE.Vector3(0, 7, 0));
    const canvas = document.querySelector('#canvas'); //Get document's canvas
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    const ambientLight = new THREE.AmbientLight(0xcccccc, 1);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 2, 0);
    scene.add(directionalLight);
    const helper = new THREE.CameraHelper(camera);
    scene.add(helper);
    renderer.render(scene, camera);
    controls = new OrbitControls(camera, renderer.domElement);
}

function render() {
    const deltaTime = clock.getDelta();
    updatePhysicsWorld(deltaTime);
    renderer.render(scene, camera);
    controls.update();
    requestAnimationFrame(render);

}

function createBox(pos, size) {
    const newcube = new THREE.Mesh(new THREE.BoxBufferGeometry(size.x, size.y, size.z),
        new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff }));
    newcube.position.set(pos.x, pos.y, pos.z);
    newcube.castShadow = true;
    newcube.receiveShadow = true;
    console.log(newcube.castShadow);
    scene.add(newcube);
    return newcube;
}

function createSphere(pos, radius) {
    const newSphere = new THREE.Mesh(new THREE.SphereBufferGeometry(radius),
        new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff }));
    newSphere.position.set(pos.x, pos.y, pos.z);
    newSphere.castShadow = true;
    newSphere.receiveShadow = true;
    scene.add(newSphere);
    return newSphere;
}