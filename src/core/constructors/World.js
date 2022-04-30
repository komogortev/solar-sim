import * as THREE from 'three'
import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import GUI from 'lil-gui';

import { loadBirds } from '../components/birds/birds';
import { loadToonCat } from '../components/animals/toon-cat';
import { createPerspectiveCamera } from '../components/camera';
import { createAmbientLight, createPointLight } from '../components/lights';
import { createSolarGroup } from './SolarGroup.js';
import { Golem } from './Golem';
import { createScene } from '../components/scene';

import { createOrbitControls, createFlyControls } from '../systems/controls';
import { createRenderer } from '../systems/renderer';
import { Resizer } from '../systems/Resizer';
import { Loop } from '../systems/Loop';
import useWorldStore from "../../stores/world";

const { solarSystemStore, settings, setTimeSpeed, getPlanetoidInfo } = useWorldStore();

let camera_, controls_, renderer_, scene_, loop_,
  gltfLoader, raycaster, mouse,
  clickFlag, contextClickFlag, solarGroup_

class World {
  constructor(container) {
    this.container = container;
    this.stats = new Stats();
    this.gui = new GUI();

    this.timeSpeedSetting = { speed: 1 }
    container.appendChild(this.stats.dom);
    // Add sliders to number fields by passing min and max
    this.gui.add(this.timeSpeedSetting, 'speed', -100, 100, 1)
      .name('Time speed')
      .onChange(value => { setTimeSpeed(value) })

    // General tools
    this.textureLoader = new THREE.TextureLoader();

    // World scene tools
    this.camera_ = createPerspectiveCamera();
    renderer_ = createRenderer();
    scene_ = createScene(renderer_, this.textureLoader);
    loop_ = new Loop(this.camera_, scene_, renderer_);
    container.append(renderer_.domElement);

    controls_ = createFlyControls(this.camera_, renderer_.domElement);
    //loop_.updatables.push();
    loop_.updatables.push(this);

    const ambLight_ = createAmbientLight(0xffffff, .5);
    const pointLight_ = createPointLight(0xffffff, 100);
    scene_.add(ambLight_, pointLight_, this.camera_);

    // Setup reactive listeners
    const resizer = new Resizer(this.container, this.camera_, renderer_);
    this.initialize_()
  }

  // Scene objects setup
  async initialize_() {
    // Load birds
    // const { parrot, flamingo, stork } = await loadBirds();
    // loop_.updatables.push(parrot, flamingo, stork);
    // scene_.add(parrot, flamingo, stork);
    // Load cat
    // const { toonCat } = await loadToonCat();
    // loop_.updatables.push(toonCat);
    // scene_.add(toonCat);

    // Create Solar System
    const f1 = this.gui.addFolder('SolarSystem')
    solarGroup_ = createSolarGroup(f1);
    scene_.add(solarGroup_);
    solarGroup_.children.forEach(mesh => {
      loop_.updatables.push(mesh);
    })

    // create and position golem
    this.golem = new Golem();
    this.golem.mesh.position.set(0, 9.15, 9.15);
    scene_.add(this.golem.mesh)
    loop_.updatables.push(this.golem);

    // assign camera and controls to golem
    //controls_.position.copy(this.golem.mesh.position);

    this.camera_.position.copy(this.golem.mesh.position);
    this.camera_.updateProjectionMatrix();

    console.log(solarGroup_)
    console.log(loop_.updatables)
  }

  tick(delta) {
    // test golem request status
    let isGolemRequested = true;
    this.stats.update(delta);
    controls_.tick(delta, loop_.updatables);
    controls_.update(delta);

    if (isGolemRequested) {
      isGolemRequested = false;
    }
  }

  render() {
    // draw a single frame
    renderer_.render(scene_, this.camera_);
  }

  start() {
    loop_.start();
  }

  stop() {
    loop_.stop();
  }
}

export { World }
