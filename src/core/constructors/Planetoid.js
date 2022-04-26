import {
  Group,
  Object3D,
  Mesh,
  MeshPhongMaterial,
  MeshStandardMaterial,
  SphereGeometry,
  TextureLoader
} from 'three'

let loader

class Planetoid {
  constructor(planetoidInfo = {}) {
    loader = new TextureLoader();
    this.radius = 1
    this.widthSegments = 24
    this.heightSegments = 24
    this.sphereGeometry = new SphereGeometry(
      this.radius, this.widthSegments, this.heightSegments
    )

    if (planetoidInfo.emissive) {
      // Internal glow
      this.planetoidMaterial = new MeshStandardMaterial({
        emissive: planetoidInfo.emissive,
        emissiveMap: this.loader.load(planetoidInfo.emissiveMap),
        emissiveIntensity: 1,
      });
    } else {
      this.planetoidMaterial = new MeshPhongMaterial({
        color: planetoidInfo.color ? planetoidInfo.color : '#ccc',
        map: this.loader.load(planetoidInfo.textureMap),
      });
    }

    if (planetoidInfo.bumpMap) {
      this.planetoidMaterial.bumpMap = this.loader.load(planetoidInfo.bumpMap)
      this.planetoidMaterial.bumpScale = planetoidInfo.bumpScale
    }

    if (planetoidInfo.specularMap) {
      this.planetoidMaterial.specularMap = this.loader.load(planetoidInfo.specularMap)
      this.planetoidMaterial.shininess = planetoidInfo.shininess
    }

    this.planetoidOrbit = new Object3D();
    this.planetoidOrbit.name = planetoidInfo.nameId
    this.planetoidOrbit.position.x = planetoidInfo.distance * 20 //Distance from parent

    this.planetoidMesh = new Mesh(this.sphereGeometry, this.planetoidMaterial);
    this.planetoidMesh.name = `${planetoidInfo.nameId} Mesh`
    this.planetoidMesh.planetoidInfo = planetoidInfo
    this.planetoidOrbit.rotation_period = planetoidInfo.rotation_period
    this.planetoidMesh.scale.set(
        planetoidInfo.scale,
        planetoidInfo.scale,
        planetoidInfo.scale,
      );

    this.planetoidParentOrbit = new Object3D();
    this.planetoidParentOrbit.name = `${planetoidInfo.nameId} Orbit`
    this.planetoidParentOrbit.orbital_period = planetoidInfo.orbital_period
    this.planetoidParentOrbit.add(this.planetoidOrbit)

    this.planetoidOrbit.add(this.planetoidMesh)

    // Create Athmosphere
    if (planetoidInfo.athmosphereMap) {
      this.athmosphereGroup = new Group();
      this.athmosphereGroup.name = 'Athmosphere node';

      this.athmosphereGeometry = new SphereGeometry(
        this.radius + planetoidInfo.athmosphereDepth, 50, 50
      )
      this.athmosphereMaterial = new MeshPhongMaterial({
        map: 'models/solar-system/textures/earth/8k_earth_clouds.jpg',
        transparent: true,
        opacity: 0.25
      });
      this.planetoidAthmosphereMesh = new Mesh(this.athmosphereGeometry, this.athmosphereMaterial);
      this.planetoidAthmosphereMesh.rotation.z = planetoidInfo.tilt
      this.athmosphereGroup.add(this.planetoidAthmosphereMesh)
      this.planetoidOrbit.add(this.athmosphereGroup)
    }
  }
  get camera() {
    //return this.golemCamera
  }
  get parent() {
    return this.planetoidParentOrbit
  }
  get orbit() {
    return this.planetoidOrbit
  }
  get athmosphere() {
    return this.planetoidAthmosphereMesh || null
  }
  get mesh() {
    return this.planetoidMesh
  }
  set visible(v) {
    // this._visible = v;
    // this.grid.visible = v;
    // this.axes.visible = v;
  }
}

export { Planetoid }