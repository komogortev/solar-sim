import {
  SphereBufferGeometry,
  Group,
  Object3D,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  MeshPhongMaterial,
  TextureLoader
} from 'three';

import { Planetoid } from '../constructors/Planetoid'
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

function createSolarGroup() {
  // A group holds other objects but cannot be seen itself
  const group = new Group();

  const geometry = new SphereBufferGeometry(1, 16, 16);

  // const material = new MeshStandardMaterial({
  //   color: 'indigo',
  // })
  // const protoSphereMesh = new Mesh(geometry, material);

  // add the protoSphere to the group
  // group.add(protoSphereMesh);

  // create twenty clones of the protoSphereMesh
  // and add each to the group
  // for (let i = 0; i < 21; i++) {
  //   const sphereMeshClone = protoSphereMesh.clone();
  //   // position the spheres on around a circle
  //   sphereMeshClone.position.x = Math.cos(2 * Math.PI * i);
  //   sphereMeshClone.position.y = Math.sin(2 * Math.PI * i);
  //   sphereMeshClone.scale.multiplyScalar(0.01 + i);

  //   {
  //     // ! Mesh AND clonedMesh will turn red
  //     //mesh.material.color.set('red');
  //     // ! Mesh AND clonedMesh will turn blue
  //     //clonedMesh.material.color.set('blue');
  //   }
  //   // decouple mesh material
  //   sphereMeshClone.material = new MeshStandardMaterial({ color: "indigo" });

  //   group.add(sphereMeshClone);
  // }

  Object.keys(solarSystemStore.value).forEach(key => {
    const starGroup = decoratePlanetoid(geometry.clone(), solarSystemStore.value[key])
    group.add(starGroup);

    // const star = new Planetoid(getPlanetoidInfo(key))
    // const description = createMesh(
    //   star,
    //   0,
    //   { width: 1, height: 1 },
    //   gui
    // )
    // description.position.x = star.mesh.scale.x - 1.25
    // description.rotation.x = -.25
    // star.mesh.add(description)

    // solarSystemGroup.add(star.mesh)
    // celestialOjects.push(star.mesh)
    // _makeAxisGrid(star.mesh, `${key}`, 10, f2)

    if (solarSystemStore.value[key].children) {
      Object.keys(solarSystemStore.value[key].children).forEach(childKey => {
        const planetGroup = decoratePlanetoid(
          geometry.clone(),
          solarSystemStore.value[key].children[childKey]
        )
        starGroup.add(planetGroup);

    //     const planet = new Planetoid(getPlanetoidInfo(childKey))
    //     const description = createMesh(
    //       planet,
    //       0,
    //       { width: 1, height: 1 },
    //       gui
    //     )
    //     description.position.x = planet.mesh.scale.x + 1
    //     description.rotation.x = -.25
    //     planet.orbit.add(description)

    //     solarSystemGroup.add(planet.parent)
    //     celestialOjects.push(planet.parent)
    //     celestialOjects.push(planet.orbit)
    //     if (planet.athmosphere) {
    //       celestialOjects.push(planet.athmosphere)
    //     }

    //     _makeAxisGrid(planet.parent, `${childKey} Orbit`, 50, f2)
    //     _makeAxisGrid(planet.orbit, `${childKey}`, 12, f2)

      if (solarSystemStore.value[key].children[childKey].children) {
        Object.keys(solarSystemStore.value[key].children[childKey].children).forEach(childKey2 => {
          const moonGroup = decoratePlanetoid(
            geometry.clone(),
            solarSystemStore.value[key].children[childKey].children[childKey2]
          )
          planetGroup.add(moonGroup);

    //         const moon = new Planetoid(getPlanetoidInfo(childKey2))
    //         const description = createMesh(
    //           moon,
    //           0,
    //           { width: 1, height: 1 },
    //           gui
    //         )
    //         description.position.x = moon.mesh.scale.x + 1
    //         description.rotation.x = -.25
    //         moon.orbit.add(description)

    //         planet.orbit.add(moon.parent)
    //         celestialOjects.push(moon.parent)

    //         _makeAxisGrid(moon.parent, `${childKey2} Orbit`, 50, f2)
    //         _makeAxisGrid(moon.orbit, `${childKey2}`, 12, f2)
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

function decoratePlanetoid(geometryClone, data) {
  // Planetoid node attached to parent at position (0, 0, 0)
  const planetoidGroup = new Group();
  planetoidGroup.name = data.nameId
  // Translate distance from the parent
  //planetoidGroup.rotation.z = data.tilt
  planetoidGroup.position.x = data.distance.value * AppSettings.AU.value * settings.value.distance_scaling_factor

  // 1. Adjust mesh material according to planetoid data
  const sphereMaterial = data.emissive
    ? new MeshStandardMaterial({
      emissive: data.emissive,
      emissiveMap: loader.load(data.emissiveMap),
      emissiveIntensity: 1,
    })
    : new MeshPhongMaterial({
      color: data.color ? data.color : '#ccc',
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

  // Scale mesh by planetoid data factor?
  // Might need to either apply to group or decouple mesh altogether
  const sizeScale = (data.radius.value * settings.value.size_scaling_factor)
  sphereMesh.scale.multiplyScalar(sizeScale)

  const radiansPerSecond = convertRotationPerDayToRadians(data.rotation_period.value)

  // each frame, animate planetoidGroup
  planetoidGroup.tick = (delta) => {
    // rotate planetoid in anticlockwise direction (+=)
    planetoidGroup.rotation.y += delta * radiansPerSecond * settings.value.timeSpeed;
  };

  planetoidGroup.add(sphereMesh)
  console.log(planetoidGroup.name, 'distance =', planetoidGroup.position.x, ', scale =', planetoidGroup.scale)

  return planetoidGroup;
}

export { createSolarGroup };