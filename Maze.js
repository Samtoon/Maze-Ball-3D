import * as THREE from "./node_modules/three/build/three.module.js";
import values from "./MazeValues.json" assert {type: "json"};
import { addGroundShape, addWallShape } from "./Physics World.js";

const mazeMap = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
[1, 2, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 1, 1, 1, 0, 1, 1, 1, 1],
[1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
[1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
[1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
[1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
[1, 0, 1, 3, 1, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 1, 0, 1, 1],
[1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];
const mazeHeight = mazeMap.length;
const walls = [];
const mazeWidth = mazeMap[0].length;
const goalGeom = new THREE.CapsuleBufferGeometry(0.2, 0.2);
    const goalMaterial = new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff });
    const goal = new THREE.Mesh(goalGeom, goalMaterial);

function createMaze() {
    const mazeGeom = new THREE.BoxBufferGeometry(mazeWidth, 1, mazeHeight);
    addGroundShape({ x: mazeWidth, y: 1, z: mazeHeight });
    const mazeMaterial = new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff });
    const maze = new THREE.Mesh(mazeGeom, mazeMaterial);
    maze.add(goal);
    const wallGeom = new THREE.BoxBufferGeometry(1, 1, 1,);
    const wallTexture = new THREE.TextureLoader().load('/src/textures/crate.gif');
    const wallMaterial = new THREE.MeshBasicMaterial({ map: wallTexture });
    const startPoint = { x: 0, y: 0, z: 0 };

    for (let j = 0; j < mazeHeight; j++) {
        for (let i = 0; i < mazeWidth; i++) {
            switch (mazeMap[j][i]) {
                case values.start:
                    startPoint.x = i;
                    startPoint.y = 3;
                    startPoint.z = j;
                    break;
                case values.finish:
                    goal.position.x = (i - mazeWidth / 2) + 0.5;
                    goal.position.y = 1;
                    goal.position.z = (mazeHeight / 2 - j) - 0.5;
                    break;
                case values.wall:
                    const wall = new THREE.Mesh(wallGeom, wallMaterial);
                    maze.add(wall);
                    wall.position.x = (i - mazeWidth / 2) + 0.5;
                    wall.position.y = 1;
                    wall.position.z = (mazeHeight / 2 - j) - 0.5;
                    walls.push(wall);
                    addWallShape(wall.position);
                    console.log(`Position at i ${i} j ${j}: ${wall.position.x}, ${wall.position.y}, ${wall.position.z}`);
                    break;
                default:
                //console.log("ground");
            }
        }
    }
    maze.position.x = 0;
    maze.position.y = 0;
    maze.position.z = 0;
    return maze;
}

export { createMaze, mazeHeight, mazeWidth, walls, goal };