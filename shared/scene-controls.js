import * as THREE from 'three'
import equirectangular from '../assets/equi.jpg'
import background from '../assets/textures/wood/abstract-antique-backdrop-164005.jpg'

const textureLoader = new THREE.TextureLoader()

const propertiesObject = (scene) => ({
  overrideMaterial: {
    toggle: () => {
      if (scene.overrideMaterial !== null) {
        scene.overrideMaterial = null
      } else {
        scene.overrideMaterial = new THREE.MeshNormalMaterial()
      }
    }
  },
  background: 'White',
  environment: {
    toggle: () => {
      if (scene.environment !== null) {
        scene.environment = null
      } else {
        textureLoader.load(equirectangular, (loaded) => {
          loaded.mapping = THREE.EquirectangularReflectionMapping
          scene.environment = loaded
        })
      }
    }
  }
})

const fogProperties = (fog) => ({
  color: 0xffffff,
  near: fog.near,
  far: fog.far
})

export const initializeSceneControls = (gui, scene, fogEnabled, isOpen) => {
  const props = propertiesObject(scene)
  const sceneControls = gui.addFolder('Scene')

  sceneControls
    .add(props, 'background', ['White', 'Black', 'null', 'Color', 'Texture', 'Cubemap'])
    .onChange((event) => handleBackgroundChange(event, scene))
  sceneControls.add(props.overrideMaterial, 'toggle').name('Toggle Override Material')
  sceneControls.add(props.environment, 'toggle').name('Toggle Environment')

  if (fogEnabled) {
    const fogColor = new THREE.Color(0xffffff)
    const fog = new THREE.Fog(fogColor, 1, 20)
    scene.fog = fog
    const fogProps = fogProperties(fog)
    const fogControls = sceneControls.addFolder('Fog')
    fogControls.addColor(fogProps, 'color')
    fogControls.add(fogProps, 'near', 0, 10, 0.1)
    fogControls.add(fogProps, 'far', 0, 100, 0.1)

    fogControls.onChange(() => {
      fog.color = fogColor.setHex(fogProps.color)
      fog.near = fogProps.near
      fog.far = fogProps.far
    })
  }

  isOpen ? sceneControls.open() : sceneControls.close()
}

function handleBackgroundChange(setting, scene) {
  switch (setting) {
  case 'White':
    scene.background = new THREE.Color(0xffffff)
    break
  case 'Black':
    scene.background = new THREE.Color(0x000000)
    break
  case 'null':
    scene.background = null
    break
  case 'Color':
    scene.background = new THREE.Color(0x44ff44)
    break
  case 'Texture':
    textureLoader.load(background, (loaded) => {
      loaded.colorSpace = THREE.SRGBColorSpace
      scene.background = loaded
      scene.environment = null
    })
    break
  case 'Cubemap':
    textureLoader.load(equirectangular, (loaded) => {
      loaded.mapping = THREE.EquirectangularReflectionMapping
      scene.background = loaded
      scene.environment = loaded
    })

    break
  default:
    break
  }
}
