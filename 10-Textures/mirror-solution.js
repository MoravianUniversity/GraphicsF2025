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

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1)
    scene.add(ambientLight);

    const light = new THREE.DirectionalLight(0xffffff, Math.PI)
    light.position.set(1, 1, -0.2)
    light.castShadow = true
    light.shadow.camera.top = 20
    light.shadow.camera.bottom = -20
    light.shadow.camera.left = 20
    light.shadow.camera.right = -20
    light.shadow.camera.near = -20
    light.shadow.camera.far = 20
    light.shadow.mapSize.set(2048, 2048)
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

    const mirror = new Reflector(new THREE.CircleGeometry(2, 32), {
        color: new THREE.Color(0x8080AA),
        textureWidth: window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio,
    })
    mirror.position.y = 1
    mirror.position.z = -1
    scene.add(mirror)

    const frame = new THREE.PlaneGeometry(2.2, 2.2);
    const frameMaterial = new THREE.MeshStandardMaterial({color: 0xff7f00, side: THREE.DoubleSide});
    const frameMesh = new THREE.Mesh(frame, frameMaterial);
    frameMesh.position.y = 1.1
    frameMesh.position.z = -1.001
    frameMesh.castShadow = true
    scene.add(frameMesh);

    const mirror2 = new Reflector(new THREE.PlaneGeometry(2, 2), {
        color: new THREE.Color(0xffffff),
        textureWidth: window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio,
    })
    mirror2.position.y = 1
    mirror2.position.z = 1
    mirror2.rotateY(Math.PI)
    scene.add(mirror2)

    const frameMesh2 = new THREE.Mesh(frame, frameMaterial);
    frameMesh2.position.y = 1.1
    frameMesh2.position.z = 1.001
    frameMesh2.castShadow = true
    scene.add(frameMesh2);


    // Render loop
    function animate() {
        requestAnimationFrame(animate);

        const time = Date.now();
        mesh.position.y = 0.3 + Math.abs(Math.sin(time * 0.002) * 1.7);

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
