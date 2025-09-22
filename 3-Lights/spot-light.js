import * as THREE from 'three'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { initScene } from '../shared/bootstrap.js'
import { initializeRendererControls } from '../shared/renderer-control.js'
import { stats } from '../shared/stats'

const gui = new GUI();
const props = {
    backgroundColor: 0xcccccc,
    disableLights: true // turn off default lights in the scene
};
initScene(props)(({ scene, camera, renderer, orbitControls }) => {
    renderer.shadowMap.type = THREE.PCFShadowMap; // default shadow map
    camera.position.set(-4, 14, 4);
    orbitControls.update();

    loadWaterfall(scene);

    const spotLight = new THREE.SpotLight();
    const spotLightHelper = new THREE.SpotLightHelper(spotLight);
    const shadowCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
    spotLightHelper.visible = false;
    shadowCameraHelper.visible = false;
    scene.add(spotLightHelper);
    scene.add(shadowCameraHelper);

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        stats.update();
        spotLightHelper.update();
        shadowCameraHelper.update();
        orbitControls.update();
        spotLight.shadow.camera.updateProjectionMatrix();
        spotLight.shadow.camera.matrixWorldNeedsUpdate = true;
    }

    const colorHolder = new THREE.Color(0xffffff);
    const light = new THREE.AmbientLight(0x222222);
    scene.add(light);
    scene.add(spotLight.target);

    spotLight.position.set(10, 14, 5);
    spotLight.intensity = 200;
    spotLight.distance = 0; // infinite
    spotLight.decay = 2;
    spotLight.angle = Math.PI / 3;
    spotLight.penumbra = 0.4;
    spotLight.castShadow = true;

    spotLight.shadow.camera.near = 10;
    spotLight.shadow.camera.far = 25;
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    spotLight.shadow.bias = -0.01;
    spotLight.shadow.radius = 0;
    spotLight.shadow.blurSamples = 0;

    const spotLightFolder = gui.addFolder('Spot Light');
    spotLightFolder.addColor({color: colorHolder.getStyle()}, 'color').onChange((c) => spotLight.color.setStyle(c));
    spotLightFolder.add(spotLight, 'intensity', 0, 250, 0.1);
    spotLightFolder.add(spotLight, 'distance', 0, 100, 0.1);
    let fovControl;
    const angleControl = spotLightFolder.add(spotLight, 'angle', 0, Math.PI / 2, 0.01).onChange(() => fovControl.updateDisplay());
    spotLightFolder.add(spotLight, 'decay', 0, 5, 0.01);
    spotLightFolder.add(spotLight, 'penumbra', 0, 1, 0.01);
    spotLightFolder.add(spotLight.position, 'x', -30, 30, 0.1).name('positionX');
    spotLightFolder.add(spotLight.position, 'y', -30, 30, 0.1).name('positionY');
    spotLightFolder.add(spotLight.position, 'z', -30, 30, 0.1).name('positionZ');
    spotLightFolder.add(spotLight.target.position, 'x', -30, 30, 0.1).name('targetX');
    spotLightFolder.add(spotLight.target.position, 'y', -30, 30, 0.1).name('targetY');
    spotLightFolder.add(spotLight.target.position, 'z', -30, 30, 0.1).name('targetZ');

    spotLightFolder.add(spotLight, 'castShadow');
    spotLightFolder.add(spotLightHelper, 'visible').name('spotlight-helper');

    const shadowCameraFolder = gui.addFolder('Shadow Camera');
    shadowCameraFolder.add(shadowCameraHelper, 'visible').name('shadow-helper');
    fovControl = shadowCameraFolder.add(spotLight.shadow.camera, 'fov', 0, 180, 0.1).onChange(() => { angleControl.updateDisplay(); });
    shadowCameraFolder.add(spotLight.shadow.camera, 'far', 0, 100, 0.1);
    shadowCameraFolder.add(spotLight.shadow.camera, 'near', 0, 20, 0.1);
    shadowCameraFolder.add(spotLight.shadow, 'radius', 0, 20, 0.1);
    shadowCameraFolder.add(spotLight.shadow, 'blurSamples', 0, 20, 1);

    scene.add(spotLight);

    initializeRendererControls(gui, renderer);

    animate();
})

function loadWaterfall(scene) {
    const loader = new GLTFLoader();
    loader.load('/assets/gltf/waterfall/scene.gltf', (loadedObject) => {
        const loadedScene = loadedObject.scene.children[0].children[0].children[0];
        loadedScene.traverseVisible((c) => {
            c.receiveShadow = true;
            c.castShadow = true;
        });
        loadedScene.rotateX(-0.5 * Math.PI);
        scene.add(loadedScene);
    });
}
