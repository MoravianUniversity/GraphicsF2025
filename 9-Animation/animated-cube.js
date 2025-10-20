import * as THREE from 'three';
import { GUI } from 'lil-gui';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { stats } from '../shared/stats.js';

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
    const mesh = new THREE.Mesh(geom, material);
    scene.add(mesh);

    // Create the GUI
    const gui = new GUI();
    const animationParams = {
        rotationXSpeed: 0,
        rotationYSpeed: 0,
        rotationZSpeed: 0,
    };
    gui.add(animationParams, 'rotationXSpeed', 0, 2*Math.PI).name('Rotation X Speed');
    gui.add(animationParams, 'rotationYSpeed', 0, 2*Math.PI).name('Rotation Y Speed');
    gui.add(animationParams, 'rotationZSpeed', 0, 2*Math.PI).name('Rotation Z Speed');

    // Render loop
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);

        // TODO: animate mesh

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
