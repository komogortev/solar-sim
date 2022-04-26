import { WebGLRenderer, PCFSoftShadowMap } from 'three';

function createRenderer(canvas) {
  const renderer = new WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap; // default THREE.PCFShadowMap
  renderer.physicallyCorrectLights = true;

  return renderer;
}

export { createRenderer };