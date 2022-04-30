import { Scene, WebGLCubeRenderTarget, Color, FogExp2 } from 'three';
import { AppSettings } from '../../globals'

function createScene(renderer_, textureLoader) {
  const scene = new Scene();
  scene.fog = new FogExp2(0x000000, 0.00000025);
  const texture = textureLoader.load(
    AppSettings.BG_MAP,
    () => {
      const rt = new WebGLCubeRenderTarget(texture.image.height);
      rt.fromEquirectangularTexture(renderer_, texture);
      scene.background = rt.texture;
    })
  // scene.background = new Color('skyblue');
  return scene;
}

export { createScene };