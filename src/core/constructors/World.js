import * as THREE from 'three'

import { loadBirds } from '../components/birds/birds';
import { loadToonCat } from '../components/animals/toon-cat';
import { createPerspectiveCamera } from '../components/camera';
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
    camera_ = createPerspectiveCamera();
    renderer_ = createRenderer();
    scene_ = createScene(renderer_, textureLoader);
    loop_ = new Loop(camera_, scene_, renderer_);
    container.append(renderer_.domElement);
    controls_ = createControls(camera_, renderer_.domElement);

    loop_.updatables.push(controls_);

    const ambLight_ = createAmbientLight(0xffffff, .5);
    scene_.add(ambLight_);

    // Setup reactive listeners
    const resizer = new Resizer(this.container, camera_, renderer_);
    document.addEventListener('click', this.onMouseClick) // Left click
    document.addEventListener('dblclick', this.onMouseDblClick) // Left, Left, Dbl
    document.addEventListener('contextmenu', this.onMouseContext) // Right click
    this.initialize_()
  }

  async initialize_() {
    // Scene objects setup
    const { parrot, flamingo, stork } = await loadBirds();
    loop_.updatables.push(parrot, flamingo, stork);
    scene_.add(parrot, flamingo, stork);

    const { toonCat } = await loadToonCat();
    loop_.updatables.push(toonCat);
    scene_.add(toonCat);
  }

  onMouseClick(event) {
    //event.preventDefault();
    if (clickFlag) {
      return this.onMouseDblClick(event)
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
