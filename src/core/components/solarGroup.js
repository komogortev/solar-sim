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
import GUI from 'lil-gui';

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
const gui = new GUI();
const loader = new TextureLoader();

function _makeAxisGrid(node, label, units, folder = gui) {
  const helper = new AxisGridHelper(node, units);
  folder.add(helper, 'visible').name(label);
}

function createSolarGroup(updatables) {

  // A group holds other objects but cannot be seen itself
  const group = new Group();
  const geometry = new SphereBufferGeometry(1, 16, 16);

  Object.keys(solarSystemStore.value).forEach(key => {
    const starMesh = decoratePlanetoid(geometry.clone(), getPlanetoidInfo(key))
    group.add(starMesh);
    _makeAxisGrid(starMesh, `${key}`, 10, gui)

    if (solarSystemStore.value[key].children) {
      Object.keys(solarSystemStore.value[key].children).forEach(childKey => {
        const planetMesh = decoratePlanetoid(
          geometry.clone(),
          getPlanetoidInfo(childKey)
        )
        starMesh.add(planetMesh);
        _makeAxisGrid(planetMesh, `${childKey}`, 12, gui)

      if (solarSystemStore.value[key].children[childKey].children) {
        Object.keys(solarSystemStore.value[key].children[childKey].children).forEach(childKey2 => {
          const moonMesh = decoratePlanetoid(
            geometry.clone(),
            getPlanetoidInfo(childKey2),
            planetMesh.scale.x,
          )
          planetMesh.add(moonMesh);
          _makeAxisGrid(moonMesh, `${childKey2}`, 12, gui)
          })
        }
      })
    }
  })

  // every sphere inside the group will be scaled
  // group.scale.multiplyScalar(2);

  // each frame, rotate the entire group of spheres
  group.tick = (delta) => {
    //group.rotation.y -= delta * radiansPerSecond;
  };

  return group;
}

function decoratePlanetoid(geometryClone, data, parentScale) {
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

  const sphereMesh = new Mesh(geometryClone, sphereMaterial);
  sphereMesh.name = `${data.nameId} MeshGroup`
  //sphereMesh.rotation.z = data.tilt
  sphereMesh.position.x = data.distance.value * AppSettings.AU.value * settings.value.distance_scaling_factor

  // Scale mesh by planetoid data factor?
  // Might need to either apply to group or decouple mesh altogether
  const sizeScale = data.radius.value //* settings.value.size_scaling_factor
  sphereMesh.scale.multiplyScalar(sizeScale)

  const radiansPerSecond = convertRotationPerDayToRadians(data.rotation_period.value)

  // each frame, animate sphereMesh
  sphereMesh.tick = (delta) => {
    // rotate planetoid in anticlockwise direction (+=)
    sphereMesh.rotation.y += delta * radiansPerSecond * settings.value.timeSpeed;
  };

  //console.log(sphereMesh.name, 'distance =', sphereMesh.position.x, ', scale =', sphereMesh.scale)

  return sphereMesh;
}

export { createSolarGroup };