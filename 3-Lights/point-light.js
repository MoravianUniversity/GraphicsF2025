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
    renderer.shadowMap.type = THREE.PCFShadowMap;
    camera.position.set(-4, 14, 4);
    orbitControls.update();

    loadWaterfall(scene);

    const pointLight = new THREE.PointLight();
    const pointLightHelper = new THREE.PointLightHelper(pointLight);
    const shadowCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
    scene.add(pointLightHelper);
    scene.add(shadowCameraHelper);

    pointLightHelper.visible = false;
    shadowCameraHelper.visible = false;

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        stats.update();
        pointLightHelper.update();
        pointLight.shadow.camera.updateProjectionMatrix();
        shadowCameraHelper.update();
        orbitControls.update();
    }

    const colorHolder = new THREE.Color(0xffffff);
    const light = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(light);

    pointLight.position.set(10, 14, 5);
    pointLight.intensity = 200;
    pointLight.distance = 0; // infinite
    pointLight.decay = 2;
    pointLight.castShadow = true;

    pointLight.shadow.camera.near = 1;
    pointLight.shadow.camera.far = 25;
    pointLight.shadow.camera.right = 10;
    pointLight.shadow.camera.left = -10;
    pointLight.shadow.camera.top = 10;
    pointLight.shadow.camera.bottom = -10;
    pointLight.shadow.mapSize.width = 2048;
    pointLight.shadow.mapSize.height = 2048;
    pointLight.shadow.bias = -0.01;
    pointLight.shadow.radius = 0;

    const pointLightFolder = gui.addFolder('Point Light');
    pointLightFolder.addColor({color: colorHolder.getStyle()}, 'color').onChange((c) => pointLight.color.setStyle(c));
    pointLightFolder.add(pointLight, 'intensity', 0, 250, 0.1);
    pointLightFolder.add(pointLight, 'distance', 0, 50, 0.1);
    pointLightFolder.add(pointLight, 'decay', 0, 5, 0.01);
    pointLightFolder.add(pointLight.position, 'x', -30, 30, 0.1).name('positionX');
    pointLightFolder.add(pointLight.position, 'y', -30, 30, 0.1).name('positionY');
    pointLightFolder.add(pointLight.position, 'z', -30, 30, 0.1).name('positionZ');
    pointLightFolder.add(pointLight, 'castShadow');
    pointLightFolder.add(pointLightHelper, 'visible').name('pointlight-helper');

    const shadowCameraFolder = gui.addFolder('Shadow Camera');
    shadowCameraFolder.add(shadowCameraHelper, 'visible').name('shadow-helper');
    shadowCameraFolder.add(pointLight.shadow.camera, 'fov', 1, 90, 0.1);
    shadowCameraFolder.add(pointLight.shadow.camera, 'near', -20, 20, 0.1);
    shadowCameraFolder.add(pointLight.shadow.camera, 'far', 0, 100, 0.1);
    shadowCameraFolder.add(pointLight.shadow, 'radius', 0, 20, 0.1);

    scene.add(pointLight);

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
