import * as THREE from 'three';
import { initScene } from '../shared/bootstrap';

const props = { backgroundColor: 0xaaaaaa };

initScene(props)(({ scene, camera, renderer, orbitControls }) => {
    camera.position.set(-1, 4, 0.5);
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

    // Create a geometry and log it to the console
    const geom = new THREE.BoxGeometry(1, 1, 1);
    console.log('Geometry:', geom);

    // Draw the geometry with separate materials for each group

});
