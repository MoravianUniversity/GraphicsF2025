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
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    camera.position.set(-4, 14, 4);
    orbitControls.update();

    loadWaterfall(scene);

    const directionalLight = new THREE.DirectionalLight();
    const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
    const shadowCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
    scene.add(directionalLightHelper);
    scene.add(shadowCameraHelper);

    directionalLightHelper.visible = false;
    shadowCameraHelper.visible = false;

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        stats.update();
        directionalLightHelper.update();
        orbitControls.update();
        shadowCameraHelper.update();
        directionalLight.shadow.camera.updateProjectionMatrix();
    }

    const colorHolder = new THREE.Color(0xffffff);
    const light = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(light);
    scene.add(directionalLight.target);

    directionalLight.position.set(10, 14, 5);
    directionalLight.intensity = 1;
    directionalLight.distance = 0;

    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 25;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    directionalLight.shadow.mapSize.width = 2048;  // must be power of 2, typically at most 4096
    directionalLight.shadow.mapSize.height = 2048;  // must be power of 2, typically at most 4096
    directionalLight.shadow.bias = -0.01;

    const directionalLightFolder = gui.addFolder('Directional Light');
    directionalLightFolder.addColor({color: colorHolder.getStyle()}, 'color').onChange((c) => directionalLight.color.setStyle(c));
    directionalLightFolder.add(directionalLight, 'intensity', 0, 5, 0.1);
    directionalLightFolder.add(directionalLight.position, 'x', -30, 30, 0.1).name('positionX');
    directionalLightFolder.add(directionalLight.position, 'y', -30, 30, 0.1).name('positionY');
    directionalLightFolder.add(directionalLight.position, 'z', -30, 30, 0.1).name('positionZ');
    directionalLightFolder.add(directionalLight.target.position, 'x', -30, 30, 0.1).name('targetX');
    directionalLightFolder.add(directionalLight.target.position, 'y', -30, 30, 0.1).name('targetY');
    directionalLightFolder.add(directionalLight.target.position, 'z', -30, 30, 0.1).name('targetZ');

    directionalLightFolder.add(directionalLight, 'castShadow');
    directionalLightFolder.add(directionalLightHelper, 'visible').name('directional-light-helper');

    const shadowCameraFolder = gui.addFolder('Shadow Camera');
    shadowCameraFolder.add(shadowCameraHelper, 'visible').name('shadow-helper');
    shadowCameraFolder.add(directionalLight.shadow.camera, 'near', -20, 20, 0.1);
    shadowCameraFolder.add(directionalLight.shadow.camera, 'far', -20, 50, 0.1);
    shadowCameraFolder.add(directionalLight.shadow.camera, 'right', -20, 20, 0.1);
    shadowCameraFolder.add(directionalLight.shadow.camera, 'left', -20, 20, 0.1);
    shadowCameraFolder.add(directionalLight.shadow.camera, 'top', -20, 20, 0.1);
    shadowCameraFolder.add(directionalLight.shadow.camera, 'bottom', -20, 20, 0.1);
    shadowCameraFolder.add(directionalLight.shadow, 'radius', 0, 20, 0.1);
    shadowCameraFolder.add(directionalLight.shadow, 'blurSamples', 0, 20, 1);

    scene.add(directionalLight);

    initializeRendererControls(gui, renderer);

    animate();
});

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
