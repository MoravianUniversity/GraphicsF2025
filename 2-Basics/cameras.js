import * as THREE from 'three'
import GUI from 'lil-gui'
import { initScene } from '../shared/bootstrap.js'
import { initOrbitControls } from '../shared/orbit-controller.js'
import { floatingFloor } from '../shared/floor.js'
import { initializeRendererControls } from '../shared/renderer-control.js'
import { initializeHelperControls } from '../shared/helpers-control.js'
import { initializeSceneControls } from '../shared/scene-controls.js'
import {
    initializeOrthographicCameraControls,
    initializePerspectiveCameraControls
} from '../shared/camera-controls.js'
import { stats } from '../shared/stats.js'

const props = { backgroundColor: 0xffffff };
const gui = new GUI();

const addCubes = (scene) => {
    const size = 0.9;
    const cubeGeometry = new THREE.BoxGeometry(size, size, size);

    for (let j = 0; j < 10; j++) {
        for (let i = 0; i < 10; i++) {
            const rnd = Math.random() * 0.75 + 0.25;
            const cubeMaterial = new THREE.MeshLambertMaterial();
            cubeMaterial.color =
                j === 0 && i === 0 ? new THREE.Color(1, 1, 0.25) : new THREE.Color(rnd, 0, 0);
            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

            cube.position.z = -10 + 1 + j + 3.5;
            cube.position.x = -10 + 1 + i + 4.5;
            cube.position.y = -2;

            scene.add(cube);
        }
    }
}

initScene(props)(({ scene, camera, renderer }) => {
    camera.position.set(-2, 2, 5);
    camera.lookAt(scene);

    let updatedOrbitControls = initOrbitControls(camera, renderer);

    floatingFloor(scene, 10);

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        stats.update();

        updatedOrbitControls.update();
    }
    animate();
    addCubes(scene);

    initializeRendererControls(gui, renderer);
    initializeHelperControls(gui, scene);
    initializeSceneControls(gui, scene);

    const perspectiveProps = new (function () {
        this.perspective = 'Perspective';
        this.switchCamera = function () {
            if (camera instanceof THREE.PerspectiveCamera) {
                camera = new THREE.OrthographicCamera(-10, 10, 10, -10, -5, 20);
                camera.position.set(-2, 2, 2);
                camera.updateProjectionMatrix();
                updatedOrbitControls = initOrbitControls(camera, renderer);
                this.perspective = 'Orthographic';
                initializeOrthographicCameraControls(camera, gui, updatedOrbitControls);
                updatedOrbitControls.update();
            } else {
                camera = new THREE.PerspectiveCamera(75, 1, 0.1, 100);
                camera.position.set(-8, 8, 8);
                camera.updateProjectionMatrix();
                this.perspective = 'Perspective';
                updatedOrbitControls = initOrbitControls(camera, renderer);
                initializePerspectiveCameraControls(camera, gui, updatedOrbitControls);
                updatedOrbitControls.update();
            }
        }
    })();

    gui.add(perspectiveProps, 'switchCamera');
    gui.add(perspectiveProps, 'perspective').listen();
    initializePerspectiveCameraControls(camera, gui, updatedOrbitControls);
    perspectiveProps.switchCamera();
});
