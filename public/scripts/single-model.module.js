import * as THREE from "https://cdn.skypack.dev/three@v0.137.0";
import lights from "/scripts/addLights.module.js";
import { GLTFLoader } from "/scripts/build/GLTFLoader.module.js";
import { DRACOLoader } from "/scripts/build/DRACOLoader.module.js";

let scene, camera, renderer;
const canvas = document.querySelector("canvas#single-model");
let sizes = { width: canvas.clientWidth, height: canvas.clientHeight };
const state = { ext: "", model: "" };

function init() {
  // initilizating scene
  scene = new THREE.Scene();

  // initilizing our perspective camera
  camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    200
  );

  camera.position.set(0, 0.75, 10);

  // adding the camera to the scene
  scene.add(camera);

  // canvas in our html
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas,
    alpha: true,
    powerPreference: "high-performance",
  });

  renderer.render(scene, camera);
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));

  lights.ambient(scene, THREE);
  lights.directional(scene, THREE);

  animate();
}

function addModel() {
  const loader = new GLTFLoader();
  const dl = new DRACOLoader();
  dl.setDecoderPath("/scripts/decoder/");
  loader.setDRACOLoader(dl);

  const source = `${state.model}/model.${state.ext}`;

  loader.load(source, handleSuccess, handleLoading, handleError);

  function handleSuccess(gltf) {
    // successfully loaded the model
    const mesh = gltf.scene;
    const meshBounds = new THREE.Box3().setFromObject(mesh);

    // Calculate side lengths of model1
    const lengthMeshBounds = {
      x: Math.abs(meshBounds.max.x - meshBounds.min.x),
      y: Math.abs(meshBounds.max.y - meshBounds.min.y),
      z: Math.abs(meshBounds.max.z - meshBounds.min.z),
    };
    const lengthRatios = [
      6 / lengthMeshBounds.x,
      6 / lengthMeshBounds.y,
      6 / lengthMeshBounds.z,
    ];

    const minRation = Math.min(...lengthRatios);
    mesh.scale.set(minRation, minRation, minRation);
    mesh.rotation.set(0, 0, 0);

    scene.add(mesh);
  }

  function handleLoading(xhr) {
    const percent = (xhr.loaded / xhr.total) * 100;
    console.log(percent);
  }

  function handleError(error) {
    console.error(error);
  }
}

function getInfo() {
  const para = document.querySelector(".info");

  fetch(`${state.model}/info.html`)
    .then((res) => {
      if (res.status === 200) return res.text();
      else throw new Error("not found");
    })
    .then((txt) => {
      para.innerHTML = txt;
    })
    .catch((err) => {
      console.error(err);
      para.textContent = "There's no info about this model.";
    });
}

function extractState() {
  const params = new URLSearchParams(window.location.search);
  const modelLink = params.get("model");
  if (!modelLink) {
    window.location = "/";
    return;
  }
  const ext = modelLink.split(".")[1];
  const index = modelLink.indexOf("model.") - 1;
  const model = modelLink.slice(0, index);

  state.ext = ext;
  state.model = model;
}

let prevTime = 0;
function animate() {
  // current time
  const currTime = Date.now();
  const delta = currTime - prevTime;
  const mesh = scene.children[scene.children.length - 1];

  if (mesh) {
    mesh.rotation.y += delta * 0.0005;
  }

  prevTime = currTime;

  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
}

init();
extractState();
addModel();
getInfo();
