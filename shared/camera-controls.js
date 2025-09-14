import * as THREE from 'three'

const perspectiveName = 'Perspective Camera'
const orthoName = 'Orthographic Camera'

export const initializePerspectiveCameraControls = (camera, gui, orbitControls, isOpen) => {
  const props = {
    fov: camera.fov,
    aspect: camera.aspect,
    near: camera.near,
    far: camera.far,
    zoom: camera.zoom
  }

  removeIfPresent(gui, perspectiveName)
  removeIfPresent(gui, orthoName)

  const cameraFolder = gui.addFolder(perspectiveName)
  cameraFolder.add(props, 'fov', 25, 180, 1)
  cameraFolder.add(props, 'aspect', 0.1, 10, 0.1)
  cameraFolder.add(props, 'near', 0, 20, 0.1)
  cameraFolder.add(props, 'far', 5, 100, 0.1)
  cameraFolder.add(props, 'zoom', -1, 10, 0.1)

  cameraFolder.onChange(() => {
    camera.fov = props.fov
    camera.aspect = props.aspect
    camera.near = props.near
    camera.far = props.far
    camera.zoom = props.zoom
    camera.updateProjectionMatrix()

    camera.lookAt(new THREE.Vector3(0, 0, 0))
    orbitControls.target.set(0, 0, 0)
    orbitControls.update()
  })

  isOpen ? cameraFolder.open() : cameraFolder.close()
}

export const initializeOrthographicCameraControls = (camera, gui, orbitControls) => {
  const props = {
    left: camera.left,
    right: camera.right,
    top: camera.top,
    bottom: camera.bottom,
    near: camera.near,
    far: camera.far,
    zoom: camera.zoom
  }

  removeIfPresent(gui, perspectiveName)
  removeIfPresent(gui, orthoName)

  const cameraFolder = gui.addFolder(orthoName)
  cameraFolder.add(props, 'left', -100, 100, 1)
  cameraFolder.add(props, 'right', -100, 100, 1)
  cameraFolder.add(props, 'top', -100, 100, 1)
  cameraFolder.add(props, 'bottom', -100, 100, 1)
  cameraFolder.add(props, 'near', -20, 10, 1)
  cameraFolder.add(props, 'far', 1, 100, 1)
  cameraFolder.add(props, 'zoom', 1, 100, 1)

  cameraFolder.onChange(() => {
    camera.left = props.left
    camera.right = props.right
    camera.top = props.top
    camera.bottom = props.bottom
    camera.near = props.near
    camera.far = props.far
    camera.zoom = props.zoom
    camera.updateProjectionMatrix()

    camera.lookAt(new THREE.Vector3(0, 0, 0))
    orbitControls.target.set(0, 0, 0)
    orbitControls.update()
  })
}

function removeIfPresent(gui, name) {
  for (const folder of gui.foldersRecursive()) {
    if (folder._title === name) {
      folder.destroy()
    }
  }
}
