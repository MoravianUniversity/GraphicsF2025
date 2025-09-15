import * as THREE from 'three';
import GUI from 'lil-gui';
import { initOrbitControls } from '../shared/orbit-controller.js';
import { initLighting } from '../shared/lighting.js';
import { floatingFloor } from '../shared/floor.js';
import { initializeHelperControls } from '../shared/helpers-control.js';
import { initializeSceneControls } from '../shared/scene-controls';
import { initializeRendererControls } from '../shared/renderer-control.js';
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
    //scene.fog = new THREE.Fog(0xffffff, 0.0025, 50);

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
    initLighting(scene, { disableShadows: false });

    return {
        scene,
        camera,
        renderer,
        orbitControls
    };
}

// Initialize the 3D scene
const { scene, camera, renderer, orbitControls } = initScene();
camera.position.set(-7, 2, 5);
orbitControls.update();

// Create the floating floor
floatingFloor(scene, 10);

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

// Initialize the GUI controls
const gui = new GUI();
initializeRendererControls(gui, renderer);
initializeHelperControls(gui, scene);
initializeSceneControls(gui, scene, true);
initializeAddRemoveControls(scene);

/**
 * Add add-remove controls.
 */
function initializeAddRemoveControls(parent) {
    const addRemoveProps = {
        add: () => add(parent),
        remove: () => remove(parent)
    }
    gui.add(addRemoveProps, 'add')
    gui.add(addRemoveProps, 'remove')
}

/**
 * Generate a random color. From shared/colorUtil.js.
 * @returns {THREE.Color} A random color.
 */
function randomColor() {
    const r = Math.random(), g = Math.random(), b = Math.random();
    return new THREE.Color(r, g, b);
}

/**
 * Generate a random vector. From shared/positionUtil.js.
 * @returns {THREE.Vector3} A random vector.
 */
function randomVector({xRange: { fromX, toX }, yRange: { fromY, toY }, zRange: { fromZ, toZ }}) {
    const x = Math.random() * (toX - fromX) + fromX;
    const y = Math.random() * (toY - fromY) + fromY;
    const z = Math.random() * (toZ - fromZ) + fromZ;
    return new THREE.Vector3(x, y, z);
};

/**
 * Generate a random box geometry.
 * @returns {THREE.BoxGeometry} A random box geometry.
 */
function randomBox() {
    const size = randomVector({
        xRange: { fromX: 0.5, toX: 1.5 },
        yRange: { fromY: 0.5, toY: 1.5 },
        zRange: { fromZ: 0.5, toZ: 1.5 }
    });
    return new THREE.BoxGeometry(size.x, size.y, size.z);
}

/**
 * Add an item to the scene.
 * @param {THREE.Object3D} parent
 */
function add(parent) {
    // Generate random properties
    const color = randomColor();
    const pos = randomVector({
        xRange: { fromX: -4, toX: 4 },
        yRange: { fromY: -3, toY: 3 },
        zRange: { fromZ: -4, toZ: 4 }
    });
    const rotation = randomVector({
        xRange: { fromX: 0, toX: Math.PI * 2 },
        yRange: { fromY: 0, toY: Math.PI * 2 },
        zRange: { fromZ: 0, toZ: Math.PI * 2 }
    });

    // Create the mesh
    const choice = Math.floor(Math.random() * 8); // an int from 0 to 7
    const geometry =
        choice === 0 ? randomBox() :
            choice === 1 ? randomBox() :
                choice === 2 ? randomBox() :
                    choice === 3 ? randomBox() :
                        choice === 4 ? randomBox() :
                            choice === 5 ? randomBox() :
                                choice === 6 ? randomBox() :
                                    /*choice === 7*/ randomBox();
    const material = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.1,
        metalness: 0.9
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = 'mesh-' + parent.children.length;
    mesh.castShadow = true;

    // Set the position and rotation
    mesh.position.copy(pos);
    mesh.rotation.setFromVector3(rotation);

    // Add the mesh to the parent (scene)
    parent.add(mesh);
}

/**
 * Remove the last item from the scene.
 * @param {THREE.Object3D} parent 
 */
function remove(parent) {
    if (parent.children.length > 3) {
        parent.children.pop();
    }
}
