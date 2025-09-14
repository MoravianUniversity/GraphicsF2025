import * as THREE from "three";
import GUI from "lil-gui";
import { initScene } from "../shared/bootstrap.js";
import { floatingFloor } from "../shared/floor.js";
import { initializeRendererControls } from "../shared/renderer-control.js";
import { initializeHelperControls } from "../shared/helpers-control.js";
import { initializeSceneControls } from "../shared/scene-controls.js";
import { initializePerspectiveCameraControls } from "../shared/camera-controls.js";
import { stats } from "../shared/stats.js";

const addCube = (scene) => {
    const cubeGeom = new THREE.BoxGeometry(1, 1, 1);
    const cubeMat = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
    });
    const mesh = new THREE.Mesh(cubeGeom, cubeMat);
    mesh.castShadow = true;
    scene.add(mesh);
};

const externalCamera = () => {
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );

    // opposite of normally positioned camera
    camera.position.set(10, 2, -3);
    camera.lookAt(0, 0, 0);

    return camera;
};

initScene({backgroundColor: 0xcccccc})(({ scene, camera, renderer, orbitControls }) => {
    camera.far = 100;
    camera.position.set(-7, 2, 5);
    orbitControls.update();

    const helper = new THREE.CameraHelper(camera);
    scene.add(helper);

    const gui = new GUI();
    initializePerspectiveCameraControls(camera, gui, orbitControls);
    initializeLookAtControls(camera, gui, orbitControls);

    floatingFloor(scene, 10);
    const newCamera = externalCamera();

    let renderWith = newCamera;

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, renderWith);
        stats.update();
        helper.update();
        orbitControls.update();
    }
    animate();

    initializeRendererControls(gui, renderer);
    initializeHelperControls(gui, scene);
    initializeSceneControls(gui, scene, true);

    gui.add(
        { switchCamera: () => { renderWith = renderWith === newCamera ? camera : newCamera; } },
        "switchCamera"
    );

    addCube(scene);
});

function initializeLookAtControls(camera, gui, orbitControls) {
    const folder = gui.addFolder("Look At");
    const props = {
        lookAtX: 0, lookAtY: 0, lookAtZ: 0,
        upX: 0, upY: 1, upZ: 0,
    };

    folder.add(props, "lookAtX", -10, 10, 0.1);
    folder.add(props, "lookAtY", -10, 10, 0.1);
    folder.add(props, "lookAtZ", -10, 10, 0.1);
    folder.add(props, "upX", -1, 1, 0.1);
    folder.add(props, "upY", -1, 1, 0.1);
    folder.add(props, "upZ", -1, 1, 0.1);

    folder.onChange(() => {
        camera.up.set(props.upX, props.upY, props.upZ);
        camera.lookAt(props.lookAtX, props.lookAtY, props.lookAtZ);
        orbitControls.target.set(props.lookAtX, props.lookAtY, props.lookAtZ);
        orbitControls.update();
    });
}
