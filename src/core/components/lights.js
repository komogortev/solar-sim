import { DirectionalLight, AmbientLight, SpotLight, HemisphereLight, PointLight } from 'three';

function createLights() {
  // Create a directional light
  const light = new DirectionalLight('white', 8);
  // move the light right, up, and towards us
  light.position.set(10, 10, 10);
  return light;
}

function createAmbientLight(color = 0xffffff, intensity = .25) {
  const ambientLight = new AmbientLight(color, intensity)
  return ambientLight;
}

function createSpotLight(color = 0xFFFFFF) {
  const distance = 50.0;
  const angle = Math.PI / 4.0;
  const penumbra = 0.5;
  const decay = 1.0;

  let spotLight = new SpotLight(
    color, 100.0, distance, angle, penumbra, decay);
  spotLight.castShadow = true;
  spotLight.shadow.bias = -0.00001;
  spotLight.shadow.mapSize.width = 4096;
  spotLight.shadow.mapSize.height = 4096;
  spotLight.shadow.camera.near = 1;
  spotLight.shadow.camera.far = 100;
  spotLight.position.set(25, 25, 0);
  spotLight.lookAt(0, 0, 0);
  return spotLight;
}

function createHemisphereLight(upColour = 0xFFFF80, downColour = 0x808080) {
  hemisphereLight = new HemisphereLight(upColour, downColour, 0.5);
  hemisphereLight.color.setHSL(0.6, 1, 0.6);
  hemisphereLight.groundColor.setHSL(0.095, 1, 0.75);
  hemisphereLight.position.set(0, 4, 0);
  return hemisphereLight;
}

function createPointLight(color = 0xFFFFFF, intensity = 1) {
  const pointLight = new PointLight(color, intensity)
  return pointLight;
}

export {
  createLights,
  createAmbientLight,
  createSpotLight,
  createHemisphereLight,
  PointLight
};
