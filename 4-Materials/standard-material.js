import * as THREE from 'three'
import { bootstrapMaterialScene } from './standard-scene'
import { initializeGuiMeshStandardMaterial } from '../shared/material-controls'

const props = {
    material: new THREE.MeshStandardMaterial({ color: 0x777777 }),
    withMaterialGui: true,
    provideGui: (gui, mesh, material) => {
        initializeGuiMeshStandardMaterial(gui, mesh, material)
    }
}

bootstrapMaterialScene(props).then()
