import { SphereGeometry, MeshNormalMaterial, Mesh, Object3D, CameraHelper } from 'three'



class Golem {
  constructor(renderer) {
    this.radius = 0.25
    this.widthSegments = 5
    this.heightSegments = 5
    this.golemGeometry = new SphereGeometry(
      this.radius, this.widthSegments, this.heightSegments
    );
    this.golemMaterial = new MeshNormalMaterial({
      wireframe: true
    });

    this.golemMesh = new Mesh(this.golemGeometry, this.golemMaterial);
    this.golemMesh.name = 'Golem Mesh'
  }

  get mesh() {
    return this.golemMesh
  }

  tick(delta) {
    this.golemMesh.rotation.x += 0.01
  }
}

export { Golem }