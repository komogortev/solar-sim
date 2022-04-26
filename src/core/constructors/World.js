import * as THREE from 'three'

import { loadBirds } from '../components/birds/birds';
import { createCamera } from '../components/camera';
import { createAmbientLight } from '../components/lights';
import { createScene } from '../components/scene';

import { createControls } from '../systems/controls';
import { createRenderer } from '../systems/renderer';
import { Resizer } from '../systems/Resizer';
import { Loop } from '../systems/Loop';

let camera_, controls_, renderer_, scene_, loop_,
  textureLoader, gltfLoader, raycaster, mouse, clock,
  clickFlag, contextClickFlag

class World {
  constructor(container) {
    this.container = container;
    // General tools
    textureLoader = new THREE.TextureLoader();
    raycaster = new THREE.Raycaster()
    mouse = new THREE.Vector2(1, 1)
    clock = new THREE.Clock();

    // World scene tools
    camera_ = createCamera();
    renderer_ = createRenderer();
    scene_ = createScene(renderer_, textureLoader);
    loop_ = new Loop(camera_, scene_, renderer_);
    container.append(renderer_.domElement);
    controls_ = createControls(camera_, renderer_.domElement);

    loop_.updatables.push(controls_);

    const ambLight_ = createAmbientLight();
    scene_.add(ambLight_);

    // Setup reactive listeners
    const resizer = new Resizer(this.container, camera_, renderer_);
    document.addEventListener('click', this.onMouseClick) // Left click
    document.addEventListener('dblclick', this.onMouseDblClick) // Left, Left, Dbl
    document.addEventListener('contextmenu', this.onMouseContext) // Right click
    this.initializeDemo_()
  }

  async initializeDemo_() {
    // Scene objects setup
    const { parrot, flamingo, stork } = await loadBirds();
    scene_.add(parrot, flamingo, stork);

    // gltfLoader.load('/models/toon-cat/toon-cat.gltf', (gltf) => {
    //   gltf.animations // Array<THREE.AnimationClip>
    //   gltf.scene // THREE.Group
    //   gltf.scenes // Array<THREE.Group>
    //   gltf.cameras // Array<THREE.Camera>
    //   gltf.asset // Object
    //   gltf.scene.scale.setScalar(.025)
    //   gltf.scene.tick = (delta) => {
    //     // increase the model's rotation each frame
    //     gltf.scene.rotation.z += radiansPerSecond * delta;
    //     gltf.scene.rotation.x += radiansPerSecond * delta;
    //     gltf.scene.rotation.y += radiansPerSecond * delta;
    //   };


    // }, undefined, (error) => {
    //   console.error(error)
    // })
  }

  onMouseClick(event) {
    //event.preventDefault();
    if (clickFlag) {
      return onMouseDblClick(event)
    }
    console.log('onMouseClick', event)
    clickFlag = true
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
  }

  onMouseDblClick(event) {
    //event.preventDefault();
    console.log('onMouseDblClick', event)
  }

  onMouseContext(event) {
    //event.preventDefault();
    console.log('onMouseContext', event)
    contextClickFlag = true
  }

  render() {
    // draw a single frame
    renderer_.render(scene_, camera_);
  }

  start() {
    loop_.start();
  }

  stop() {
    loop_.stop();
  }
}

export { World }
