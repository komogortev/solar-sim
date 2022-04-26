import { PerspectiveCamera } from 'three';

function createCamera(fov = 75,  name = 'perspective camera') {
  const camera = new PerspectiveCamera(
    fov, // fov = Field Of View
    window.innerWidth / window.innerHeight, // aspect ratio
    0.1, // near clipping plane
    100, // far clipping plane
  );
  camera.name = name

  // move the camera back so we can view the scene
  camera.position.set(0, 0, 100);
  camera.lookAt(0, 0, 0);
  return camera;
}

export { createCamera };