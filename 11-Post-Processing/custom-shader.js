import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader'
import GUI from 'lil-gui'

import { initScene } from '../shared/bootstrap'
import { initializeRendererControls } from '../shared/renderer-control'
import { initializeSceneControls } from '../shared/scene-controls'
import { floatingFloor } from '../shared/floor'

const BasicCustomShader = {
    uniforms: {},

    // vertexshader is always the same for postprocessing steps
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,

    fragmentShader: `
        void main() {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }`,
}

const effectCopy = new ShaderPass(CopyShader)
effectCopy.renderToScreen = true
const customShader = new ShaderPass(BasicCustomShader)

function setupComposer(renderer, scene, camera) {
    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))
    //composer.addPass(customShader)
    composer.addPass(effectCopy)
    return composer
}

function anim(renderer, composer) {
    renderer.autoClear = false
    requestAnimationFrame(() => anim(renderer, composer))
    composer.render()
}

bootstrapMeshScene({
    addControls: (camera, renderer, scene, gui) => {
        return gui
    },
    initializeComposer: (renderer, scene, camera) => setupComposer(renderer, scene, camera),
    animate: (renderer, composer, mixer, clock) => anim(renderer, composer, mixer, clock)
}).then()


async function bootstrapMeshScene({
    provideGui,
    addControls,
    initializeComposer,
    animate
}) {
    const props = {
        backgroundColor: 0xffffff,
        disableDefaultControls: true
    }

    const clock = new THREE.Clock()
    const loader = new GLTFLoader()
    const mesh = await loader.loadAsync('/assets/models/truffle_man/scene.gltf').then((container) => {
        container.scene.scale.setScalar(4)
        container.scene.translateY(-2)
        container.scene.traverse((child) => {
            if (child.material) {
                child.material.depthWrite = true
                child.castShadow = true
                child.receiveShadow = true
            }
        });
        container.scene.name = 'mushroom-man'
        return container.scene
    })

    const gui = new GUI()

    const init = async () => {
        initScene(props)(({ scene, camera, renderer }) => {
            renderer.shadowMap.type = THREE.PCFSoftShadowMap
            camera.position.x = -3
            camera.position.z = 8
            camera.position.y = 2

            floatingFloor(scene, 8)
            scene.add(new THREE.AmbientLight(0xffffff, 0.5));
            const spotLight = new THREE.SpotLight(0xffffff, 150)
            spotLight.position.set(1, 5, 5)
            spotLight.shadow.mapSize.width = 2048
            spotLight.shadow.mapSize.height = 2048
            spotLight.shadow.camera.fov = 15
            spotLight.castShadow = true
            spotLight.decay = 1
            spotLight.penumbra = 0.05
            scene.add(spotLight);

            if (mesh) scene.add(mesh)

            const controls = new OrbitControls(camera, renderer.domElement);
            initializeRendererControls(gui, renderer)
            initializeSceneControls(gui, scene, false)

            const composer = initializeComposer(renderer, scene, camera, mesh)

            if (provideGui) provideGui(gui, mesh, scene)
            if (addControls) {
                addControls(camera, renderer, scene, gui, mesh)
            }

            animate(renderer, composer, clock)
        })
    }

    init().then()
}
