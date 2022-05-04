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

import { createOrbitControls, createFlyControls, createFpsControls, createPointerLockControls } from '../systems/controls';
import { createRenderer } from '../systems/renderer';
import { Resizer } from '../systems/Resizer';
import { Loop } from '../systems/Loop';
import useWorldStore from "../../stores/world";
import { getTargetPositionScale, decorateLog } from '../../utils/helpers';

const { solarSystemStore, settings, setTimeSpeed, getPlanetoidInfo } = useWorldStore();

let camera_, controls_, renderer_, scene_, loop_,
  gltfLoader, raycaster, mouse,
  clickFlag, contextClickFlag, solarGroup_, tp_options, tp_control

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

    controls_ = createPointerLockControls(this.camera_, renderer_.domElement);
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
    {
      // const { parrot, flamingo, stork } = await loadBirds();
      // loop_.updatables.push(parrot, flamingo, stork);
      // scene_.add(parrot, flamingo, stork);
    }

    // Load cat
    {
      // const { toonCat } = await loadToonCat();
      // loop_.updatables.push(toonCat);
      // scene_.add(toonCat);
    }

    // Create Solar System
    solarGroup_ = createSolarGroup();

    this._initTpActionGui(solarGroup_)

    // Add system children to scene/loop_
    // *(account on just three categories of inheritance: star/planet/moon)
    solarGroup_.children.forEach(mesh => {

      mesh.children
        .forEach((m, i) => {
          // :1 moons/athmospheres/cities
          if (['athmosphereMap', 'POI'].includes(m.name)) {
            loop_.updatables.push(m)
          }
        })

      // :2 planets
      loop_.updatables.push(mesh);

    });

    // :3 star
    scene_.add(solarGroup_);

    // Initiate and position the Golem (choose default planetoid name)
    this.golem = new Golem(this.camera_);

    scene_.add(this.golem.mesh);
    loop_.updatables.push(this.golem);

    // Assign camera and controls to golem
    // controls_.position.copy(initPlanetoid.position); // OrbitControls
    const initPlanetoidName = 'Earth'
    const initPlanetoid = solarGroup_.children.find(c => c.name.includes(initPlanetoidName))

    this.camera_.position.copy(initPlanetoid.position)
      .add(new THREE.Vector3(0, 0, initPlanetoid.scale.z + 0.01));
    this.camera_.lookAt(initPlanetoid.position.x, initPlanetoid.position.y, initPlanetoid.position.z)
    this.camera_.updateProjectionMatrix();

    // Log init results
    {
      console.groupCollapsed('%c Solar System Meshes', 'color: teal');
        decorateLog('Solar Group:', '', solarGroup_)
      console.groupEnd('Solar System Meshes');

      console.groupCollapsed('%c Loop Updatables', 'color: teal');
        decorateLog('Updatable Objects:', '', loop_.updatables)
      console.groupEnd('Updatables');
    }
  }

  _initTpActionGui(group) {
    tp_options = group.children.map(m => m.name)
    tp_options.unshift("Free Float")

    tp_control = { 'TP points': "Free Float" }

    this.gui.add(tp_control, 'TP points', tp_options)
      .onChange((v) => {
        let tpMesh = v !== "Free Float"
          ? group.children.find(m => m.name === v)
          : null
        const newPos = getTargetPositionScale(tpMesh)

        this.camera_.position.set(newPos.p[0], newPos.p[1], newPos.p[2] + newPos.s * 2.5)
        this.camera_.lookAt(newPos.p[0], newPos.p[1], newPos.p[2])
        this.camera_.updateProjectionMatrix()

        decorateLog('TP >', tpMesh ? tpMesh.name : 'Free Float', newPos)
      });
  }

  tick(delta) {
    // test golem request status
    let isGolemRequested = true;

    this.stats.update(delta);

    controls_.tick(delta, loop_.updatables);
    //controls_.update(delta);

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
