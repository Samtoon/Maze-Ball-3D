import * as THREE from "./node_modules/three/build/three.module.js";
let physicsWorld;
const rigidBodies = [];
const kinematicBodies = [];
let defaultBoxShape;
let defaultSphereShape;
let defaultGroundShape;
let defaultMazeShape;
let tmpTransformation;
let ground;

function initPhysicsWorld() {
    console.log("called");
    tmpTransformation = new Ammo.btTransform();
    defaultSphereShape = new Ammo.btSphereShape(0.2);
    defaultBoxShape = new Ammo.btBoxShape(new Ammo.btVector3(0.5, 0.5, 0.5));
    defaultGroundShape = new Ammo.btBoxShape(new Ammo.btVector3(20 * 0.5, 2 * 0.5, 20 * 0.5));
    defaultBoxShape.setMargin(0.05);
    defaultMazeShape = new Ammo.btCompoundShape(true);
    console.log("oh yes");
    const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration(),
        dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration),
        broadphase = new Ammo.btDbvtBroadphase(),
        solver = new Ammo.btSequentialImpulseConstraintSolver();

    physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, broadphase, solver, collisionConfiguration);
    physicsWorld.setGravity(new Ammo.btVector3(0, -10, 0));
}

function updatePhysicsWorld(deltaTime, ground) {
    //console.log("delta es " + deltaTime);
    physicsWorld.stepSimulation(deltaTime, 1000);
    for (let i = 0; i < rigidBodies.length; i++) {
        const graphicsObj = rigidBodies[i];
        const physicsObj = graphicsObj.userData.physicsBody;
        let motionState = physicsObj.getMotionState();
        if (motionState) {
            motionState.getWorldTransform(tmpTransformation);
            let new_pos = tmpTransformation.getOrigin();
            //console.log("pos es " + new_pos.y());
            let new_qua = tmpTransformation.getRotation();
            //console.log("qua es " + new_qua);
            graphicsObj.position.set(new_pos.x(), new_pos.y(), new_pos.z());
            graphicsObj.quaternion.set(new_qua.x(), new_qua.y(), new_qua.z(), new_qua.w());
        }
        //console.log("mi masa es " + physicsObj)
    }
    for (let i = 0; i < kinematicBodies.length; i++) {
        const vector = new THREE.Vector3();
        const quaternion = new THREE.Quaternion();
        kinematicBodies[i].getWorldPosition(vector);
        kinematicBodies[i].getWorldQuaternion(quaternion);
        if (i == 0) {
            console.log("el primero es " + vector.x);
            console.log("el primero es quaternion " + quaternion.x);
        }
        
        const physicsObj = kinematicBodies[i].userData.physicsBody;
    let motionState = physicsObj.getMotionState();
    const myTransform = new Ammo.btTransform();
    myTransform.setOrigin(new Ammo.btVector3(vector.x, vector.y, vector.z));
    myTransform.setRotation(new Ammo.btQuaternion(quaternion.x, quaternion.y, quaternion.z, ground.quaternion.w));
    motionState.setWorldTransform(myTransform);
    physicsObj.setMotionState(motionState);
    }
    
}

function addGroundShape(size) {
    const myTransform = new Ammo.btTransform();
    defaultGroundShape = new Ammo.btBoxShape(new Ammo.btVector3(size.x * 0.5, size.y * 0.5, size.z * 0.5));
    defaultGroundShape.setMargin(0.05)
    myTransform.setOrigin(new Ammo.btVector3(0, 0, 0));
    defaultMazeShape.addChildShape(myTransform, defaultGroundShape);
}

function addWallShape(pos) {
    console.log(`position received: x ${pos.x}, y ${pos.y}, z ${pos.z}`);
    const myTransform = new Ammo.btTransform();
    myTransform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
    const box = new Ammo.btBoxShape(new Ammo.btVector3(0.5, 0.5, 0.5));
    defaultMazeShape.addChildShape(myTransform, box);
    //console.log("our object is " + defaultMazeShape.addChildShape);
    const objs = defaultMazeShape.getNumChildShapes();
    console.log("local scaling is " + defaultMazeShape.getLocalScaling().x() + ", " + defaultMazeShape.getLocalScaling().y() + ", " + defaultMazeShape.getLocalScaling().z());
    for (let i = 0; i < objs; i++) {
        //console.log("this is " + defaultMazeShape.getChildTransform(i).getOrigin().x());
    }
}

class RigidBody {
    constructor(mesh, shape, mass, quat = {x: 0, y: 0, z: 0, w:  1}) {

        this.transform = new Ammo.btTransform();
        this.transform.setIdentity();
        console.log();
        this.transform.setOrigin(new Ammo.btVector3(mesh.position.x, mesh.position.y, mesh.position.z));
        this.transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
        this.motionState = new Ammo.btDefaultMotionState(this.transform);

        //const btSize = new Ammo.btVector3(size.x * 0.5, size.y * 0.5, size.z * 0.5);
        switch(shape) {
            case "box":
                this.shape = defaultBoxShape;
                break;
            case "ground":
                this.shape = defaultGroundShape;
                break;
            default:
                this.shape = defaultSphereShape;
        }
        this.shape.setMargin(0.05);
        this.inertia = new Ammo.btVector3(0, 0, 0);
        if (mass > 0) {
            this.shape.calculateLocalInertia(mass, this.inertia);
        }

        this.info = new Ammo.btRigidBodyConstructionInfo(mass, this.motionState, this.shape, this.inertia);
        this.body = new Ammo.btRigidBody(this.info);
        const restitution = mass > 0 ? 0.5 : 0.09;
        this.body.setRestitution(restitution);
        this.body.setFriction(10);

        physicsWorld.addRigidBody(this.body);
        mesh.userData.physicsBody = this.body;
        if (mass > 0) {
            rigidBodies.push(mesh);
        } else { 
            kinematicBodies.push(mesh);
        }
        
        //console.log("am i compound " + defaultMazeShape.isCompound());
    }
}

export { RigidBody, initPhysicsWorld, updatePhysicsWorld, rigidBodies, addGroundShape, addWallShape };
