import * as THREE from 'three'

import { loadBirds } from '../components/birds/birds';
import { loadToonCat } from '../components/animals/toon-cat';
import { createPerspectiveCamera } from '../components/camera';
import { createAmbientLight, createPointLight } from '../components/lights';
import { createSolarGroup } from '../components/solarGroup.js';
import { createScene } from '../components/scene';

import { createControls } from '../systems/controls';
import { createRenderer } from '../systems/renderer';
import { Resizer } from '../systems/Resizer';
import { Loop } from '../systems/Loop';


let camera_, controls_, renderer_, scene_, loop_,
  textureLoader, gltfLoader, raycaster, mouse, clock,
  clickFlag, contextClickFlag, clickCount,
  solarGroup_

class World {
  constructor(container) {
    this.container = container;
    // General tools
    textureLoader = new THREE.TextureLoader();
    raycaster = new THREE.Raycaster()
    mouse = new THREE.Vector2(1, 1)
    clock = new THREE.Clock();
    clickCount = 0

    // World scene tools
    camera_ = createPerspectiveCamera();
    renderer_ = createRenderer();
    scene_ = createScene(renderer_, textureLoader);
    loop_ = new Loop(camera_, scene_, renderer_);
    container.append(renderer_.domElement);
    controls_ = createControls(camera_, renderer_.domElement);

    loop_.updatables.push(controls_);

    const ambLight_ = createAmbientLight(0xffffff, .5);
    const pointLight_ = createPointLight(0xffffff, 1000);
    scene_.add(ambLight_, pointLight_);

    // Setup reactive listeners
    const resizer = new Resizer(this.container, camera_, renderer_);
    document.addEventListener('click', this.onMouseClick) // Left click
    document.addEventListener('dblclick', this.onMouseDblClick) // Left, Left, Dbl
    document.addEventListener('contextmenu', this.onMouseContext) // Right click
    this.initialize_()
  }

  async initialize_() {
    // Scene objects setup
    // const { parrot, flamingo, stork } = await loadBirds();
    // loop_.updatables.push(parrot, flamingo, stork);
    // scene_.add(parrot, flamingo, stork);

    // const { toonCat } = await loadToonCat();
    // loop_.updatables.push(toonCat);
    // scene_.add(toonCat);

    solarGroup_ = createSolarGroup();
    loop_.updatables.push(solarGroup_.children[0]);
    scene_.add(solarGroup_);
  }

  onMouseClick(event) {
    if (clickFlag) {
      return event.preventDefault();
    }
    console.log('onMouseClick', event)
    clickFlag = true
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // jump camera to next planetoid
    // clickCount = clickCount < solarGroup_.children.length ? clickCount + 1: 0
    // const position = solarGroup_.children[clickCount].position
    // camera_.position.x = position.x;
    // camera_.lookAt(position);
    // controls_.update();
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
