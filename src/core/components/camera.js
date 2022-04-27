import { PerspectiveCamera } from 'three';
import { AppSettings } from '../../globals';

function createPerspectiveCamera(fov = 75, name = 'perspective camera') {
  const camera = new PerspectiveCamera(
    fov, // fov = Field Of View
    AppSettings.CAMERA.aspect,
    AppSettings.CAMERA.near,
    AppSettings.CAMERA.far,
  );
  camera.name = name

  // move the camera back so we can view the scene
  camera.position.set(0, 0, 50);
  camera.lookAt(0, 0, 0);
  return camera;
}

export { createPerspectiveCamera };