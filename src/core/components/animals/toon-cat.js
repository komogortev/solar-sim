import { MathUtils } from 'three';

function createToonCat(gltfLoader) {
  const radiansPerSecond = MathUtils.degToRad(30);
  let gltfCat

  gltfLoader.load('/models/toon-cat/toon-cat.gltf', (gltf) => {
    gltfCat = gltf
    gltfCat.animations // Array<THREE.AnimationClip>
    gltfCat.scene // THREE.Group
    gltfCat.scenes // Array<THREE.Group>
    gltfCat.cameras // Array<THREE.Camera>
    gltfCat.asset // Object
    gltfCat.scene.scale.setScalar(.025)
    // this method will be called once per frame
    gltfCat.tick = (delta) => {
      // increase the model's rotation each frame
      gltfCat.scene.rotation.z += radiansPerSecond * delta;
      gltfCat.scene.rotation.x += radiansPerSecond * delta;
      gltfCat.scene.rotation.y += radiansPerSecond * delta;
    };


  }, undefined, (error) => {
    console.error(error)
  })


  // gltfCat.tick = (delta) => {
  //   // increase the cube's rotation each frame
  //   gltfCat.rotation.z += radiansPerSecond * delta;
  //   gltfCat.rotation.x += radiansPerSecond * delta;
  //   gltfCat.rotation.y += radiansPerSecond * delta;
  // };

  return gltfCat;
}

export { createToonCat };
