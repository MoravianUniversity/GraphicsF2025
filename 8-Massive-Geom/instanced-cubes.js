import * as THREE from 'three';
import { GUI } from 'lil-gui';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { stats } from '../shared/stats.js';

let renderer;
let camera;
let scene;
let maxCount = 500000; // initial size of instanced mesh
let mesh;

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

    // Create the base objects
    const mat = new THREE.MeshNormalMaterial({
        blending: THREE.NormalBlending,
        opacity: 0.1,
        transparent: true,
    });
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    mesh = new THREE.InstancedMesh(geometry, mat, maxCount);
    mesh.count = 0; // show 0 initially
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    const materials = {
        'no override': null,
        'basic': new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            blending: THREE.NormalBlending,
            opacity: 0.1,
            transparent: true,
        }),
        'normal': mat,
        'phong': new THREE.MeshPhongMaterial({
            color: 0xff0000,
            blending: THREE.NormalBlending,
            opacity: 0.1,
            transparent: true,
        }),
        'standard': new THREE.MeshStandardMaterial({
            color: 0x0000ff,
            blending: THREE.NormalBlending,
            opacity: 0.1,
            transparent: true,
        }),
    }

    // Parameters for new cubes
    const newCubeParams = {
        scaleX: 1,
        scaleY: 1,
        scaleZ: 1,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
    };

    // Create the GUI
    const gui = new GUI();
    const actions = {
        add100000: () => { createCubes(10000, newCubeParams); actions.count += 100000; },
        add10000: () => { createCubes(10000, newCubeParams); actions.count += 10000; },
        add1000: () => { createCubes(1000, newCubeParams); actions.count += 1000; },
        add100: () => { createCubes(100, newCubeParams); actions.count += 100; },
        add10: () => { createCubes(10, newCubeParams); actions.count += 10; },
        add1: () => { createCube(newCubeParams); actions.count += 1; },
        clear: () => {
            mesh.count = 0;
            actions.count = 0;
        },
        count: 0,
        material: 'no override',
        useShadows: false,
    };
    gui.add(actions, 'add100000').name('Add 100000 Cubes');
    gui.add(actions, 'add10000').name('Add 10000 Cubes');
    gui.add(actions, 'add1000').name('Add 1000 Cubes');
    gui.add(actions, 'add100').name('Add 100 Cubes');
    gui.add(actions, 'add10').name('Add 10 Cubes');
    gui.add(actions, 'add1').name('Add 1 Cube');
    gui.add(actions, 'clear').name('Clear All Cubes');
    gui.add(actions, 'count').name('Cube Count').listen().disable();
    gui.add(actions, 'material', Object.keys(materials)).name('Material').onChange((value) => {
        scene.overrideMaterial = materials[value];
    });
    gui.add(actions, 'useShadows').name('Use Shadows').onChange((value) => {
        renderer.shadowMap.enabled = value;
        renderer.shadowMap.needsUpdate = true;
    });

    // New Cube Control GUI
    const newCubeFolder = gui.addFolder('New Cube Controls');
    newCubeFolder.add(newCubeParams, 'scaleX', 0.1, 5);
    newCubeFolder.add(newCubeParams, 'scaleY', 0.1, 5);
    newCubeFolder.add(newCubeParams, 'scaleZ', 0.1, 5);
    newCubeFolder.add(newCubeParams, 'rotateX', 0, Math.PI * 2);
    newCubeFolder.add(newCubeParams, 'rotateY', 0, Math.PI * 2);
    newCubeFolder.add(newCubeParams, 'rotateZ', 0, Math.PI * 2);

    // Group Control GUI
    const groupParams = {
        scaleX: 1,
        scaleY: 1,
        scaleZ: 1,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
    };
    const groupControlFolder = gui.addFolder('Group Controls');
    groupControlFolder.add(groupParams, 'scaleX', 0.1, 5).onChange((value) => { mesh.scale.x = value; });
    groupControlFolder.add(groupParams, 'scaleY', 0.1, 5).onChange((value) => { mesh.scale.y = value; });
    groupControlFolder.add(groupParams, 'scaleZ', 0.1, 5).onChange((value) => { mesh.scale.z = value; });
    groupControlFolder.add(groupParams, 'rotateX', 0, Math.PI * 2).onChange((value) => { mesh.rotation.x = value; });
    groupControlFolder.add(groupParams, 'rotateY', 0, Math.PI * 2).onChange((value) => { mesh.rotation.y = value; });
    groupControlFolder.add(groupParams, 'rotateZ', 0, Math.PI * 2).onChange((value) => { mesh.rotation.z = value; });

    // Render loop
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
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

function createCubes(n, params) {
    if (mesh.count + n > maxCount) {
        growInstanceMesh(mesh.count + n);
    }
    for (let i = 0; i < n; i++) {
        createCube(params);
    }
}

const tempMat = new THREE.Matrix4();
const tempVec = new THREE.Vector3();
const tempRot = new THREE.Matrix4();
const tempEuler = new THREE.Euler();

function createCube(params) {
    if (mesh.count + 1 > maxCount) {
        growInstanceMesh(mesh.count + 1);
    }
    const range = 20;
    const matrix = tempMat;
    matrix.makeTranslation(
        (Math.random() - 0.5) * range,
        (Math.random() - 0.5) * range,
        (Math.random() - 0.5) * range
    );
    matrix.scale(tempVec.set(params.scaleX, params.scaleY, params.scaleZ));
    matrix.multiply(tempRot.makeRotationFromEuler(tempEuler.set(params.rotateX, params.rotateY, params.rotateZ)));
    mesh.setMatrixAt(mesh.count, matrix);
    mesh.count += 1;
    mesh.instanceMatrix.needsUpdate = true;
}

function growInstanceMesh(n) {
    let newCount = maxCount + 100000;
    while (newCount < n) { newCount += 100000; }
    const old = mesh;
    mesh = new THREE.InstancedMesh(
        mesh.geometry,
        mesh.material,
        newCount,
    );
    mesh.scale.copy(old.scale);
    mesh.rotation.copy(old.rotation);
    mesh.instanceMatrix.array.set(old.instanceMatrix.array, 0);
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor && old.instanceColor) {
        mesh.instanceColor.copy(old.instanceColor);
        mesh.instanceColor.needsUpdate = true;
    }
    mesh.count = old.count;
    old.dispose();
    scene.remove(old);
    scene.add(mesh);
    maxCount = newCount;
}
