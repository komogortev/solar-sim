<script setup>
import { ref, onMounted } from 'vue'
import * as THREE from 'three'
import { SceneManager } from '../core/constructors/SceneManager'

defineProps({
  msg: String
})

let _SCENE = null;
let canvas, scene, renderer, camera, controls, ambientLight, light;
const sizes = {
  w: window.innerWidth,
  h: window.innerHeight,
}
const interactiveObjects = [];

// function initialize() {
//   clock = new THREE.Clock();
//   canvas = document.getElementById("c");
//   renderer = new THREE.WebGLRenderer({ canvas });


//   renderer.setSize(sizes.w, sizes.h);
//   renderer.shadowMap.enabled = true;
//   renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

//   scene = new THREE.Scene();
//   textureLoader = new THREE.TextureLoader();

// }

const count = ref(0)


onMounted(() => {
  // initialize()
  // animate()

  canvas = document.getElementById("c");
  _SCENE = new SceneManager(canvas);
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
