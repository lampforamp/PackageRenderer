// Import Libraries

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader'
import { texture } from 'three/examples/jsm/nodes/Nodes.js'

// Setting a canvas
const canvas = document.querySelector('canvas.webgl')

// Creating a scene
const scene = new THREE.Scene()

// Basic geometry
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

// Loading Textures
const textureLoader = new THREE.TextureLoader()

const normalMap = textureLoader.load('/3d/textures/Normal.png')
const colorMap = textureLoader.load('/3d/textures/Color.jpg')
const metalnessMap = textureLoader.load('/3d/textures/Metallic.jpg')
const roughnessMap = textureLoader.load('/3d/textures/Roughness.jpg')


colorMap.colorSpace = THREE.SRGBColorSpace

colorMap.flipY = false
normalMap.flipY = false
metalnessMap.flipY = false
roughnessMap.flipY = false

colorMap.generateMipmaps = false
normalMap.generateMipmaps = false


// Materials
const boxMaterial = new THREE.MeshStandardMaterial()
boxMaterial.map = colorMap;
boxMaterial.roughnessMap = roughnessMap;
boxMaterial.metalnessMap = metalnessMap;
boxMaterial.metalness = 1;
boxMaterial.normalMap = normalMap;
boxMaterial.envMapIntensity = 1;




// Import Models
const gltfLoader = new GLTFLoader()

gltfLoader.load('/3d/models/Brush.glb',
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



// Lights


const amblight = new THREE.AmbientLight( 0x404040, 10 ); // soft white light
scene.add( amblight );


const directionalLightBack = new THREE.DirectionalLight( 0xffffff, 3 );
directionalLightBack.position.set(5,5,5)
scene.add( directionalLightBack )


const directionalLightFront = new THREE.DirectionalLight( 0xffffff, 1 );
directionalLightFront.position.set(-10,3,-10)
scene.add( directionalLightFront )


// Environment Map
const rgbeLoader = new RGBELoader()
rgbeLoader.load('3d/textures/1.hdr', (environmentMap) =>
{
    environmentMap.mapping = THREE.EquirectangularReflectionMapping
    // scene.background = environmentMap
    scene.environment = environmentMap
})


// Viewport settings
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Viewport resizing
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Camera
const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height)
camera.position.set(0, 4, -20)

scene.add(camera)

// Camera Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.maxPolarAngle = Math.PI / 1.95
controls.minDistance = 10
controls.maxDistance = 25
controls.enablePan = false

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias:true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animation
const tick = () => {
    // Update controls
    controls.update()

    // Update Camera Target
    camera.lookAt(new THREE.Vector3(0, 3.5, 0))

    // Renderer
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()

