import { GLTFLoader } from "/scripts/build/GLTFLoader.module.js";
import { DRACOLoader } from "/scripts/build/DRACOLoader.module.js";
import * as THREE from "https://cdn.skypack.dev/three@v0.137.0";
import { updateInfoBox } from "/scripts/events.module.js";
let store, carousel;

// some dom elements  that we need
const loadingCon = document.querySelector(".loading");
const loadingPer = document.querySelector(".loading-per");
const prevBtnCon = document.querySelector(".cNext");
const nxtBtnCon = document.querySelector(".cPrev");

// set the loading
function toggleLoading(value) {
  // if it's true
  if (value) {
    // show the loading con
    loadingCon.classList.add("active");

    // disable next and previous btn
    prevBtnCon.setAttribute("disabled", true);
    nxtBtnCon.setAttribute("disabled", true);

    // set move cursor
    document.body.classList.add("wait");
  } else {
    loadingCon.classList.remove("active");

    nxtBtnCon.removeAttribute("disabled");
    prevBtnCon.removeAttribute("disabled");

    document.body.classList.remove("wait");
  }
}

// set loading percentage
function setLoadingPer(value) {
  loadingPer.textContent = value + " %";
}

/**
 * remove a model
 * @param  point
 */
function removeModel(point) {
  // loop through all the children of carousel
  // and once we find it by comparing the positino
  // them remove it
  for (let i = 1; i < carousel.children.length; i++) {
    const item = carousel.children[i];
    const { x, y, z } = item.position;
    if (x === point[0] && y === point[1] && z === point[2])
      item.parent.remove(item);
  }
}

/**
 * Add a new model to the carousel
 * @param  modelI
 * @param  point
 * @param  state
 */
function addModel(modelI, point, state) {
  // before adding set the loadin gto true
  state.loading = true;
  // and show the loadin contqiaer
  toggleLoading(state.loading);

  // loader
  const loader = new GLTFLoader();

  const dl = new DRACOLoader();
  dl.setDecoderPath("/scripts/decoder/");
  loader.setDRACOLoader(dl);

  // loadin the model
  loader.load(store[modelI].model, handleSuccess, handleLoading, handleError);

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
      3 / lengthMeshBounds.x,
      3 / lengthMeshBounds.y,
      3 / lengthMeshBounds.z,
    ];

    const minRation = Math.min(...lengthRatios);
    // scaling
    mesh.scale.set(minRation, minRation, minRation);
    // position
    mesh.position.set(...point);
    // rotation
    if (store[modelI].rotation) mesh.rotation.set(...store[modelI].rotation);
    else mesh.rotation.set(0, 0, 0);

    mesh.userData.title = store[modelI].title;
    mesh.userData.link = store[modelI].link;
    mesh.userData.model = store[modelI].model;

    carousel.add(mesh);

    state.loadPercent = 0;
    state.loading = false;

    setLoadingPer(state.loadPercent);
    toggleLoading(state.loading);
  }

  function handleLoading(xhr) {
    const percent = (xhr.loaded / xhr.total) * 100;
    state.loadPercent = parseInt(percent);
    setLoadingPer(state.loadPercent);
  }

  function handleError(error) {
    console.error(error);
  }
}

/**
 * loading initial models
 * @param  state
 * @param  s - store
 * @param  c - carousel
 */

async function loadModels(state, s, c, isMain) {
  // import s from storeLink;
  store = s;
  carousel = c;
  let modelIndex = 0;
  // if it's not the main we should skip first 2 points, i.e top and bottom
  // loop thtough all the points (except the one at the back)
  for (let i = isMain ? 0 : 2; i < state.points.length - 1; i++) {
    // add a model there
    addModel(modelIndex, state.points[i], state);
    // update state
    state.currentModels.push(modelIndex);
    modelIndex++;
  }

  // remove first 2 points as we don't need to keep track of them
  state.points.splice(0, 2);

  state.toAddPoint = state.points.length - 1;
  state.nxtModelIndex = modelIndex - 1;

  if (isMain) state.currentActiveModelIndex = 3;
  else state.currentActiveModelIndex = 1;
  updateInfoBox(store);
}

export { addModel, removeModel, loadModels };
