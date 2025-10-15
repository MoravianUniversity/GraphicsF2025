import * as THREE from 'three';
import GUI from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
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
        font: null,
        fontName: 'Creepster',
        text: 'Hello World',
        size: 1,
        depth: 0.5,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5
    };
    gui.add(params, 'fontName', ['Creepster', 'Helvetiker']).onChange((value) => {
        const fontLoader = new FontLoader();
        const fontFile = value === 'Creepster' ? '/assets/fonts/Creepster_Regular.json' : '/assets/fonts/helvetiker_regular.typeface.json';
        fontLoader.loadAsync(fontFile).then(
            (font) => { params.font = font; updateText(); }
        );
    });
    gui.add(params, 'text').onChange(updateText);
    gui.add(params, 'size', 0.1, 5).onChange(updateText);
    gui.add(params, 'depth', 0.1, 5).onChange(updateText);
    gui.add(params, 'curveSegments', 1, 20, 1).onChange(updateText);
    gui.add(params, 'bevelEnabled').onChange(updateText);
    gui.add(params, 'bevelThickness', 0.01, 0.2).onChange(updateText);
    gui.add(params, 'bevelSize', 0.01, 0.2).onChange(updateText);
    gui.add(params, 'bevelOffset', -0.1, 0.1).onChange(updateText);
    gui.add(params, 'bevelSegments', 1, 10, 1).onChange(updateText);

    // Load the font
    // Find fonts at https://fonts.google.com/
    // Convert fonts with https://gero3.github.io/facetype.js/
    const fontLoader = new FontLoader();
    fontLoader.loadAsync('/assets/fonts/Creepster_Regular.json').then(
        (font) => { params.font = font; updateText(); }
    );

    // Create the text geometry
    let mesh = null;
    function updateText() {
        if (!params.font) { return; }
        const geometry = new TextGeometry(params.text, params);
        geometry.center();
        const material = new THREE.MeshStandardMaterial({ color: 0xee8833 });
        if (mesh) { scene.remove(mesh); }
        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
    }

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
