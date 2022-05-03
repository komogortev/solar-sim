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
  Color,
  Raycaster,
  EllipseCurve
} from 'three';

import { AxisGridHelper } from '../../utils/axis-helper'
import { AppSettings } from '../../globals';
import { convertRotationPerDayToRadians, calcPosFromLatLngRad } from '../../utils/helpers';
import useWorldStore from "../../stores/world";

const raycaster = new Raycaster()

const {
  solarSystemStore,
  settings,
  setTimeSpeed,
  getPlanetoidInfo
} = useWorldStore();
const loader = new TextureLoader();

function createSolarGroup(camera) {
  // A group holds other objects but cannot be seen itself
  const group = new Group();
  const geometry = new SphereBufferGeometry(1, 132, 132);

  Object.keys(solarSystemStore.value).forEach(key => {
    const starMesh = decoratePlanetoid(geometry, getPlanetoidInfo(key))
    group.add(starMesh);

    // Create planet meshes
    if (solarSystemStore.value[key].children) {
      Object.keys(solarSystemStore.value[key].children).forEach(childKey => {
        const planetMesh = decoratePlanetoid(
          geometry,
          getPlanetoidInfo(childKey),
          starMesh.scale.x,
          camera
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

function decoratePlanetoid(geometry, data, parentScale = 0, camera) {
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

  if (data.displacementMap) {
    sphereMaterial.displacementMap = loader.load(data.displacementMap)
    sphereMaterial.displacementScale = data.displacementScale
    // sphereMaterial.wireframe = true;
  }

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
  sphereMesh.scale.multiplyScalar(data.radius.km * settings.value.size_scaling.multiplier)
  // sphereMesh.rotation.z = data.tilt

  const planetDistanceOffset = parentScale > 0
    ? ((parentScale + sphereMesh.scale.x) * 2)
    : 0
  const distanceInKm = data.distance.AU * AppSettings.AU.km
  sphereMesh.position.x = (distanceInKm + planetDistanceOffset) / settings.value.distance_scaling.divider

  // /!\ radiants = degrees * (2 * Math.PI)
  const radiansPerSecond = convertRotationPerDayToRadians(data.rotation_period.days)

  //Generate athmosphere
  if (data.athmosphereMap) {
    const materialClouds = new MeshBasicMaterial({
      map: loader.load(data.athmosphereMap),
      transparent: true,
      opacity: data.athmosphereOpacity,
    });
    const athmosphereMesh = new Mesh(geometry, materialClouds);
    athmosphereMesh.name = 'Athmosphere Map';
    //athmosphereMesh.scale.set(sphereMesh.scale.x + 0.1, sphereMesh.scale.y + 0.1, sphereMesh.scale.z + 0.1);
    athmosphereMesh.scale.multiplyScalar(
      sphereMesh.scale.x + data.athmosphereDepth
    );
    athmosphereMesh.position.set(0, 0, 0);
    athmosphereMesh.rotation.z = data.tilt;
    athmosphereMesh.tick = (delta) => {
      // rotate planetoid in anticlockwise direction (+=)
      athmosphereMesh.rotation.y += delta * radiansPerSecond * settings.value.timeSpeed;
    };
    sphereMesh.add(athmosphereMesh);
  }

  // Generate POI
  if (data.POI) {
    const poiGeometry = new SphereBufferGeometry(0.005, 6, 6);
    const poiMaterial = new MeshBasicMaterial({ color: 0xff0000 });

    data.POI.forEach(poi => {
      let poiMesh = new Mesh(poiGeometry, poiMaterial);
      poiMesh.name = 'POI'
      poiMesh.title = poi.name

      const cartPos = calcPosFromLatLngRad(
        poi.lat,
        poi.lng,
        (data.radius.km * settings.value.size_scaling.multiplier) + 0.375
      );
      poiMesh.position.set(cartPos.x, cartPos.y, cartPos.z);

      sphereMesh.add(poiMesh);
    });
  }

  // each frame, animate sphereMesh
  sphereMesh.tick = (delta) => {
    // rotate planetoid in anticlockwise direction (+=)
    sphereMesh.rotation.y += delta * radiansPerSecond * settings.value.timeSpeed;
  };

  return sphereMesh;
}

const curve = new EllipseCurve()


export { createSolarGroup };