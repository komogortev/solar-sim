<script setup>
import { ref, onMounted } from 'vue'
import * as THREE from 'three'

defineProps({
  msg: String
})

const count = ref(0)
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
