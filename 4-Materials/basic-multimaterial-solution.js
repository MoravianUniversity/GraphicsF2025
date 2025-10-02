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
    const geom = new THREE.DodecahedronGeometry(10);
    console.log('Geometry:', geom);

    // Draw the geometry with separate materials for each group
    const mat1 = new THREE.MeshBasicMaterial({color: 0xff0000});
    const mat2 = new THREE.MeshBasicMaterial({color: 0xaa6600});
    const mat3 = new THREE.MeshBasicMaterial({color: 0x008800});
    const mat4 = new THREE.MeshBasicMaterial({color: 0x008888});
    const mat5 = new THREE.MeshBasicMaterial({color: 0x000088});
    const mat6 = new THREE.MeshBasicMaterial({color: 0xffff00});

    // Check if the geometry has groups defined (can be pass an array of materials or a single material?)
    const hasNoGroups = geom.groups.length === 0;
    let mesh;
    if (hasNoGroups) {
        mesh = new THREE.Mesh(geom, mat1);
    } else {
        const material = [mat1, mat2, mat3, mat4, mat5, mat6];
        mesh = new THREE.Mesh(geom, material);
    }
    scene.add(mesh);
});
