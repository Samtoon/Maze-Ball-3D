let physicsWorld;
const rigidBodies = [];
let defaultBoxShape;
let defaultSphereShape;
let defaultGroundShape;
let tmpTransformation;

function initPhysicsWorld() {
    console.log("called");
    tmpTransformation = new Ammo.btTransform();
    defaultSphereShape = new Ammo.btSphereShape(1);
    defaultBoxShape = new Ammo.btBoxShape(new Ammo.btVector3(0.5, 0.5, 0.5));
    defaultGroundShape = new Ammo.btBoxShape(new Ammo.btVector3(10, 1, 10))
    console.log("oh yes");
    const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration(),
        dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration),
        broadphase = new Ammo.btDbvtBroadphase(),
        solver = new Ammo.btSequentialImpulseConstraintSolver();

    physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, broadphase, solver, collisionConfiguration);
    physicsWorld.setGravity(new Ammo.btVector3(0, -10, 0));
}

function updatePhysicsWorld(deltaTime) {
    console.log("delta es " + deltaTime);
    physicsWorld.stepSimulation(deltaTime, 1000);
    for (let i = 0; i < rigidBodies.length; i++) {
        const graphicsObj = rigidBodies[i];
        const physicsObj = graphicsObj.userData.physicsBody;
        let motionState = physicsObj.getMotionState();
        if (motionState) {
            motionState.getWorldTransform(tmpTransformation);
            let new_pos = tmpTransformation.getOrigin();
            console.log("pos es " + new_pos.y());
            let new_qua = tmpTransformation.getRotation();
            console.log("qua es " + new_qua);
            graphicsObj.position.set(new_pos.x(), new_pos.y(), new_pos.z());
            graphicsObj.quaternion.set(new_qua.x(), new_qua.y(), new_qua.z(), new_qua.w());
        }
        console.log("mi masa es " + physicsObj)
    }
}

class RigidBody {
    constructor(mesh, shape, mass, quat = {x: 0, y: 0, z: 0, w:  1}) {

        this.transform = new Ammo.btTransform();
        this.transform.setIdentity();
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

        physicsWorld.addRigidBody(this.body);
        mesh.userData.physicsBody = this.body;
        rigidBodies.push(mesh);
    }
}

export { RigidBody, initPhysicsWorld, updatePhysicsWorld, rigidBodies}
