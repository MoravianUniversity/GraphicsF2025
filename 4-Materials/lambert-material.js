import * as THREE from 'three'
import { bootstrapMaterialScene } from './standard-scene'
import { initializeGuiMeshLambertMaterial } from '../shared/material-controls'

const props = {
    material: new THREE.MeshLambertMaterial({ color: 0x777777 }),
    withMaterialGui: true,
    provideGui: (gui, mesh, material) => {
        initializeGuiMeshLambertMaterial(gui, mesh, material);
    }
};

bootstrapMaterialScene(props).then();
