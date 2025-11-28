import * as THREE from 'three';
import { GUI } from 'lil-gui';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { stats } from '../shared/stats.js';
import TWEEN from '@tweenjs/tween.js';

let renderer;
let camera;
let scene;

function sceneSetup() {
    // Add to scene
    scene = new THREE.Scene();

    // Add lights
    const light1 = new THREE.DirectionalLight(0xffffff, 1);
    light1.position.set(1, 1, 1);
    light1.castShadow = true;
    light1.shadow.camera.top = 30;
    light1.shadow.camera.bottom = -30;
    light1.shadow.camera.left = -30;
    light1.shadow.camera.right = 30;
    light1.shadow.camera.near = -30;
    light1.shadow.camera.far = 30;
    scene.add(light1);

    const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
    light2.position.set(-1, 1, -1);
    light2.castShadow = true;
    light1.shadow.camera.top = 30;
    light1.shadow.camera.bottom = -30;
    light1.shadow.camera.left = -30;
    light1.shadow.camera.right = 30;
    light1.shadow.camera.near = -30;
    light1.shadow.camera.far = 30;
    scene.add(light2);

    const ambientLight = new THREE.AmbientLight(0x606060);
    scene.add(ambientLight);

    // Set up camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(30, 25, 30);
    camera.lookAt(0, 0, 0);

    // Set up renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.shadowMap.enabled = false;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Set up orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.update();

    // Create the mesh
    const geom = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({color: 0xFF1100});
    const meshes = [];
    for (let i = 0; i < 10; i++) {
        const mesh = new THREE.Mesh(geom, material);
        mesh.position.set(2*i, 0, 0);
        scene.add(mesh);
        meshes.push(mesh);
    }

    // Create the GUI
    const gui = new GUI();
    const animationParams = {
        rotationXSpeed: 0, // rads/sec
        rotationYSpeed: 0, // rads/sec
        rotationZSpeed: 0, // rads/sec
    };
    gui.add(animationParams, 'rotationXSpeed', 0, 2*Math.PI).name('Rotation X Speed');
    gui.add(animationParams, 'rotationYSpeed', 0, 2*Math.PI).name('Rotation Y Speed');
    gui.add(animationParams, 'rotationZSpeed', 0, 2*Math.PI).name('Rotation Z Speed');

    const clock = new THREE.Clock();

    const startColor = new THREE.Color(0xFF0000);
    const endColor = new THREE.Color(0x0000FF);
    const currentColor = new THREE.Color(0x000000);

    const tweenData = {
        colorPercent: 0,
        height1: 0,
        height2: 0,
        height3: 0,
        height4: 0,
        height5: 0,
        height6: 0,
        height7: 0,
        height8: 0,
        height9: 0,
        height10: 0,
    };
    const tweens = [
        new TWEEN.Tween(tweenData).to({colorPercent: 1}, 10000)
            .easing(TWEEN.Easing.Elastic.InOut)
            .yoyo(true)
            .repeat(Infinity)
            .start(),
        new TWEEN.Tween(tweenData).to({height1: 5}, 10000).delay(0).easing(TWEEN.Easing.Bounce.In).yoyo(true).repeat(Infinity).start(),
        new TWEEN.Tween(tweenData).to({height2: 5}, 10000).delay(0).easing(TWEEN.Easing.Bounce.Out).yoyo(true).repeat(Infinity).start(),
        new TWEEN.Tween(tweenData).to({height3: 5}, 10000).delay(0).easing(TWEEN.Easing.Bounce.InOut).yoyo(true).repeat(Infinity).start(),
        new TWEEN.Tween(tweenData).to({height4: 5}, 10000).delay(0).easing(TWEEN.Easing.Cubic.InOut).yoyo(true).repeat(Infinity).start(),
        new TWEEN.Tween(tweenData).to({height5: 5}, 10000).delay(0).easing(TWEEN.Easing.Cubic.Out).yoyo(true).repeat(Infinity).start(),
        new TWEEN.Tween(tweenData).to({height6: 5}, 10000).delay(0).easing(TWEEN.Easing.Bounce.Out).yoyo(true).repeat(Infinity).start(),
        new TWEEN.Tween(tweenData).to({height7: 5}, 10000).delay(0).easing(TWEEN.Easing.Bounce.Out).yoyo(true).repeat(Infinity).start(),
        new TWEEN.Tween(tweenData).to({height8: 5}, 10000).delay(0).easing(TWEEN.Easing.Bounce.Out).yoyo(true).repeat(Infinity).start(),
        new TWEEN.Tween(tweenData).to({height9: 5}, 10000).delay(0).easing(TWEEN.Easing.Bounce.Out).yoyo(true).repeat(Infinity).start(),
        new TWEEN.Tween(tweenData).to({height10: 5}, 10000).delay(0).easing(TWEEN.Easing.Bounce.Out).yoyo(true).repeat(Infinity).start(),
    ];

    // Render loop
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);

        // TODO: animate mesh
        // const delta = clock.getDelta();
        // mesh.rotation.x += animationParams.rotationXSpeed * delta;
        // mesh.rotation.y += animationParams.rotationYSpeed * delta;
        // mesh.rotation.z += animationParams.rotationZSpeed * delta;

        // tween.update();

        // currentColor.lerpColors(startColor, endColor, tweens.colorPercent);
        // mesh.material.color.copy(currentColor);

        for (const tween of tweens) {
            tween.update();
        }

        meshes[0].position.y = tweenData.height1;
        meshes[1].position.y = tweenData.height2;
        meshes[2].position.y = tweenData.height3;
        meshes[3].position.y = tweenData.height4;
        meshes[4].position.y = tweenData.height5;
        meshes[5].position.y = tweenData.height6;
        meshes[6].position.y = tweenData.height7;
        meshes[7].position.y = tweenData.height8;
        meshes[8].position.y = tweenData.height9;
        meshes[9].position.y = tweenData.height10;

        stats.update();
        controls.update();
    }
    animate();
}
document.addEventListener('DOMContentLoaded', sceneSetup);
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
