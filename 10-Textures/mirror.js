import * as THREE from 'three';
//import { GUI } from 'lil-gui';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { DragControls } from 'three/addons/controls/DragControls.js'
import { Reflector } from 'three/addons/objects/Reflector.js'
//import TWEEN from '@tweenjs/tween.js';

let renderer;
let camera;
let scene;

function sceneSetup() {
    scene = new THREE.Scene()

    const light = new THREE.DirectionalLight(0xffffff, Math.PI)
    light.position.set(1, 1, 0)
    light.castShadow = true
    scene.add(light)

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 100)
    camera.position.set(0.8, 1.4, 1.0)

    renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true
    document.body.appendChild(renderer.domElement)

    const orbitControls = new OrbitControls(camera, renderer.domElement)
    orbitControls.enableDamping = true
    orbitControls.target.set(0, 1, 0)

    const draggables = [];

    const dragControls = new DragControls(draggables, camera, renderer.domElement)
    dragControls.addEventListener('hoveron', function () {
        orbitControls.enabled = false
    })
    dragControls.addEventListener('hoveroff', function () {
        orbitControls.enabled = true
    })
    dragControls.addEventListener('drag', function (event) {
        //event.object.position.y = 0.3
    })
    dragControls.addEventListener('dragstart', function () {
        orbitControls.enabled = false
    })
    dragControls.addEventListener('dragend', function () {
        orbitControls.enabled = true
    })

    const planeGeometry = new THREE.PlaneGeometry(25, 25)
    const plane = new THREE.Mesh(planeGeometry, new THREE.MeshStandardMaterial({ color: 0x808080 }))
    plane.rotateX(-Math.PI / 2)
    plane.receiveShadow = true
    scene.add(plane)

    const model = new THREE.SphereGeometry(0.3, 32, 32)
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 })
    const mesh = new THREE.Mesh(model, material)
    mesh.castShadow = true
    mesh.position.y = 0.3
    scene.add(mesh)
    draggables.push(mesh)

    const mirror = new Reflector(new THREE.PlaneGeometry(2, 2), {
        color: new THREE.Color(0x7f7f7f),
        textureWidth: window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio,
    })

    mirror.position.y = 1
    mirror.position.z = -1
    scene.add(mirror)

    // Render loop
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        orbitControls.update();
    }
    animate();
}
document.addEventListener('DOMContentLoaded', sceneSetup);
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
