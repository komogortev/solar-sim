import {
  SphereBufferGeometry,
  Group,
  Object3D,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  MeshPhongMaterial,
  MeshBasicMaterial,
  MeshLambertMaterial,
  TextureLoader,
  SphereGeometry,
  Color
} from 'three';

import { AxisGridHelper } from '../../utils/axis-helper'
import { AppSettings } from '../../globals';
import { convertRotationPerDayToRadians } from '../../utils/helpers';
import useWorldStore from "../../stores/world";

const {
  solarSystemStore,
  settings,
  setTimeSpeed,
  getPlanetoidInfo
} = useWorldStore();
const loader = new TextureLoader();

function createSolarGroup(guiFolder) {
  // A group holds other objects but cannot be seen itself
  const group = new Group();

  Object.keys(solarSystemStore.value).forEach(key => {
    const starMesh = decoratePlanetoid(getPlanetoidInfo(key))
    group.add(starMesh);

    // Create planet meshes
    if (solarSystemStore.value[key].children) {
      Object.keys(solarSystemStore.value[key].children).forEach(childKey => {
        const planetMesh = decoratePlanetoid(
          getPlanetoidInfo(childKey),
          starMesh.scale.x
        )
        group.add(planetMesh);

        // Create moon meshes
        if (solarSystemStore.value[key].children[childKey].children) {
          Object.keys(solarSystemStore.value[key].children[childKey].children).forEach(childKey2 => {
            const moonMesh = decoratePlanetoid(
              getPlanetoidInfo(childKey2),
              planetMesh.scale.x,
            )
            planetMesh.add(moonMesh);
          })
        }
      })
    }
  })

  return group;
}

function decoratePlanetoid(data, parentScale = 0) {
  const geometry = new SphereBufferGeometry(1, 36, 36);
  // 1. Adjust mesh material according to planetoid data
  const sphereMaterial = data.emissive
    ? new MeshPhongMaterial({
      emissive: data.emissive,
      emissiveMap: loader.load(data.emissiveMap),
      emissiveIntensity: 1,
    })
    : new MeshPhongMaterial({
      color: data.color ? new Color(data.color)  : '#fff',
      map: loader.load(data.textureMap),
    })

  if (data.bumpMap) {
    sphereMaterial.bumpMap = loader.load(data.bumpMap)
    sphereMaterial.bumpScale = data.bumpScale
  }

  if (data.specularMap) {
    sphereMaterial.specularMap = loader.load(data.specularMap)
    sphereMaterial.shininess = data.shininess
  }

  const sphereMesh = new Mesh(geometry, sphereMaterial);
  sphereMesh.name = `${data.nameId} MeshGroup`

  // Scale mesh by planetoid data factor?
  // Might need to either apply to group or decouple mesh altogether
  const sizeScale = data.radius.km * settings.value.size_scaling.multiplier
  sphereMesh.scale.multiplyScalar(sizeScale.toFixed(2))

  //sphereMesh.rotation.z = data.tilt
  const distanceMultiplier = AppSettings.AU.km / settings.value.distance_scaling.divider
  const planetDistanceOffset = parentScale > 0 ? parentScale + sphereMesh.scale.x : 0
  sphereMesh.position.x = (data.distance.AU * distanceMultiplier) + planetDistanceOffset



  // geometry = new THREE.SphereGeometry(radius, 100, 50);

  // meshPlanet = new THREE.Mesh(geometry, materialNormalMap);
  // meshPlanet.rotation.y = 0;
  // meshPlanet.rotation.z = tilt;
  // scene.add(meshPlanet);

  // // clouds

  // const materialClouds = new THREE.MeshLambertMaterial({

  //   map: textureLoader.load("textures/planets/earth_clouds_1024.png"),
  //   transparent: true

  // });

  // meshClouds = new THREE.Mesh(geometry, materialClouds);
  // meshClouds.scale.set(cloudsScale, cloudsScale, cloudsScale);
  // meshClouds.rotation.z = tilt;



  const radiansPerSecond = convertRotationPerDayToRadians(data.rotation_period.days)

  // each frame, animate sphereMesh
  sphereMesh.tick = (delta) => {
    // rotate planetoid in anticlockwise direction (+=)
    sphereMesh.rotation.y += delta * radiansPerSecond * settings.value.timeSpeed;
  };

  console.log(sphereMesh.name, 'distance =', sphereMesh.position.x, ', scale =', sphereMesh.scale.x)

  return sphereMesh;
}

export { createSolarGroup };