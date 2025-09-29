import * as THREE from 'three';
import { initScene } from '../shared/bootstrap';
import { initializeRendererControls } from '../shared/renderer-control';

import GUI from 'lil-gui';
import { initializeGuiMaterial, initializeGuiMeshBasicMaterial} from '../shared/material-controls';
import { initializePerspectiveCameraControls } from '../shared/camera-controls';
import { initializeSceneControls } from '../shared/scene-controls';

const props = { backgroundColor: 0xffffff };

const gui = new GUI();

initScene(props)(({ scene, camera, renderer, orbitControls }) => {
    camera.position.set(-3, 8, 2);
    camera.near = 1;
    camera.far = 20;

    camera.updateProjectionMatrix();
    orbitControls.update();

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        orbitControls.update();
    }
    animate();

    const material = new THREE.MeshBasicMaterial({ color: 0xff5555 });
    const geom = new THREE.SphereGeometry(1, 32, 32);
    const mesh = new THREE.Mesh(geom, material);
    mesh.position.y = 1;
    scene.add(mesh);

    initializeRendererControls(gui, renderer);
    initializePerspectiveCameraControls(camera, gui, orbitControls);
    initializeSceneControls(gui, scene, false, false);
    initializeGuiMaterial(gui, mesh, material);
    initializeGuiMeshBasicMaterial(gui, mesh, material);
})
