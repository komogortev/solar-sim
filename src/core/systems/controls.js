import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Raycaster, Vector2, Vector3 } from 'three'

let clickFlag = false
let dblClickFlag = false
let contextClickFlag = false
const raycaster = new Raycaster()
const mouse = new Vector2(1, 1)

function createControls(camera, canvas) {
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  // Forward controls.update to our custom .tick method
  controls.tick = (delta, updatables) => {
    // Act on left click
    if (dblClickFlag) {
      dblClickFlag = false
      // find btn mesh connection and switch to its camera
      raycaster.setFromCamera(mouse, camera);
      // ! avoid intersectObjects undefined object.layer error for OrbitControls in updatables
      const eligibleMeshes = updatables.filter(u => u.type === 'Mesh')
      const intersection = raycaster.intersectObjects(eligibleMeshes);

      if (intersection.length > 0) {
        // find celestial object that has name
        for (var i = 0; i < intersection.length; i++) {
          if (intersection[i].object && intersection[i].object.name
            && intersection[i].object.name.includes(' MeshGroup')) {
            console.log('found touch', intersection[i])
            // var worldPosition = new THREE.Vector3();
            // entityEl.object3D.getWorldPosition(worldPosition);
            const meshSurface = intersection[i].object.scale.x
            const cameraOrbitmultiplier = 2
            controls.saveState();
            controls.target.copy(intersection[i].object.position);

            camera.lookAt(intersection[i].object.position);
            camera.position.copy(intersection[i].object.position).add(new Vector3(0, 0, meshSurface * cameraOrbitmultiplier));
            camera.updateProjectionMatrix()
            break
          }
        }
      }


    } else if (contextClickFlag) {
      contextClickFlag = false
      // return to default camera on right click
      controls.reset();
      //camera.position.set(0,0,100)
      //camera.lookAt(controls.position);
    }

    controls.update();
  }

  document.addEventListener('click', onMouseClick) // Left click
  document.addEventListener('dblclick', onMouseDblClick) // Left, Left, Dbl
  document.addEventListener('contextmenu', onMouseContext) // Right click

  return controls;
}

function onMouseClick(event) {
  if (clickFlag) {
    return event.preventDefault();
  }

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  clickFlag = true
  console.debug('onMouseClick', clickFlag, event, mouse)
}

function onMouseDblClick(event) {
  //event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
  dblClickFlag = true
  console.debug('onMouseDblClick', dblClickFlag, event, mouse)
}

function onMouseContext(event) {
  //event.preventDefault();
  contextClickFlag = true
  console.debug('onMouseContext', event)
}

export { createControls };
