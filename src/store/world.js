// store/world.js
import { ref, reactive, computed, toRefs } from "vue";

const state = reactive({
  solarSystemStore: {
    'Sun': {
      nameId: 'Sun',
      distance: 0,
      scale: 3, // (110*Earth)
      radius: 700000, //
      orbital_period: 0.1,
      rotation_period: 27,
      tilt: 0,
      mass: 332950, // Earth's mass
      emissive: 0xFFFF00,
      emissiveMap: 'models/solar-system/textures/2k_sun.jpg',
      emissiveIntensity: 1,
      children: {
        'Mercury': {
          nameId: 'Mercury',
          distance: 0.4, //  [AU] (150,000,000 km; 93,000,000 mi)
          scale: 0.33, // times Earth's
          radius: 2440, // (*km)
          orbital_period: 87.97, // Earth's days (24hr)
          rotation_period: 175.94, // Earth's days (24hr)
          tilt: 0.3, // degrees to Sun equator
          mass: 0.055, // Earth's mass
          temperatures: { // Celsius
            day: 427,
            night: -173
          },
          textureMap: 'models/solar-system/textures/2k_mercury.jpg'
        },
        'Venus': {
          nameId: 'Venus',
          distance: 0.7,
          scale: 0.95,
          radius: 6052,
          orbital_period: 224.7,
          rotation_period: 243,
          tilt: 3.86,
          mass: 0.815,
          temperatures: {
            day: 464,
            night: 400
          },
          textureMap: 'models/solar-system/textures/2k_venus_surface.jpg'
        },
        'Earth': {
          nameId: 'Earth',
          distance: 1,
          scale: 1,
          radius: 6371,
          orbital_period: 365,
          rotation_period: 1,
          mass: 1,
          tilt: 0.41,
          temperatures: {
            day: 56.7,
            night: -89.2
          },
          bumpMap: 'models/solar-system/textures/earth/1k_earth_bump.jpg',
          bumpScale: 0.5,
          specularMap: 'models/solar-system/textures/earth/EarthSpec.png', // shininess map
          shininess: 0.5,
          athmosphereMap: 'models/solar-system/textures/earth/8k_earth_clouds.jpg',
          athmosphereDepth: 0.1125,
          textureMap: 'models/solar-system/textures/earth/2k_earth_daymap.jpg',
          children: {
            'Moon': {
              nameId: 'Moon',
              distance: 0.1,
              scale: 0.3,
              radius: 1737.4,
              orbital_period: 28,
              rotation_period: 0,
              tilt: 5.145,
              mass: 0.0123,
              textureMap: 'models/solar-system/textures/2k_moon.jpg',
            }
          }
        },
        'Mars': {
          nameId: 'Mars',
          distance: 1.5,
          scale: 0.5,
          radius: 3396,
          orbital_period: 687,
          rotation_period: 1.02,
          tilt: 5.65,
          mass: 0.107,
          temperatures: {
            day: -143,
            night: 35
          },
          textureMap: 'models/solar-system/textures/mars/2k_mars.jpg',
          bumpMap: 'models/solar-system/textures/mars/1k_mars_bump.jpg',
          bumpScale: 0.5,
        },
        'Jupiter': {
          nameId: 'Jupiter',
          distance: 5.2,
          scale: 11,
          radius: 69911,
          orbital_period: 4380,
          rotation_period: 1.02,
          mass: 318,
          textureMap: 'models/solar-system/textures/2k_jupiter.jpg',
          children: {
            Ganymede: {
              nameId: 'Ganymede',
              distance: .2,
              scale: 1,
              orbital_period: 7,
              rotation_period: 0,
              color: 0xF3F2F2
            }
          }
        },
        'Saturn': {
          nameId: 'Saturn',
          distance: 9.5,
          scale: 9,
          radius: 58232,
          orbital_period: 10767.5,
          rotation_period: 0.475,
          mass: 95,
          textureMap: 'models/solar-system/textures/2k_saturn.jpg',
          children: {
            Titan: {
              nameId: 'Titan',
              distance: 0.8,
              scale: 1,
              orbital_period: 500,
              rotation_period: 0,
              color: 0xF1E17B
            },
            Enceladus: {
              nameId: 'Enceladus',
              distance: 1,
              scale: 1,
              orbital_period: 510,
              rotation_period: 0,
              color: 0xDADADA
            },
            Iapetus: {
              nameId: 'Iapetus',
              distance: 1.2,
              scale: 1,
              orbital_period: 520,
              rotation_period: 0,
              color: 0x506855
            },
            Rhea: {
              nameId: 'Rhea',
              distance: 1.4,
              scale: 1,
              orbital_period: 530,
              rotation_period: 0,
              color: 0xDADADA
            },
            Dione: {
              nameId: 'Dione',
              distance: 1.6,
              scale: 1,
              orbital_period: 540,
              rotation_period: 0,
              color: 0xDADADA
            },
            Tethys: {
              nameId: 'Tethys',
              distance: 1.8,
              scale: 1,
              orbital_period: 550,
              rotation_period: 0,
              color: 0xDADADA
            },
            Mimas: {
              nameId: 'Mimas',
              distance: 2,
              scale: 1,
              orbital_period: 560,
              rotation_period: 0,
              color: 0xDADADA
            },
          }
        },
        Uranus: {
          nameId: 'Uranus',
          distance: 19.2,
          scale: 4,
          orbital_period: 30660,
          rotation_period: 0.71832,
          radius: 25362,
          mass: 14,
          // color: 0x85E9F7,
          textureMap: 'models/solar-system/textures/2k_uranus.jpg',
          children: {
            Titania: {
              nameId: 'Titania',
              distance: 0.8,
              scale: 1,
              orbital_period: 500,
              rotation_period: 0,
              color: 0xDADADA
            },
            Oberon: {
              nameId: 'Oberon',
              distance: 1,
              scale: 1,
              orbital_period: 510,
              rotation_period: 0,
              color: 0xF9D8F6
            },
            Umbriel: {
              nameId: 'Umbriel',
              distance: 1.2,
              scale: 1,
              orbital_period: 520,
              rotation_period: 0,
              color: 0xDADADA
            },
            Ariel: {
              nameId: 'Ariel',
              distance: 1.4,
              scale: 1,
              orbital_period: 530,
              rotation_period: 0,
              color: 0xDADADA
            },
            Miranda: {
              nameId: 'Miranda',
              distance: 1.6,
              scale: 1,
              orbital_period: 540,
              rotation_period: 0,
              color: 0xDADADA
            },
          }
        },
        Neptun: {
          nameId: 'Neptun',
          distance: 30.1,
          scale: 4,
          orbital_period: 60225,
          rotation_period: 0.67125,
          radius: 24622,
          mass: 17,
          // color: 0x173498,
          textureMap: 'models/solar-system/textures/2k_neptune.jpg',
          children: {
            Triton: {
              nameId: 'Triton',
              distance: 0.8,
              scale: 1,
              orbital_period: 500,
              rotation_period: 0,
              color: 0xDAB0FF
            },
          }
        }
      }
    },
  },

  loading: true,
  settings: {
    timeSpeed: 1
  },
});

function _findObjectSection(object, sectionKey)  {
  let result = null

  for (const key of Object.keys(object)) {
    if (key === sectionKey) {
      result = object[key]
    } else if (object[key].children) {
      result = findObjectSection(object[key].children, sectionKey)
    }

    if (result) {
      return result
    }
  }
}

export default function useWorldStore() {
  const getPlanetoidInfo = ((nameId) => {
    return _findObjectSection(state.solarSystemStore, nameId)
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