import { DirectionalLight, MaterialLoader, MeshStandardMaterial } from "https://cdn.skypack.dev/three"



// import { ObjectLoader } from 'three'
/**
 * Base
 */
// Debug


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Models
 */
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

let mixer = null

// const loader = new ObjectLoader();

// // load a resource
// loader.load(
// 	// resource URL
// 	'/models/Fox/glTF/REduced Zara.obj',
// 	// called when resource is loaded
// 	function ( object ) {

// 		scene.add( object );

// 	},
// 	// called when loading is in progresses
// 	function ( xhr ) {

// 		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

// 	},
// 	// called when loading has errors
// 	function ( error ) {

// 		console.log( 'An error happened' );

// 	}
// );
// var mamouth;
// gltfLoader.load(
//     '/models/Fox/glTF/woolly-mammoth-100k-4096_std.glb',
//     (gltf) =>
//     {
//         mamouth = gltf.scene;
//         gltf.scene.scale.set(2, 2, 2)
//         gltf.scene.position.set(-.5, 6, 0)
//         scene.add(mamouth)

//         // Animation
//         // mixer = new THREE.AnimationMixer(gltf.scene)
//         // const action = mixer.clipAction(gltf.animations[3])
//         // action.play()
//     }
// )
var zara;

gltfLoader.load(
    '/exercises/zara-ring/static/models/Fox/glTF/azara.glb',
    function(gltf) {
        gltf.scene.name = 'test';
  gltf.scene.emissiveIntensity = 1;
  gltf.scene.rotation.x = - Math.PI /2
  gltf.scene.position.y = -5
  gltf.scene.traverse(function(child) {
        if (child.isMesh) {
          child.material.emissiveIntensity = 0;
                }
              });
              zara = gltf.scene;
              scene.add(zara);
     },
      undefined,
      function(e) {
            console.error(e);
     }
          );

        // Animation
        // mixer = new THREE.AnimationMixer(gltf.scene)
        // const action = mixer.clipAction(gltf.animations[3])
        // action.play()
/**
 * Floor
 */
// const floor = new THREE.Mesh(
//     new THREE.PlaneBufferGeometry(10, 10),
//     new THREE.MeshStandardMaterial({
//         color: '#444444',
//         metalness: 0,
//         roughness: 0.5
//     })
// // )
// floor.receiveShadow = true
// floor.rotation.x = - Math.PI * 0.5
// scene.add(floor)

/**
 * Lights
 */
// const spotLight = new THREE.SpotLight(0xffffff, 30, 30)
// scene.add(spotLight)
//
// const ambientLight = new THREE.AmbientLight(0xffffff, .5)
// scene.add(ambientLight)
//
// const directionalLight = new THREE.DirectionalLight(0xffffff, 100)
// directionalLight.castShadow = true
// directionalLight.shadow.mapSize.set(1024, 1024)
// directionalLight.shadow.camera.far = 15
// directionalLight.shadow.camera.left = - 7
// directionalLight.shadow.camera.top = 7
// directionalLight.shadow.camera.right = 7
// directionalLight.shadow.camera.bottom = - 7
// directionalLight.position.set(- 5, 5, 0)
// scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const dl = new THREE.DirectionalLight(0xffffff, 10)
dl.position.set(0,2,40)
scene.add(dl)

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 2, 30)
camera.lookAt(4,4,0)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Model animation
    if(mixer)
    {
        mixer.update(deltaTime)
    }
    if (zara) zara.rotation.z += 0.01;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
