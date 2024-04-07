import * as THREE from "https://cdn.skypack.dev/three";

import { GLTFLoader } from "https://cdn.skypack.dev/three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "https://cdn.skypack.dev/three/examples/jsm/loaders/DRACOLoader.js";

import { OrbitControls } from "https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js";

// // Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Axes helper
 */
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load(
  "/exercises/13-3d-text/static/textures/matcaps/3.png"
);

/**
 * Fonts
 */
const fontLoader = new THREE.FontLoader();

fontLoader.load("/exercises/13-3d-text/static/textures/matcaps/3.png", (font) => {
  const textGeometry = new THREE.TextBufferGeometry("DXADLY", {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegment: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  //    textGeometry.computeBoundingBox()
  //    textGeometry.translate(
  //        - (textGeometry.boundingBox.max.x -.02) * .5,
  //        - (textGeometry.boundingBox.max.y -.02) * .5,
  //        - textGeometry.boundingBox.max.z * .5
  textGeometry.center();

  const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
  //    textMaterial.wireframe = true;
  const text = new THREE.Mesh(textGeometry, textMaterial);
  scene.add(text);

  const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45);
  const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

  for (let i = 0; i < 100; i++) {
    const donut = new THREE.Mesh(donutGeometry, donutMaterial);
    scene.add(donut);

    donut.position.x = (Math.random() - 0.5) * 10;
    donut.position.y = (Math.random() - 0.5) * 10;
    donut.position.z = (Math.random() - 0.5) * 10;

    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;

    const scale = Math.random();

    donut.scale.set(scale, scale, scale);
  }
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

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
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
