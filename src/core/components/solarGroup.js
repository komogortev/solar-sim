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
  SphereGeometry
} from 'three';

import { AxisGridHelper } from '../../utils/axis-helper'
import { AppSettings } from '../../globals';
import { convertRotationPerDayToRadians } from '../../utils/helpers';
import useWorldStore from "../../store/world";

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
    const info = getPlanetoidInfo(key)
    const starMesh = decoratePlanetoid(info)
    group.add(starMesh);

    // Create planet meshes
    if (solarSystemStore.value[key].children) {
      Object.keys(solarSystemStore.value[key].children).forEach(childKey => {
        const planetMesh = decoratePlanetoid(
          getPlanetoidInfo(childKey)
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

function decoratePlanetoid(data, parentScale) {
  const geometry = new SphereBufferGeometry(1, 16, 16);
  // 1. Adjust mesh material according to planetoid data
  const sphereMaterial = data.emissive
    ? new MeshPhongMaterial({
      emissive: data.emissive,
      emissiveMap: loader.load(data.emissiveMap),
      emissiveIntensity: 1,
    })
    : new MeshPhongMaterial({
      color: data.color ? data.color : '#fff',
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
  //sphereMesh.rotation.z = data.tilt
  sphereMesh.position.x = (data.distance.AU * AppSettings.AU.km * settings.value.distance_scaling_factor).toFixed(2)

  // Scale mesh by planetoid data factor?
  // Might need to either apply to group or decouple mesh altogether
  const sizeScale = data.radius.km //* settings.value.size_scaling_factor
  sphereMesh.scale.multiplyScalar(sizeScale)

  const radiansPerSecond = convertRotationPerDayToRadians(data.rotation_period.days)

  // each frame, animate sphereMesh
  sphereMesh.tick = (delta) => {
    // rotate planetoid in anticlockwise direction (+=)
    sphereMesh.rotation.y += delta * radiansPerSecond * settings.value.timeSpeed;
  };

  //console.log(sphereMesh.name, 'distance =', sphereMesh.position.x, ', scale =', sphereMesh.scale)

  return sphereMesh;
}

export { createSolarGroup };