import { Color, Scene, WebGLCubeRenderTarget } from 'three';
import { AppSettings } from '../../globals'

function createScene(renderer_, textureLoader) {
  const scene = new Scene();
  const texture = textureLoader.load(
    AppSettings.BG_MAP,
    () => {
      const rt = new WebGLCubeRenderTarget(texture.image.height);
      rt.fromEquirectangularTexture(renderer_, texture);
      scene.background = rt.texture;
    })

  return scene;
}

export { createScene };