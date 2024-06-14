// Import Libraries
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

// Setting a canvas
const canvas = document.querySelector('canvas.webgl')

// Creating a scene
const scene = new THREE.Scene()

// // Basic geometry
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

// Materials
const boxMaterial = new THREE.MeshStandardMaterial()
// boxMaterial.map = boxTexture;
boxMaterial.roughness = 0.2;
boxMaterial.envMapIntensity = 0.7;

// Lights

const light = new THREE.AmbientLight( 0x404040, 10 ); // soft white light
scene.add( light );


// Import Models
const gltfLoader = new GLTFLoader()

gltfLoader.load('/3d_models/startCube.glb',
    (gltf) => {
        const obj = gltf.scene
        obj.traverse((child) => {
            if (child.isMesh) {
                child.material = boxMaterial
            }
        })
        scene.add(obj)
    }
)

// Viewport settings
const sizes = {
    width: Math.min(window.innerWidth, window.innerHeight),
    height: Math.min(window.innerWidth, window.innerHeight)
}

// Viewport resizing
window.addEventListener('resize', () => {
    const minSide = Math.min(window.innerWidth, window.innerHeight);
    sizes.width = minSide
    sizes.height = minSide

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Camera
const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height)
camera.position.set(-2, 1, -2)
scene.add(camera)

// Camera Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.maxPolarAngle = Math.PI / 1.95
controls.minDistance = 2
controls.maxDistance = 5
controls.enablePan = false

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animation
const tick = () => {
    // Update controls
    controls.update()

    // Update Camera Target
    camera.lookAt(new THREE.Vector3(0, 0, 0))

    // Renderer
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()
