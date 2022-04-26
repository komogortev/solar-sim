import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { setupModel } from './setupModel.js';

async function loadToonCat() {
  const loader = new GLTFLoader();

  const [toonCatData] = await Promise.all([
    loader.loadAsync('/src/assets/models/toon-cat/toon-cat.gltf'),
  ]);

  console.log('Meow!', toonCatData);

  const toonCat = setupModel(toonCatData);
  toonCat.position.set(10, 0, 0);
  toonCat.scale.set(0.1, 0.1, 0.1);

  return {
    toonCat
  };
}

export { loadToonCat };
