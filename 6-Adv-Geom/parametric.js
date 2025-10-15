import * as THREE from 'three';
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let renderer;
let camera;
let scene;

function sceneSetup() {
    // Add to scene
    scene = new THREE.Scene();

    // Add lights
    const light1 = new THREE.DirectionalLight(0xffffff, 1);
    light1.position.set(1, 1, 1);
    scene.add(light1);

    const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
    light2.position.set(-1, 1, -1);
    scene.add(light2);

    const ambientLight = new THREE.AmbientLight(0x606060);
    scene.add(ambientLight);

    // Set up camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 10);
    camera.lookAt(0, 0, 0);

    // Set up renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Set up orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.update();

    // Create the parametric geometry
    const geometry = new ParametricGeometry((u, v, target) => {
        u = u - 0.5;
        v = 2 * Math.PI * v;
        const a = 2;
        // TODO: https://www.wolframalpha.com/input/?i=M%C3%B6bius+strip+parametric+equations&lk=1&a=ClashPrefs_*Surface.MoebiusStrip.SurfaceProperty.ParametricEquations-
        const x = 0;
        const y = 0;
        const z = 0;
        target.set(x, y, z);
    }, 100, 100);
    const material = new THREE.MeshStandardMaterial({ color: 0xee1122 });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Render loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
}
document.addEventListener('DOMContentLoaded', sceneSetup);
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
