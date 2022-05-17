import { Group, PerspectiveCamera, Vector3 } from 'three';
import { AppSettings } from '../../globals';
import { Golem } from '../constructors/Golem';

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
  // camera.position.set(0, 0, 50);

  // camera.lookAt(0, 0, 0);

  return camera;
}

class ConstructCameraRig {
  constructor(fov = 75, name = 'perspective camera Rig') {
    this._name = name;

    this._floor = null;

    this._rig = new Group();

    this._camera = createPerspectiveCamera(
      fov, // fov = Field Of View
      AppSettings.CAMERA.aspect,
      AppSettings.CAMERA.near,
      AppSettings.CAMERA.far,
    );

    this._camera.position.set(0, 0.5, 0.5);

    this._camera.lookAt(-1, 0.5, 1);

    this.golem = new Golem(this._camera);

    this._rig.add(this._camera, this.golem.mesh);

  }

  tick(delta) {

    // rotate the rig to face the floor
    this.rig.lookAt(this._floor.position.x, this._floor.position.y, this._floor.position.z)

    // find direction of attraction (to floor)

    // ensure rig is on the floor
    this.rig.position.copy(this._floor.position)
      .add(new Vector3(0, 0, this._floor.scale.z + 0.01));

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