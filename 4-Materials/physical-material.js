import * as THREE from 'three'
import { bootstrapMaterialScene } from './standard-scene'
import { initializeGuiMeshPhysicalMaterial } from '../shared/material-controls'

const props = {
    material: new THREE.MeshPhysicalMaterial({ color: 0x777777 }),
    withMaterialGui: true,
    provideGui: (gui, mesh, material) => {
        initializeGuiMeshPhysicalMaterial(gui, mesh, material)
    }
}

bootstrapMaterialScene(props).then()
