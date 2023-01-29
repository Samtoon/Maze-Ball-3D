import {
  WebGLCubeRenderTarget,
  CubeCamera,
  MeshBasicMaterial,
  MeshPhongMaterial,
  IcosahedronGeometry,
  Mesh
} from "/node_modules/three/build/three.module.js";

export default class MirrorSphere {
  _sphere;
  _colorSphere;
  _mirrorSphereCamera;
  _position;

  constructor(scene, size = 1, color = 0x00FFFF, opacity = 0.5) {
    // Mirror sphere material.
    const cubeRenderTarget = new WebGLCubeRenderTarget(1024);
    this._mirrorSphereCamera = new CubeCamera(0.05, 50, cubeRenderTarget);
    scene.add(this._mirrorSphereCamera);
    const mirrorSphereMaterial = new MeshBasicMaterial({ envMap: cubeRenderTarget.texture });

    // Color sphere material.
    const material = new MeshPhongMaterial({ color: color, transparent: true, opacity: opacity });

    // Sphere Geometry.
    const geometry = new IcosahedronGeometry(size, 10);

    // Mesh need both a geometry and a material.
    this._sphere = new Mesh(geometry, mirrorSphereMaterial);
    this._colorSphere = new Mesh(geometry, material);

    this._colorSphere.position.x = this._sphere.position.x;
    this._colorSphere.position.y = this._sphere.position.y;
    this._colorSphere.position.z = this._sphere.position.z;
    this._position = {
      x: this._sphere.position.x,
      y: this._sphere.position.y,
      z: this._sphere.position.z
    };

    scene.add(this._sphere);
    scene.add(this._colorSphere);
  }

  get position() {
    return this._sphere.position;
  }

  get sphere() {
    return this._sphere
  }

  get colorSphere() {
    return this._colorSphere
  }

  set position({ x, y, z }) {
    x = (typeof x === 'number') ? x : 0;
    y = (typeof y === 'number') ? y : 0;
    z = (typeof z === 'number') ? z : 0;
    this._colorSphere.position.x = x;
    this._colorSphere.position.y = y;
    this._colorSphere.position.z = z;
    this._sphere.position.x = x;
    this._sphere.position.y = y;
    this._sphere.position.z = z;
    this._position = {
      x: x,
      y: y,
      z: z
    };
  }

  update(renderer, scene) {
    this._sphere.getWorldPosition(this._mirrorSphereCamera.position);
    this._mirrorSphereCamera.update(renderer, scene);

    this._colorSphere.position.x = this._sphere.position.x;
    this._colorSphere.position.y = this._sphere.position.y;
    this._colorSphere.position.z = this._sphere.position.z;
    this._position.x = this._sphere.position.x;
    this._position.y = this._sphere.position.y;
    this._position.z = this._sphere.position.z;
  }

};
