import * as THREE from 'three'
import { initScene } from '../shared/bootstrap'
import { initializeRendererControls } from '../shared/renderer-control'
import GUI from 'lil-gui'
import { initializeGuiMaterial, initializeGuiMeshStandardMaterial } from '../shared/material-controls'
import { initializeSceneControls } from '../shared/scene-controls'
import { foreverPlane } from '../shared/floor'
//import { initializeMeshVisibleControls } from '../shared/mesh-visible-controls'

const props = {
    radius: 1,
    detail: 0,
    geom: 'customGeometry'
}

const vertices = [
    1, 1, 1,
    -1, -1, 1,
    -1, 1, -1,
    1, -1, -1
];
const indices = [
    2, 1, 0,
    0, 3, 2,
    1, 3, 0,
    2, 3, 1
]

const geometries = {
    customGeometry: () => new THREE.PolyhedronGeometry(vertices, indices, props.radius, props.detail),
    tetrahedronGeometry: () => new THREE.TetrahedronGeometry(props.radius, props.detail),
    octahedronGeometry: () => new THREE.OctahedronGeometry(props.radius, props.detail),
    icosahedronGeometry: () => new THREE.IcosahedronGeometry(props.radius, props.detail),
    dodecahedronGeometry: () => new THREE.DodecahedronGeometry(props.radius, props.detail)
}

const updateGeometry = ({ geom }) => geometries[geom]()

const geometry = updateGeometry({ geom: 'customGeometry' })

bootstrapGeometryScene({
    geometry,
    provideGui: (gui, mesh) => {
        const folder = gui.addFolder('THREE.PolyhedronGeometry')
        folder.add(props, 'geom', Object.keys(geometries)).onChange(() => updateMesh(mesh, updateGeometry(props)))
        folder.add(props, 'radius', 0, 10, 0.01).onChange(() => updateMesh(mesh, updateGeometry(props)))
        folder.add(props, 'detail', 0, 4, 1).onChange(() => updateMesh(mesh, updateGeometry(props)))
    }
}).then()

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
            camera.position.x = -3
            camera.position.z = 8
            camera.position.y = 2
            orbitControls.update()

            function animate() {
                requestAnimationFrame(animate)
                renderer.render(scene, camera)
                orbitControls.update()
            }

            animate()

            //const plane = hidefloor ?? foreverPlane(scene)
            scene.add(mesh)
            initializeRendererControls(gui, renderer)
            initializeSceneControls(gui, scene, false)

            initializeGuiMaterial(gui, mesh, material).close()
            initializeGuiMeshStandardMaterial(gui, mesh, material).close()
            //hidefloor ?? initializeMeshVisibleControls(gui, plane, 'Floor')
            provideGui(gui, mesh)
        })
    }

    init().then()
}

function updateMesh(mesh, geom) {
    mesh.geometry.dispose();
    mesh.geometry = geom;
}
