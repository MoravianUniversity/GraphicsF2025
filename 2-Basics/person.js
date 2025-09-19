import * as THREE from 'three';
import GUI from 'lil-gui';
import { initOrbitControls } from '../shared/orbit-controller.js';
import { initLighting } from '../shared/lighting.js';
import { initializeHelperControls } from '../shared/helpers-control.js';
import { stats } from '../shared/stats';

/**
 * Handle window resize events. From shared/update-on-resize.js.
 */
function onResize(camera, renderer) {
    const resizer = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', resizer, false);
}

/**
 * Initialize the 3D scene. From shared/bootstrap.js.
 * @returns {{ scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, orbitControls: OrbitControls }}
 */
function initScene() {
    // basic scene setup
    const scene = new THREE.Scene();
    scene.backgroundColor = 0xffffff;

    // setup camera and basic renderer
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;
    renderer.setClearColor(scene.backgroundColor);

    onResize(camera, renderer);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // initialize orbit controls
    const orbitControls = initOrbitControls(camera, renderer);

    // add some basic lighting to the scene
    initLighting(scene, { disableShadows: true });
    scene.add(new THREE.AmbientLight(0x777777)); // stronger ambient light

    return {
        scene,
        camera,
        renderer,
        orbitControls
    };
}

// Initialize the 3D scene
const { scene, camera, renderer, orbitControls } = initScene();
camera.position.set(-3, 1, 4);
orbitControls.update();

// Animation loop
function animate() {
    // Repeat the loop
    requestAnimationFrame(animate);

    // Render the scene
    renderer.render(scene, camera);

    // Update stats and controls
    stats.update();
    orbitControls.update();
}
animate(); // Start the animation loop

const gui = new GUI();
initializeHelperControls(gui, scene);


/////////////////////////////////////////////
///////  Person made with scene graph ///////
/////////////////////////////////////////////

// Create basic materials
const shirtMaterial = new THREE.MeshStandardMaterial({ color: 0x156289 });
const pantsMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
const skinMaterial = new THREE.MeshStandardMaterial({ color: 0xffd90f });

// Torso and neck
const torsoGeom = new THREE.BoxGeometry(1, 1.75, 0.5);
const torso = new THREE.Mesh(torsoGeom, shirtMaterial);
torso.position.y = 1.0;
const neckGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.25, 32);
const neck = new THREE.Mesh(neckGeom, skinMaterial);
neck.position.y = 0.90;
torso.add(neck);

// Head
const headGeom = new THREE.SphereGeometry(0.45, 32, 32);
const head = new THREE.Mesh(headGeom, skinMaterial);
head.position.y = 2.35;

// Arms
const upperArmGeom = new THREE.CapsuleGeometry(0.125, 0.75, 4, 8);
const foreArmGeom = new THREE.CapsuleGeometry(0.1, 0.75, 4, 8);
function createArm(left = true) {
    // Create upper arm
    const upperArm = new THREE.Mesh(upperArmGeom, shirtMaterial);
    upperArm.position.set(0, -0.375, 0);

    // Create forearm
    const foreArm = new THREE.Mesh(foreArmGeom, skinMaterial);
    foreArm.position.set(0, -1.125, 0);

    // Create a group to hold the arm parts
    const arm = new THREE.Group();
    arm.add(upperArm);
    arm.add(foreArm);
    arm.position.set(left ? -0.625 : 0.625, 1.75, 0);

    // Add GUI controls for arm rotation
    gui.add(arm.rotation, 'x', -Math.PI, 0.5*Math.PI, 0.01).name(left ? 'Left Arm Rot X' : 'Right Arm Rot X');
    gui.add(arm.rotation, 'y', -0.5*Math.PI, 0.5*Math.PI, 0.01).name(left ? 'Left Arm Rot Y' : 'Right Arm Rot Y');
    if (left) {
        gui.add(arm.rotation, 'z', -Math.PI, 0, 0.01).name('Left Arm Rot Z');
    } else {
        gui.add(arm.rotation, 'z', 0, Math.PI, 0.01).name('Right Arm Rot Z');
    }

    return arm;
}

// Legs
const legGeom = new THREE.BoxGeometry(0.4, 1.5, 0.3);

const leftLeg = new THREE.Mesh(legGeom, pantsMaterial);
leftLeg.position.set(-0.25, -0.625, 0);

const rightLeg = new THREE.Mesh(legGeom, pantsMaterial);
rightLeg.position.set(0.25, -0.625, 0);

// Create a group to hold all parts of the person and add to the scene
const person = new THREE.Group();
person.add(torso);
person.add(head);
person.add(createArm(true));
person.add(createArm(false));
person.add(leftLeg);
person.add(rightLeg);
scene.add(person);
