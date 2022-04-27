import * as THREE from 'three'
import GUI from 'lil-gui';

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
import useWorldStore from "../../store/world";

const { solarSystemStore, settings, setTimeSpeed, getPlanetoidInfo } = useWorldStore();

let camera_, controls_, renderer_, scene_, loop_,
  gltfLoader, raycaster, mouse,
  clickFlag, contextClickFlag, solarGroup_

class World {
  constructor(container) {
    this.container = container;
    this.gui = new GUI();
    this.timeSpeedSetting = { speed: 1 }
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
    controls_ = createControls(this.camera_, renderer_.domElement);
    loop_.updatables.push(controls_);

    const ambLight_ = createAmbientLight(0xffffff, 1);
    const pointLight_ = createPointLight(0xffffff, 10);
    scene_.add(ambLight_, pointLight_);

    // Setup reactive listeners
    const resizer = new Resizer(this.container, this.camera_, renderer_);
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

    const f1 = this.gui.addFolder('SolarSystem')
    solarGroup_ = createSolarGroup(f1);
    solarGroup_.children.forEach(mesh => {
      loop_.updatables.push(mesh);
    })
    console.log(solarGroup_)
    console.log(loop_.updatables)
    scene_.add(solarGroup_);
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
