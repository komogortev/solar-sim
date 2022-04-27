<script setup>
import { ref, onMounted } from 'vue'
import { World } from '../core/constructors/World';

defineProps({
  msg: String
})

const count = ref(0)

async function main() {
  // Get a reference to the container element
  const container_ = document.querySelector('#scene-container');
  // create a new world
  const world = new World(container_);
  // start the animation loop
  world.start();
}

onMounted(() => {
  main().catch((err) => console.error(err))
});

</script>

<template>
  <!-- <div id="info">{{ msg }}</div> -->
  <section id="scene-container"></section>
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
#scene-container {
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
