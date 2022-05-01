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
   MeshNormalMaterial,
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
  const geometry = new SphereBufferGeometry(1, 36, 36);

  Object.keys(solarSystemStore.value).forEach(key => {
    const starMesh = decoratePlanetoid(geometry, getPlanetoidInfo(key))
    group.add(starMesh);

    // Create planet meshes
    if (solarSystemStore.value[key].children) {
      Object.keys(solarSystemStore.value[key].children).forEach(childKey => {
        const planetMesh = decoratePlanetoid(
          geometry,
          getPlanetoidInfo(childKey),
          starMesh.scale.x
        )
        group.add(planetMesh);

        // Create moon meshes
        if (solarSystemStore.value[key].children[childKey].children) {
          Object.keys(solarSystemStore.value[key].children[childKey].children).forEach(childKey2 => {
            const moonMesh = decoratePlanetoid(
              geometry,
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

function decoratePlanetoid(geometry, data, parentScale = 0) {
  // 1. Create material according to planetoid data
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
// 1. Create sphere mesh
  const sphereMesh = new Mesh(geometry, sphereMaterial);
  sphereMesh.name = `${data.nameId} MeshGroup`

  // Scale mesh by planetoid data factor?
  // Might need to either apply to group or decouple mesh altogether
  const Radius = (data.radius.km * settings.value.size_scaling.multiplier)
  sphereMesh.scale.multiplyScalar(Radius)
  sphereMesh.rotation.z = data.tilt

  const distanceMultiplier = AppSettings.AU.km / settings.value.distance_scaling.divider
  const planetDistanceOffset = parentScale > 0 ? parentScale + sphereMesh.scale.x : 0
  sphereMesh.position.x = (data.distance.AU * distanceMultiplier) + planetDistanceOffset

  // Generate POI
  if (data.POI) {
    const poiGeometry = new SphereBufferGeometry(0.015, 6, 6);
    const poiMaterial = new MeshBasicMaterial({ color: 0xff0000 });

    data.POI.forEach(poi => {
      let poiMesh = new Mesh(poiGeometry, poiMaterial);
      poiMesh.name = poi.name
      console.log(poi)
      // divide angle by 180deg and multiplay by Math.PI to get radians
      const latRadiants = poi.lat * Math.PI / 180;
      const lngRadiants = poi.lng * Math.PI / 180;
      const x = Radius * Math.cos(-lngRadiants) * Math.sin(latRadiants);
      const y = Radius * Math.sin(lngRadiants) * Math.sin(latRadiants);
      const z = Math.cos(latRadiants);
      const zOffset = z + 0.2124
      poiMesh.position.set(x, y, zOffset);
      sphereMesh.add(poiMesh);
    });
  }

  // /!\ radiants = degrees * (2 * Math.PI)
  const radiansPerSecond = convertRotationPerDayToRadians(data.rotation_period.days)

  //Generate athmosphere
  if (data.athmosphereMap) {
    geometry = new SphereGeometry(Radius + 0.8, 50, 50);
    const materialClouds = new MeshBasicMaterial({
      map: loader.load(data.athmosphereMap),
      transparent: true,
      opacity: 0.45,
    });
    const meshClouds = new Mesh(geometry, materialClouds);
    meshClouds.name = 'Athmosphere Map';
    meshClouds.scale.set(sphereMesh.scale.x + 0.1, sphereMesh.scale.y + 0.1, sphereMesh.scale.z + 0.1);
    meshClouds.position.set(0,0,0);
    meshClouds.rotation.z = data.tilt;
    meshClouds.tick = (delta) => {
      // rotate planetoid in anticlockwise direction (+=)
      meshClouds.rotation.y += delta * radiansPerSecond * settings.value.timeSpeed;
    };
    sphereMesh.add(meshClouds);
  }
  console.log(sphereMesh)
  // each frame, animate sphereMesh
  sphereMesh.tick = (delta) => {
    // rotate planetoid in anticlockwise direction (+=)
    sphereMesh.rotation.y += delta * radiansPerSecond * settings.value.timeSpeed;
  };

  console.log(sphereMesh.name, 'distance =', sphereMesh.position.x, ', scale =', sphereMesh.scale.x)

  return sphereMesh;
}

export { createSolarGroup };