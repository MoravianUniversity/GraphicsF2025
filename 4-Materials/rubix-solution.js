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

    // Create the overall box
    const big = new THREE.BoxGeometry(3, 3, 3);
    scene.add(new THREE.Mesh(big, new THREE.MeshBasicMaterial({ color: 0x000000 })));

    // Make the reusable parts
    const cube = new THREE.BoxGeometry(1, 1, 1);
    const red = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const orange = new THREE.MeshBasicMaterial({ color: 0xff6400 });
    const yellow = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const green = new THREE.MeshBasicMaterial({ color: 0x00bb00 });
    const blue = new THREE.MeshBasicMaterial({ color: 0x0000bb });
    const white = new THREE.MeshBasicMaterial({ color: 0xbb00bb });
    const black = new THREE.MeshBasicMaterial({ color: 0x000000 });

    // Create the smaller cubes
    const cubes = [];
    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            for (let z = -1; z <= 1; z++) {
                const materials = [black, black, black, black, black, black];
                if (x === 1) materials[0] = red;
                if (x === -1) materials[1] = orange;
                if (y === 1) materials[2] = yellow;
                if (y === -1) materials[3] = green;
                if (z === 1) materials[4] = blue;
                if (z === -1) materials[5] = white;

                const cubeMesh = new THREE.Mesh(cube, materials);
                cubeMesh.position.set(x*1.05, y*1.05, z*1.05);
                cubes.push(cubeMesh);
                scene.add(cubeMesh);
            }
        }
    }
});
