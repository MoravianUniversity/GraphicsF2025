import * as THREE from 'three';
import GUI from 'lil-gui'
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let renderer;
let camera;
let scene;
const gui = new GUI();

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

    // Add GUI controls
    const params = {
        major: 2.25,
        a: 0.125,
        b: 0.65,
        slices: 10,
        stacks: 10,
    };
    gui.add(params, 'major', 1, 5).onChange(updateGeometry);
    gui.add(params, 'a', 0.01, 1).onChange(updateGeometry);
    gui.add(params, 'b', 0.01, 1).onChange(updateGeometry);
    gui.add(params, 'slices', 5, 100, 1).onChange(updateGeometry);
    gui.add(params, 'stacks', 5, 100, 1).onChange(updateGeometry);

    // Create the parametric geometry
    const material = new THREE.MeshStandardMaterial({ color: 0xee1122 });
    let mesh = null;
    let edgesMesh = null;
    function updateGeometry() {
        const geometry = new ParametricGeometry((u, v, target) => {
            u *= Math.PI;
            v *= 2 * Math.PI;

            u = u * 2;
            const phi = u / 2;

            let x = params.a * Math.cos(v) * Math.cos(phi) - params.b * Math.sin(v) * Math.sin(phi);
            const z = params.a * Math.cos(v) * Math.sin(phi) + params.b * Math.sin(v) * Math.cos(phi);
            const y = (params.major + x) * Math.sin(u);
            x = (params.major + x) * Math.cos(u);

            target.set(x, y, z);
        }, params.slices, params.stacks);
        if (mesh) { scene.remove(mesh); }
        if (edgesMesh) { scene.remove(edgesMesh); }
        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        edgesMesh = new THREE.LineSegments(
            new THREE.EdgesGeometry(geometry),
            new THREE.LineBasicMaterial({ color: 0x000000 })
        );
        scene.add(edgesMesh);
    }
    updateGeometry();

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
