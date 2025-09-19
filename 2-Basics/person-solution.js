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
const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
const hairMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 });

// Torso and neck
const torsoGeom = new THREE.BoxGeometry(1, 1.75, 0.5);
const torso = new THREE.Mesh(torsoGeom, shirtMaterial);
torso.position.y = 1.0;
const neckGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.25, 32);
const neck = new THREE.Mesh(neckGeom, skinMaterial);
neck.position.y = 0.90;
torso.add(neck);

// Head
const headGroup = new THREE.Group();
headGroup.position.y = 2.35;

const headGeom = new THREE.SphereGeometry(0.45, 32, 32);
const head = new THREE.Mesh(headGeom, skinMaterial);
headGroup.add(head);

// Eyes
const eyeGeom = new THREE.SphereGeometry(0.05, 16, 16);
const leftEye = new THREE.Mesh(eyeGeom, eyeMaterial);
leftEye.position.set(-0.1, 0.1, 0.4);
head.add(leftEye);
const rightEye = new THREE.Mesh(eyeGeom, eyeMaterial);
rightEye.position.set(0.1, 0.1, 0.4);
head.add(rightEye);

// Hair
const hairGeom = new THREE.SphereGeometry(0.46, 32, 32);
const hair = new THREE.Mesh(hairGeom, hairMaterial);
hair.position.set(0, 0.02, -0.02);
hair.rotation.x = Math.PI;
headGroup.add(hair);

gui.add(headGroup.rotation, 'x', -0.5*Math.PI, 0.5*Math.PI, 0.01).name('Head Rot X');
gui.add(headGroup.rotation, 'y', -Math.PI, Math.PI, 0.01).name('Head Rot Y');
gui.add(headGroup.rotation, 'z', -0.5*Math.PI, 0.5*Math.PI, 0.01).name('Head Rot Z');

// Arms
const upperArmGeom = new THREE.CapsuleGeometry(0.125, 0.75, 4, 8);
const foreArmGeom = new THREE.CapsuleGeometry(0.1, 0.75, 4, 8);
function createArm(left = true) {
    // Create upper arm
    const upperArm = new THREE.Mesh(upperArmGeom, shirtMaterial);
    upperArm.position.set(0, -0.375, 0);

    // Create forearm
    const foreArmGroup = new THREE.Group();
    foreArmGroup.position.set(0, -0.75, 0);

    const foreArm = new THREE.Mesh(foreArmGeom, skinMaterial);
    foreArm.position.set(0, -0.375, 0);
    foreArmGroup.add(foreArm);

    // Create a group to hold the arm parts
    const arm = new THREE.Group();
    arm.add(upperArm);
    arm.add(foreArmGroup);
    arm.position.set(left ? -0.625 : 0.625, 1.75, 0);

    // Add GUI controls for arm rotation
    gui.add(arm.rotation, 'x', -Math.PI, 0.5*Math.PI, 0.01).name(left ? 'Left Arm Rot X' : 'Right Arm Rot X');
    gui.add(arm.rotation, 'y', -0.5*Math.PI, 0.5*Math.PI, 0.01).name(left ? 'Left Arm Rot Y' : 'Right Arm Rot Y');
    if (left) {
        gui.add(arm.rotation, 'z', -Math.PI, 0, 0.01).name('Left Arm Rot Z');
    } else {
        gui.add(arm.rotation, 'z', 0, Math.PI, 0.01).name('Right Arm Rot Z');
    }

    gui.add(foreArmGroup.rotation, 'x', -0.5*Math.PI, 0, 0.01).name(left ? 'Left Forearm Rot X' : 'Right Forearm Rot X');

    return arm;
}

// Legs
const thighGeom = new THREE.BoxGeometry(0.4, 0.75, 0.3);
const kneeGeom = new THREE.SphereGeometry(0.15, 32, 32);
const calfGeom = new THREE.CapsuleGeometry(0.15, 0.75, 4, 8);
function createLeg(left = true) {
    const legGroup = new THREE.Group();
    legGroup.position.set(left ? -0.25 : 0.25, 0.2, 0);

    const thigh = new THREE.Mesh(thighGeom, pantsMaterial);
    thigh.position.set(0, -0.375, 0);
    legGroup.add(thigh);

    const lowerLegGroup = new THREE.Group();
    lowerLegGroup.position.set(0, -0.75, 0);
    legGroup.add(lowerLegGroup);

    const knee = new THREE.Mesh(kneeGeom, skinMaterial);
    knee.position.set(0, 0, 0);
    lowerLegGroup.add(knee);

    const calf = new THREE.Mesh(calfGeom, skinMaterial);
    calf.position.set(0, -0.375, 0);
    lowerLegGroup.add(calf);

    // Add GUI controls for leg rotation
    gui.add(legGroup.rotation, 'x', -0.5*Math.PI, 0.5*Math.PI, 0.01).name(left ? 'Left Leg Rot X' : 'Right Leg Rot X');
    gui.add(legGroup.rotation, 'y', -0.25*Math.PI, 0.25*Math.PI, 0.01).name(left ? 'Left Leg Rot Y' : 'Right Leg Rot Y');
    gui.add(legGroup.rotation, 'z', -0.5*Math.PI, 0.5*Math.PI, 0.01).name(left ? 'Left Leg Rot Z' : 'Right Leg Rot Z');

    gui.add(lowerLegGroup.rotation, 'x', 0, Math.PI, 0.01).name(left ? 'Left Calf Rot X' : 'Right Calf Rot X');

    return legGroup;
}

// Create a group to hold all parts of the person and add to the scene
const person = new THREE.Group();
person.add(torso);
person.add(headGroup);
person.add(createArm(true));
person.add(createArm(false));
person.add(createLeg(true));
person.add(createLeg(false));
scene.add(person);
