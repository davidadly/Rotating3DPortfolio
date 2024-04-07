import * as THREE from "https://cdn.skypack.dev/three";

import { GLTFLoader } from "https://cdn.skypack.dev/three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "https://cdn.skypack.dev/three/examples/jsm/loaders/DRACOLoader.js";

import { OrbitControls } from "https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js";

/**
 * Base
 */

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const gltfLoader = new GLTFLoader();

var island;
// Camera
gltfLoader.load(
  "/portfolio/angelisland/angelisland.glb",
  function (gltf) {
    // gltf.scene.scale = new Vector3((.5,.5,.5))
    gltf.scene.traverse(function (child) {
      if (child.isMesh) {
        child.material.emissiveIntensity = 0;
      }
    });
    island = gltf.scene;
    island.scale.set(0.1, 0.1, 0.1);
    island.position.set(0, 0, 0);
    scene.add(island);
  },
  undefined,
  function (e) {
    console.error(e);
  }
);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Create camera and where it looks at
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(0, 1, 0);
directionalLight.lookAt(1.831, -0.44660155114685907, 214.2333172582921);
scene.add(directionalLight);

// Create geometry and material
// Geometry is a sphere that the rest of the model is inside of
var skyGeo = new THREE.SphereGeometry(100000, 25, 25);
var loader = new THREE.TextureLoader();
var texture = loader.load("/portfolio/angelisland/sky.png");
var material = new THREE.MeshPhongMaterial({
  map: texture,
});
// Make the sky geo a mesh
var sky = new THREE.Mesh(skyGeo, material);
sky.material.side = THREE.BackSide;
scene.add(sky);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
// Resizes the canvas to fill browser window dynamically
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100000
);
camera.position.set(0, 100, 500);
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// renderer.setClearColor(0xEEEEEE);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(1.831, -0.44660155114685907, 214.2333172582921);
controls.enableDamping = true;
controls.enableZoom = true;

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Model animation

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
