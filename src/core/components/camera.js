import { Group, PerspectiveCamera } from 'three';
import { AppSettings } from '../../globals';

function createPerspectiveCamera(fov = 75, name = 'perspective camera') {
  const camera = new PerspectiveCamera(
    fov, // fov = Field Of View
    AppSettings.CAMERA.aspect,
    AppSettings.CAMERA.near,
    AppSettings.CAMERA.far,
  );
  camera.name = name
  var cameraLayer = 1
  camera.layers.set(cameraLayer);
  // move the camera back so we can view the scene
  camera.position.set(0, 0, 50);
  camera.lookAt(0, 0, 0);
  return camera;
}

class ConstructCameraRig {
  constructor(fov = 75, name = 'perspective camera Rig') {
    this._rig = new Group();

    this._camera = createPerspectiveCamera(
      fov, // fov = Field Of View
      AppSettings.CAMERA.aspect,
      AppSettings.CAMERA.near,
      AppSettings.CAMERA.far,
    );

    this._name = name;

    this._floor = null;

    this.rig.add(this._camera);
  }

  tick (delta) {

    // rotate the rig to face the floor
    this.rig.lookAt(initPlanetoid.position.x, initPlanetoid.position.y, initPlanetoid.position.z)

    // ensure rig is on the floor
    //this.rig.position.copy(initPlanetoid.position)
      //.add(new THREE.Vector3(0, 0, initPlanetoid.scale.z + 0.01));
  }

  get name() {
    return this._name;
  }

  get rig() {
    return this._rig;
  }

  get camera() {
    return this._camera;
  }

  set floor(mesh) {
    this._floor = mesh;
    this._camera.floor = mesh;
  }
}

export { createPerspectiveCamera, ConstructCameraRig };