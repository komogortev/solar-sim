<script setup>
import { ref, onMounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { AppSettings } from '../globals'

import { createCamera } from '../core/components/camera';
import { createCube } from '../core/components/cube';
import { createLights, createAmbientLight } from '../core/components/lights';
import { createScene } from '../core/components/scene';

import { createRenderer } from '../core/systems/renderer';
import { Resizer } from '../core/systems/Resizer';
import { Loop } from '../core/systems/Loop';

defineProps({
  msg: String
})

let canvas_, camera_, renderer_, scene_, controls_,
  loop_, textureLoader, gltfLoader, raycaster, mouse, clock,
  clickFlag, contextClickFlag

class World {
  constructor(canvas) {
    textureLoader = new THREE.TextureLoader();
    gltfLoader = new GLTFLoader();
    raycaster = new THREE.Raycaster()
    mouse = new THREE.Vector2(1, 1)
    clock = new THREE.Clock();

    camera_ = createCamera();
    renderer_ = createRenderer(canvas);
    scene_ = createScene(renderer_, textureLoader);
    controls_ = new OrbitControls(scene_, renderer_.domElement);
    loop_ = new Loop(camera_, scene_, renderer_);
    //renderer_.append(renderer_.domElement);
    const cube_ = createCube();
    const ambLight_ = createAmbientLight();

    loop_.updatables.push(cube_);
    scene_.add(cube_, ambLight_);

    const resizer = new Resizer(canvas, camera_, renderer_);
  }

  initializeDemo_() {
    gltfLoader.load( '/models/toon-cat/toon-cat.gltf', ( gltf ) => {
      gltf.animations // Array<THREE.AnimationClip>
      gltf.scene // THREE.Group
      gltf.scenes // Array<THREE.Group>
      gltf.cameras // Array<THREE.Camera>
      gltf.asset // Object
      gltf.scene.scale.setScalar(.025)
      scene_.add( gltf.scene )
    }, undefined, ( error ) => {
      console.error( error )
    })

    document.addEventListener('click', onMouseClick) // Left click
    document.addEventListener('dblclick', onMouseDblClick) // Left, Left, Dbl
    document.addEventListener('contextmenu', onMouseContext) // Right click
  }

  onMouseClick (event) {
    //event.preventDefault();
    if (clickFlag) {
      return onMouseDblClick(event)
    }
    console.log('onMouseClick', event)
    clickFlag = true
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  }

  onMouseDblClick (event) {
    //event.preventDefault();
    console.log('onMouseDblClick', event)
  }

  onMouseContext (event) {
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

function initialize() {
  // Get a reference to the container element
  canvas_ = document.querySelector('#c');

  // create a new world
  const world = new World(canvas_);

  // start the animation loop
  world.start();
}

const count = ref(0)

onMounted(() => {
  //initialize()
  //animate()
  initialize()
});

</script>

<template>
  <div id="info">{{ msg }}</div>
  <canvas id="c"></canvas>
</template>

<style scoped>
#info {
  position: absolute;
  top: 10px;
  width: 100%;
  text-align: center;
  z-index: 100;
  display:block;
}
#c {
  /* tell our scene container to take up the full page */
  /* position: absolute;
  width: 100%;
  height: 100%; */

  /*
    Set the container's background color to the same as the scene's
    background to prevent flashing on load
  */
  /* background-color: skyblue; */
}
</style>
