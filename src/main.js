// Import Libraries
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Setting a canvas
const canvas = document.querySelector('canvas.webgl')

// Creating a scene
const scene = new THREE.Scene()

// Basic geometry
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

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
camera.position.set(0, 0, -10)
scene.add(camera)

// Camera Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.maxPolarAngle = Math.PI / 1.95
controls.minDistance = 5
controls.maxDistance = 15
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
