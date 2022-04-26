<script setup>
import { ref, onMounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { AppSettings } from '../globals'

defineProps({
  msg: String
})

let _SCENE = null;
let canvas, scene, renderer, sceneCamera, sceneControls, textureLoader, gltfLoader
let ambientLight, light
let raycaster, mouse, clock
let clickFlag, contextClickFlag

const sizes = {
  w: window.innerWidth,
  h: window.innerHeight
}
const interactiveObjects = [];

function initialize() {
  raycaster = new THREE.Raycaster()
  mouse = new THREE.Vector2( 1, 1 )
  clock = new THREE.Clock();

  initializeRenderer_();
  initializeScene_();
  initializeLights_();
  initializeCamera_();
  initializeDemo_();
}

function initializeRenderer_() {
  canvas = document.getElementById("c");
  renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(sizes.w, sizes.h);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
}

function initializeScene_() {
  scene = new THREE.Scene();
  textureLoader = new THREE.TextureLoader();
  gltfLoader = new GLTFLoader();

  const texture = textureLoader.load(
    AppSettings.BG_MAP,
    () => {
      const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
      rt.fromEquirectangularTexture(renderer, texture);
      scene.background = rt.texture;
    })
}

function initializeLights_() {
  const distance = 50.0;
  const angle = Math.PI / 4.0;
  const penumbra = 0.5;
  const decay = 1.0;

  let light = new THREE.SpotLight(
    0xFFFFFF, 100.0, distance, angle, penumbra, decay);
  light.castShadow = true;
  light.shadow.bias = -0.00001;
  light.shadow.mapSize.width = 4096;
  light.shadow.mapSize.height = 4096;
  light.shadow.camera.near = 1;
  light.shadow.camera.far = 100;

  light.position.set(25, 25, 0);
  light.lookAt(0, 0, 0);
  scene.add(light);

  const upColour = 0xFFFF80;
  const downColour = 0x808080;
  light = new THREE.HemisphereLight(upColour, downColour, 0.5);
  light.color.setHSL(0.6, 1, 0.6);
  light.groundColor.setHSL(0.095, 1, 0.75);
  light.position.set(0, 4, 0);
  scene.add(light);

  const ambientLight = new THREE.AmbientLight(0xffffff, .25)
  const color = 0xFFFFFF;
  const intensity = 1;
  const pointLight = new THREE.PointLight(color, intensity)
  scene.add(ambientLight, pointLight)

}

function initializeCamera_() {
  sceneCamera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight)
  sceneCamera.name = 'Scene Camera'
  sceneCamera.position.set(0, 0, 50);
  sceneCamera.lookAt(0, 0, 0);
  const cameraHelper = new THREE.CameraHelper(sceneCamera);
  cameraHelper.name = "Scene Camera Helper"
  sceneControls = new OrbitControls(sceneCamera, renderer.domElement);

  scene.add(sceneCamera, cameraHelper)
}

function initializeDemo_() {
  gltfLoader.load( '/models/toon-cat/toon-cat.gltf', ( gltf ) => {
    gltf.animations // Array<THREE.AnimationClip>
    gltf.scene // THREE.Group
    gltf.scenes // Array<THREE.Group>
    gltf.cameras // Array<THREE.Camera>
    gltf.asset // Object
    gltf.scene.scale.setScalar(.025)
    scene.add( gltf.scene )
  }, undefined, ( error ) => {
    console.error( error )
  })

  document.addEventListener('click', onMouseClick) // Left click
  document.addEventListener('dblclick', onMouseDblClick) // Left, Left, Dbl
  document.addEventListener('contextmenu', onMouseContext) // Right click
}

function onMouseClick (event) {
  //event.preventDefault();
  if (clickFlag) {
    return onMouseDblClick(event)
  }
  console.log('onMouseClick', event)
  clickFlag = true
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function onMouseDblClick (event) {
  //event.preventDefault();
  console.log('onMouseDblClick', event)
}

function onMouseContext (event) {
  //event.preventDefault();
  console.log('onMouseContext', event)
  contextClickFlag = true
}

function animate() {
  renderer.render(scene, sceneCamera)
  requestAnimationFrame(animate)
}

const count = ref(0)

onMounted(() => {
  initialize()
  animate()
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
</style>
