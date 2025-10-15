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

    const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(ambientLight);

    // Set up camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1, 1);
    camera.lookAt(0, 0, 0);

    // Set up renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Set up orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.update();

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

// Load heightmap image
const img = new Image();
img.src = "/assets/n41w076-5.png";
img.onload = function () {
    // Once the image is loaded, create the terrain

    // Scale factor to convert pixel value (0-255) to height (0-0.1)
    const heightFactor = 0.1 / 255;

    // Number of segments in the resulting geometry
    const segments = 32;

    // Create temporary canvas to extract pixel data
    const canvas = document.createElement('canvas');
    const width = img.width;
    const height = img.height;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Draw image onto canvas
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, width, height).data;

    // data is now a Uint8ClampedArray containing RGBA pixel values from top-left to bottom-right
    // to get the red amount of the pixel at (x, y): 
    // red = data[(y * width + x) * 4]
    // which will be a value between 0 and 255
    // a grayscale image (like we have) will have R == G == B

    // Create geometry
    const geometry = TODO;
    geometry.center();
    
    // Create material
    const material = new THREE.MeshStandardMaterial({ color: 0xd0ffc0, side: THREE.DoubleSide });

    // Create mesh
    const mesh = new THREE.Mesh(geometry, material);

    // Add to scene
    scene.add(mesh);
}
