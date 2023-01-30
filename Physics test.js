//import Ammo from "ammo";
import * as THREE from "./node_modules/three/build/three.module.js";
import { RigidBody, updatePhysicsWorld, rigidBodies, initPhysicsWorld } from "./Physics World.js";
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136/examples/jsm/controls/OrbitControls.js';
import { createMaze, walls, goal } from "./Maze.js";


Ammo().then(main);
let physicsWorld;
let scene;
let camera;
let renderer;
let clock;
let controls;
let ball;
let tmpTransformation;
let ground;
const rotationSpeed = 0.05;
let dPressed = false,
aPressed = false,
wPressed = false,
sPressed = false;
function main() {
    initPhysicsWorld();
    initGraphicsWorld();
    tmpTransformation = new Ammo.btTransform();
    //rbCube.createBox(1, { x: 0, y: 3, z: 0 }, { x: 1, y: 1, z: 1 });
    ball = createSphere({ x: 0, y: 15, z: 0 }, 0.2);
    
    new RigidBody(ball, "sphere", 1);
    ground = createMaze();
    scene.add(ground);
    for (let i = 0; i < walls.length; i++) {
        new RigidBody(walls[i], "box", 0);
    }
    new RigidBody(ground, "ground", 0);
    //rbGround.createBox(0, { x: 0, y: -5, z: 0 }, { x: 20, y: 2, z: 20 });
    requestAnimationFrame(render);

    document.onkeydown = evt => {
        if (evt.key === 'd') {
            dPressed = true;
        }
        if (evt.key === 'a') {
            aPressed = true;
        }
        if (evt.key === 'w') {
            wPressed = true;
        }
        if (evt.key === 's') {
            sPressed = true;
        }
      }
      document.onkeyup = evt => {
        if (evt.key === 'd') {
            dPressed = false;
        }
        if (evt.key === 'a') {
            aPressed = false;
        }
        if (evt.key === 'w') {
            wPressed = false;
        }
        if (evt.key === 's') {
            sPressed = false;
        }
      }
}

function rotate() {
    if (dPressed) {
        //ground.rotation.x += rotationSpeed;
        ground.rotateX(rotationSpeed);
    }
    if (aPressed) {
        //ground.rotation.x -= rotationSpeed;
        ground.rotateX(-rotationSpeed);
    }
    if (sPressed) {
        //ground.rotation.z -= rotationSpeed;
        ground.rotateZ(rotationSpeed);
    }
    if (wPressed) {
        //ground.rotation.z += rotationSpeed;
        ground.rotateZ(-rotationSpeed);
    }
}

function win() {
    const vector = new THREE.Vector3();
    goal.getWorldPosition(vector);
    var dx = vector.x - ball.position.x;
    var dy = vector.y - ball.position.y;
    var dz = vector.z - ball.position.z;

    const distance = Math.sqrt( dx * dx + dy * dy + dz * dz );
    if (distance < 1) {
        alert("victory");
        goal.position.x = -100;
        goal.position.y = -100;
        goal.position.z = -100;
    }
}

function initGraphicsWorld() {
    clock = new THREE.Clock();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 20, 0);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
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
    updatePhysicsWorld(deltaTime, ground);
    renderer.render(scene, camera);
    controls.update();
    rotate();
    win();
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