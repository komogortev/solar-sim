/**
 * Use this file to register any variables or functions that should be available globally
 * ideally you should make it available via the window object
 * as well as the Vue prototype for access throughout the app
 * (register globals with care, only when it makes since to be accessible app wide)
 */

export const AppSettings = Object.freeze({
  BG_MAP: '/models/solar-system/textures/8k_stars_milky_way.jpg',
  CAMERA: {
    position: {x: 0, y: 0, z: 50},
    aspect: window.innerWidth / window.innerHeight, // aspect ratio
    near: 0.1, // near clipping plane
    far: 10000 // far clipping plane
  },
  AU: {
    value: 150000000, // [AU] (150,000,000km = 93,000,000mi)
    units: 'km',
  }
});
