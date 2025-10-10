import * as THREE from 'three'
import GUI from 'lil-gui'
import { initScene } from '../shared/bootstrap'
import { initializeRendererControls } from '../shared/renderer-control'
import { initializeGuiMaterial, initializeGuiMeshStandardMaterial } from '../shared/material-controls'
import { initializeSceneControls } from '../shared/scene-controls'

import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader'

const extrude_props = {
    curveSegments: 12,
    steps: 100,
    depth: 20,
    bevelEnabled: false,
    bevelThickness: 0,
    bevelSize: 0,
    bevelOffset: 0,
    bevelSegments: 10
}

const p = new SVGLoader().loadAsync('/assets/svg/friendly.svg')
let shapes = [new THREE.Shape().absarc(0, 0, 200, 0, Math.PI * 2, false)]

const updateGeometry = ({
    curveSegments,
    steps,
    depth,
    bevelEnabled,
    bevelThickness,
    bevelSize,
    bevelOffset,
    bevelSegments,
}) => {
    return new THREE.ExtrudeGeometry(shapes, {
        curveSegments,
        steps,
        depth,
        bevelEnabled,
        bevelThickness,
        bevelSize,
        bevelOffset,
        bevelSegments,
        // TODO: extrudePath
    }).scale(0.01, 0.01, 0.01).translate(-3, -4, 0).rotateX(Math.PI);
}

p.then((svg) => {
    shapes = [];
    for (let i = 0; i < svg.paths.length; i++) {
        shapes.push(...SVGLoader.createShapes(svg.paths[i]));
    }
    bootstrapGeometryScene({
        geometry: updateGeometry(extrude_props),
        provideGui: (gui, mesh) => {
            const folder = gui.addFolder('THREE.ExtrudeGeometry');
            folder.add(extrude_props, 'curveSegments', 1, 30, 1).onChange(() => updateMesh(mesh, updateGeometry(extrude_props)));
            folder.add(extrude_props, 'steps', 10, 300, 1).onChange(() => updateMesh(mesh, updateGeometry(extrude_props)));
            folder.add(extrude_props, 'depth', 1, 400, 1).onChange(() => updateMesh(mesh, updateGeometry(extrude_props)));
            folder.add(extrude_props, 'bevelEnabled').onChange(() => updateMesh(mesh, updateGeometry(extrude_props)));
            folder.add(extrude_props, 'bevelThickness', 0, 100, 0.01).onChange(() => updateMesh(mesh, updateGeometry(extrude_props)));
            folder.add(extrude_props, 'bevelSize', 0, 300, 0.01).onChange(() => updateMesh(mesh, updateGeometry(extrude_props)));
            folder.add(extrude_props, 'bevelOffset', 0, 300, 0.01).onChange(() => updateMesh(mesh, updateGeometry(extrude_props)));
            folder.add(extrude_props, 'bevelSegments', 1, 30, 1).onChange(() => updateMesh(mesh, updateGeometry(extrude_props)));
        }
    });
}).then()

function bootstrapGeometryScene({ geometry, provideGui, overrideMaterial, useLine }) {
    const props = {
        backgroundColor: 0xffffff,
        fogColor: 0xffffff
    };

    const gui = new GUI();

    const init = async () => {
        const material = overrideMaterial ?? new THREE.MeshStandardMaterial({ color: 0xffaa88 });
        const mesh = useLine ? new THREE.LineSegments(geometry, material) : new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        initScene(props)(({ scene, camera, renderer, orbitControls }) => {
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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
            overrideMaterial ?? initializeGuiMeshStandardMaterial(gui, mesh, material).close();
            provideGui(gui, mesh, scene);
        })
    }

    init().then()
}

function updateMesh(mesh, geometry) {
    mesh.geometry.dispose();
    mesh.geometry = geometry;
}
