import * as THREE from "./node_modules/three/build/three.module.js";
import values from "./MazeValues.json" assert {type: "json"};

const mazeMap = [[1, 1, 1 ,1 ,1 ,1, 1, 1, 1, 1],
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
const mazeWidth = mazeMap[0].length;

const mazeGeom = new THREE.BoxBufferGeometry(mazeWidth, mazeHeight, 1);
const mazeMaterial = new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff });
const maze = new THREE.Mesh(mazeGeom, mazeMaterial);
const goalGeom = new THREE.CapsuleBufferGeometry(0.2, 0.2);
const goalMaterial = new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff });
const goal = new THREE.Mesh(goalGeom, goalMaterial);
maze.add(goal);
const wallGeom = new THREE.BoxBufferGeometry(1, 1, 1,);
const wallMaterial = new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff });
const startPoint = {x: 0, y: 0, z: 0};

for (let j = 0; j < mazeHeight; j++) {
    for (let i = 0; i < mazeWidth; i++) {
        switch (mazeMap[j][i]) {
            case values.start:
                startPoint.x = i;
                startPoint.y = j;
                startPoint.z = 3;
                break;
            case values.finish:
                goal.position.x = (i - mazeWidth/2) + 0.5;
                goal.position.y = (mazeHeight/2 - j) - 0.5;
                goal.position.z = 1;
                break;
            case values.wall:
                const wall = new THREE.Mesh(wallGeom, wallMaterial);
                maze.add(wall);
                wall.position.x = (i - mazeWidth/2) + 0.5;
                wall.position.y = (mazeHeight/2 - j) - 0.5;
                wall.position.z = 1;
                console.log(`Position at i ${i} j ${j}: ${wall.position.x}, ${wall.position.y}, ${wall.position.z}`);
                break;
            default:
                //console.log("ground");
        }
    }
}

export default maze;