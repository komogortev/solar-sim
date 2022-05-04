// store/world.js
import { ref, reactive, computed, toRefs } from "vue";
/**
 * 1. [AU] (150,000,000 km; 93,000,000 mi)
 * 2. "orbital_period" (also revolution period) is the amount of time a given
 *      astronomical object takes to complete one orbit around another object.
 * 3. "rotation_period" (or synodic day, or solar day) is the period
 *      for a celestial object to rotate once in relation to the star it is
 *      orbiting, and is the basis of solar time. (full day)
 * 4. POI - Cartesian coordinates may be retrieved from spherical
 *      coords (radius, inclination, azimuth)
 *      x = R cos() sin()
 *      y = R sin() sin()
 *      z = R cos()
 */
const state = reactive({
  moveForward: false,
  moveBackward: false,
  moveLeft: false,
  moveRight: false,
  canJump: false,

  loading: true,
  settings: {
    velocity: new THREE.Vector3(),
    direction: new THREE.Vector3(),
    vertex: new THREE.Vector3(),
    color: new THREE.Color(),
  },
});

function _findObjectSection(object, sectionKey) {
  let result = null

  for (const key of Object.keys(object)) {
    if (key === sectionKey) {
      result = object[key]
      break
    } else if (!result && object[key].children) {
      result = _findObjectSection(object[key].children, sectionKey)
    }
  }

  return JSON.parse(JSON.stringify(result))
}

export default function useWorldStore() {
  const getPlanetoidInfo = ((nameId) => {
    return _findObjectSection(state.solarSystemStore, nameId)
  })
  const getSettings = (() => {
    return state.settings
  })

  const setSolarState = (solar) => {
    state.solarSystemStore = solar
  }

  const setTimeSpeed = (value) => {
    state.settings = { ...state.settings, timeSpeed: value }
  }

  return {
    ...toRefs(state), // convert to refs when returning
    setSolarState,
    setTimeSpeed,
    getPlanetoidInfo
  }
}