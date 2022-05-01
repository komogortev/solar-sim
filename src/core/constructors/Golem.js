import {
  SphereGeometry,
  MeshNormalMaterial,
  Mesh,
  Object3D,
  CameraHelper,
  Raycaster
} from 'three'

const raycaster = new Raycaster()


class Golem {
  constructor(camera, renderer) {
    this.radius = 0.25
    this.widthSegments = 5
    this.heightSegments = 5
    this.camera_ = camera
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
    this.golemMesh.rotation.x += 0.001

    // center of mass
    // sphereMesh.position
    // raycaster.setFromCamera(this.golemMesh.position, this.camera_);
    // var intersects = raycaster.intersectObject(sphereMesh);

    // for (var i = 0; i < intersects.length; i++) {
    //   if (intersects[i].object.name === sphereMesh.name) {
    //     console.log(intersects[i]);
    //     this.golemMesh.position.z = this.golemMesh.position.z - intersects[i].distance
    //   }
    //   /*
    //       An intersection has the following properties :
    //           - object : intersected object (THREE.Mesh)
    //           - distance : distance from camera to intersection (number)
    //           - face : intersected face (THREE.Face3)
    //           - faceIndex : intersected face index (number)
    //           - point : intersection point (THREE.Vector3)
    //           - uv : intersection point in the object's UV coordinates (THREE.Vector2)
    //   */
    // }


    // Act on left click
    // if (dblClickFlag) {
    //   dblClickFlag = false
    //   // find btn mesh connection and switch to its camera
    //   raycaster.setFromCamera(mouse, camera);
    //   // ! avoid intersectObjects undefined object.layer error for OrbitControls in updatables
    //   const eligibleMeshes = updatables.filter(u => u.type === 'Mesh')
    //   const intersection = raycaster.intersectObjects(eligibleMeshes);

    //   for (var i = 0; i < intersection.length; i++) {
    //     if (intersection[i].object && intersection[i].object.name
    //       && intersection[i].object.name.includes(' MeshGroup')) {
    //       const meshSurface = intersection[i].object.scale.x
    //       const cameraOrbitOffset = 2
    //       camera.position.copy(intersection[i].object.position)
    //         .add(new Vector3(0, 0, meshSurface * cameraOrbitOffset));
    //       // camera.lookAt(intersection[i].object.position);
    //       camera.updateProjectionMatrix();
    //       break
    //     }
    //   }
    // } else if (contextClickFlag) {
    //   contextClickFlag = false
    //   // return to default camera on right click
    // }
  }
}

export { Golem }