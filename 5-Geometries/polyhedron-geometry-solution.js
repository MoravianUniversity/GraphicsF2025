import * as THREE from 'three'
import { initScene } from '../shared/bootstrap'
import { initializeRendererControls } from '../shared/renderer-control'
import GUI from 'lil-gui'
import { initializeGuiMaterial, initializeGuiMeshStandardMaterial } from '../shared/material-controls'
import { initializeSceneControls } from '../shared/scene-controls'

const props = {
    radius: 1,
    detail: 0,
    geom: 'customGeometry'
}

const vertices = [
    1, 1, 1,
    1, 1, -1,
    1, -1, 1,
    1, -1, -1,
    -1, 1, 1,
    -1, -1, 1,
    -1, 1, -1,
    -1, -1, -1,
];
const indices = [
    2, 1, 0,
    1, 2, 3,
    1, 4, 0,
    1, 6, 4,
    0, 4, 5,
    0, 5, 2,
    3, 2, 5,
    3, 5, 7,
    6, 7, 5,
    6, 5, 4,
    6, 7, 5,
    1, 7, 6,
    1, 3, 7,
];

function updateGeometry() {
    return new THREE.PolyhedronGeometry(vertices, indices, props.radius, props.detail);
}

bootstrapGeometryScene({
    geom: updateGeometry(),
    provideGui: (gui, mesh) => {
        const folder = gui.addFolder('THREE.PolyhedronGeometry');
        folder.add(props, 'radius', 0, 10, 0.01).onChange(() => updateMesh(mesh, updateGeometry()));
        folder.add(props, 'detail', 0, 4, 1).onChange(() => updateMesh(mesh, updateGeometry()));
    }
}).then();

async function bootstrapGeometryScene({ geom, provideGui }) {
    const sceneProps = {
        backgroundColor: 0xffffff,
        fogColor: 0xffffff
    }

    const gui = new GUI()

    const init = async () => {
        const material = new THREE.MeshStandardMaterial({
            color: 0xffaa88
        })
        const mesh = new THREE.Mesh(geom, material)
        mesh.castShadow = true
        initScene(sceneProps)(({ scene, camera, renderer, orbitControls }) => {
            renderer.shadowMap.type = THREE.PCFSoftShadowMap
            camera.position.x = -3;
            camera.position.z = 8;
            camera.position.y = 2;
            orbitControls.update();

            function animate() {
                requestAnimationFrame(animate);
                renderer.render(scene, camera);
                orbitControls.update();
            }

            animate();

            scene.add(mesh);
            initializeRendererControls(gui, renderer);
            initializeSceneControls(gui, scene, false);

            initializeGuiMaterial(gui, mesh, material).close();
            initializeGuiMeshStandardMaterial(gui, mesh, material).close();
            provideGui(gui, mesh);
        })
    }

    init().then()
}

function updateMesh(mesh, geom) {
    mesh.geometry.dispose();
    mesh.geometry = geom;
}
