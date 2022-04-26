// store/world.js
import { ref, reactive, computed, toRefs } from "vue";

const state = reactive({
  solarSystemStore: {
    'Sun': {
      nameId: 'Sun',
      radius: {
        value: 700000 * 0.01, // multiply by additional scale down
        units: 'km'
      },
      distance: {
        value: 0,
        // [AU] (150,000,000 km; 93,000,000 mi)
        units: 'AU',
      },
      // The orbital period(also revolution period) is the amount of time a given
      // astronomical object takes to complete one orbit around another object.
      orbital_period: {
        value: 0,
        units: 'day',
      },
      // A synodic day(or synodic rotation period or solar day) is the period
      // for a celestial object to rotate once in relation to the star it is
      // orbiting, and is the basis of solar time. (full day)
      rotation_period: {
        value: 27,
        units: 'day',
      }, // days
      tilt: 0,
      emissive: 0xFFFF00,
      emissiveMap: 'models/solar-system/textures/sun/2k_sun.jpg',
      emissiveIntensity: 1,
      children: {
        'Mercury': {
          nameId: 'Mercury',
          radius: {
            value: 2440,
            units: 'km'
          },
          distance: {
            value: 0.4,
            units: 'AU',
          },
          orbital_period: {
            value: 87.97,
            units: 'day',
          },
          rotation_period: {
            value: 175.94,
            units: 'day',
          },
          tilt: 0.3,
          textureMap: 'models/solar-system/textures/2k_mercury.jpg'
        },
        'Venus': {
          nameId: 'Venus',
          radius: {
            value: 6052,
            units: 'km'
          },
          distance: {
            value: 0.7,
            units: 'AU',
          },
          orbital_period: {
            value: 224.7,
            units: 'day',
          },
          rotation_period: {
            value: 243,
            units: 'day',
          },
          tilt: 3.86,
          textureMap: 'models/solar-system/textures/2k_venus_surface.jpg'
        },
        'Earth': {
          nameId: 'Earth',
          radius: {
            value: 6371,
            units: 'km'
          },
          distance: {
            value: 1,
            units: 'AU',
          },
          orbital_period: {
            value: 365,
            units: 'day',
          },
          rotation_period: {
            value: 1,
            units: 'day',
          },
          tilt: 0.41,
          textureMap: 'models/solar-system/textures/earth/2k_earth_daymap.jpg',
          bumpMap: 'models/solar-system/textures/earth/1k_earth_bump.jpg',
          bumpScale: 0.5,
          specularMap: 'models/solar-system/textures/earth/EarthSpec.png', // shininess map
          shininess: 0.5,
          athmosphereMap: 'models/solar-system/textures/earth/8k_earth_clouds.jpg',
          athmosphereDepth: 0.1125,
          children: {
            'Moon': {
              nameId: 'Moon',
              radius: {
                value: 1737.4,
                units: 'km'
              },
              distance: {
                value: 0.00256955529,
                units: 'AU',
              },
              orbital_period: {
                value: 28,
                units: 'day',
              },
              rotation_period: {
                value: 0,
                units: 'day',
              },
              tilt: 5.145,
              textureMap: 'models/solar-system/textures/2k_moon.jpg',
            }
          }
        },
        'Mars': {
          nameId: 'Mars',
          radius: {
            value: 3396,
            units: 'km'
          },
          distance: {
            value: 1.5,
            units: 'AU',
          },
          orbital_period: {
            value: 687,
            units: 'day',
          },
          rotation_period: {
            value: 1.02,
            units: 'day',
          },
          tilt: 5.65,
          textureMap: 'models/solar-system/textures/mars/2k_mars.jpg',
          bumpMap: 'models/solar-system/textures/mars/1k_mars_bump.jpg',
          bumpScale: 0.5,
        },
        'Jupiter': {
          nameId: 'Jupiter',
          radius: {
            value: 69911,
            units: 'km'
          },
          distance: {
            value: 5.2,
            units: 'AU',
          },
          orbital_period: {
            value: 4380,
            units: 'day',
          },
          rotation_period: {
            value: 0.413575,
            units: 'day',
          },
          textureMap: 'models/solar-system/textures/2k_jupiter.jpg',
          children: {
            Ganymede: {
              nameId: 'Ganymede',
              radius: {
                value: 2634.1,
                units: 'km'
              },
              distance: {
                value: 0.007152508221,
                units: 'AU',
              },
              orbital_period: {
                value: 7.16,
                units: 'day',
              },
              rotation_period: {
                value: 0,
                units: 'day',
              },
              tilt: 0.33,
              color: 0xF3F2F2
            }
          }
        },
        'Saturn': {
          nameId: 'Saturn',
          radius: {
            value: 58232,
            units: 'km'
          },
          distance: {
            value: 9.5,
            units: 'AU',
          },
          orbital_period: {
            value: 29 * 365,
            units: 'day',
          },
          rotation_period: {
            value: 0.43416,
            units: 'day',
          },
          tilt: 26.73,
          textureMap: 'models/solar-system/textures/2k_saturn.jpg',
          children: {
            Titan: {
              nameId: 'Titan',
              radius: {
                value: 2574.73,
                units: 'km'
              },
              distance: {
                value: 0.008021504547,
                units: 'AU',
              },
              orbital_period: {
                value: 15.945,
                units: 'day',
              },
              rotation_period: {
                value: 0,
                units: 'day',
              },
              tilt: 0,
              color: 0xF1E17B
            },
            Enceladus: {
              nameId: 'Enceladus',
              radius: {
                value: 252.1,
                units: 'km'
              },
              distance: {
                value: 0.00159106543,
                units: 'AU',
              },
              orbital_period: {
                value: 1.375,
                units: 'day',
              },
              rotation_period: {
                value: 0,
                units: 'day',
              },
              tilt: 0,
              color: 0xDADADA
            },
            Iapetus: {
              nameId: 'Iapetus',
              radius: {
                value: 734.5,
                units: 'km'
              },
              distance: {
                value: 0.02380381474,
                units: 'AU',
              },
              orbital_period: {
                value: 79,
                units: 'day',
              },
              rotation_period: {
                value: 0,
                units: 'day',
              },
              tilt: 0,
              color: 0x506855
            },
            Rhea: {
              nameId: 'Rhea',
              radius: {
                value: 763.8,
                units: 'km'
              },
              distance: {
                value: 0.00352277741,
                units: 'AU',
              },
              orbital_period: {
                value: 4.5,
                units: 'day',
              },
              rotation_period: {
                value: 0,
                units: 'day',
              },
              tilt: 0,
              color: 0xDADADA
            },
            Dione: {
              nameId: 'Dione',
              radius: {
                value: 561.4,
                units: 'km'
              },
              distance: {
                value: 0.00252276318,
                units: 'AU',
              },
              orbital_period: {
                value: 2.75,
                units: 'day',
              },
              rotation_period: {
                value: 0,
                units: 'day',
              },
              tilt: 0,
              color: 0xDADADA
            },
            Tethys: {
              nameId: 'Tethys',
              radius: {
                value: 531,
                units: 'km'
              },
              distance: {
                value: 0.0019719532,
                units: 'AU',
              },
              orbital_period: {
                value: 1.875,
                units: 'day',
              },
              rotation_period: {
                value: 0,
                units: 'day',
              },
              tilt: 0,
              color: 0xDADADA
            },
            Mimas: {
              nameId: 'Mimas',
              radius: {
                value: 198.2,
                units: 'km'
              },
              distance: {
                value: 0.0012433332,
                units: 'AU',
              },
              orbital_period: {
                value: 0.96,
                units: 'day',
              },
              rotation_period: {
                value: 0,
                units: 'day',
              },
              tilt: 0,
              color: 0xDADADA
            },
          }
        },
        'Uranus': {
          nameId: 'Uranus',
          radius: {
            value: 25362,
            units: 'km'
          },
          distance: {
            value: 19.2,
            units: 'AU',
          },
          orbital_period: {
            value: 30660,
            units: 'day',
          },
          rotation_period: {
            value: 0.71832,
            units: 'day',
          },
          tilt: 97.77,
          textureMap: 'models/solar-system/textures/2k_uranus.jpg',
          children: {
            Titania: {
              nameId: 'Titania',
              radius: {
                value: 788.4,
                units: 'km'
              },
              distance: {
                value: 0.00291648536,
                units: 'AU',
              },
              orbital_period: {
                value: 8.7,
                units: 'day',
              },
              rotation_period: {
                value: 0,
                units: 'day',
              },
              tilt: 0,
              color: 0xDADADA
            },
            Oberon: {
              nameId: 'Oberon',
              radius: {
                value: 761.4,
                units: 'km'
              },
              distance: {
                value: 0.00390045659,
                units: 'AU',
              },
              orbital_period: {
                value: 13,
                units: 'day',
              },
              rotation_period: {
                value: 0,
                units: 'day',
              },
              tilt: 0,
              color: 0xF9D8F6
            },
            Umbriel: {
              nameId: 'Umbriel',
              radius: {
                value: 584.7,
                units: 'km'
              },
              distance: {
                value: 0.00177810017,
                units: 'AU',
              },
              orbital_period: {
                value: 4.125,
                units: 'day',
              },
              rotation_period: {
                value: 0,
                units: 'day',
              },
              tilt: 0,
              color: 0xDADADA
            },
            Ariel: {
              nameId: 'Ariel',
              radius: {
                value: 578.9,
                units: 'km'
              },
              distance: {
                value: 0.00127608768,
                units: 'AU',
              },
              orbital_period: {
                value: 2.5,
                units: 'day',
              },
              rotation_period: {
                value: 0,
                units: 'day',
              },
              tilt: 0,
              color: 0xDADADA
            },
            Miranda: {
              nameId: 'Miranda',
              radius: {
                value: 235.8,
                units: 'km'
              },
              distance: {
                value: 0.000868327867,
                units: 'AU',
              },
              orbital_period: {
                value: 1.413479,
                units: 'day',
              },
              rotation_period: {
                value: 0,
                units: 'day',
              },
              tilt: 0,
              color: 0xDADADA
            },
          }
        },
        'Neptun': {
          nameId: 'Neptun',
          radius: {
            value: 24622,
            units: 'km'
          },
          distance: {
            value: 30.1,
            units: 'AU',
          },
          orbital_period: {
            value: 165 * 365,
            units: 'day',
          },
          rotation_period: {
            value: 0.67083,
            units: 'day',
          },
          tilt: 28.32,
          textureMap: 'models/solar-system/textures/2k_neptune.jpg',
          children: {
            Triton: {
              nameId: 'Triton',
              radius: {
                value: 1353.4,
                units: 'km'
              },
              distance: {
                value: 0.002371417443,
                units: 'AU',
              },
              orbital_period: {
                value: 5.875,
                units: 'day',
              },
              rotation_period: {
                value: 0,
                units: 'day',
              },
              tilt: 0,
              color: 0xDAB0FF
            },
          }
        }
      }
    },
  },

  loading: true,
  settings: {
    timeSpeed: 1,
    size_scaling_factor: 0.001, // 6371km (637100m) >> 6.378m (0.006378km)
    distance_scaling_factor: 0.000001, // 6371km (637100m) >> 6.378m (0.006378km)
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