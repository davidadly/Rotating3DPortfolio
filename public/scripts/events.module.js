// importing things we need
import * as THREE from "https://cdn.skypack.dev/three@v0.137.0";
import { addModel, removeModel } from "/scripts/model.module.js";
let carousel, camera, renderer, store;

// dom buts
const upBtn = document.querySelector(".cUp");
const downBtn = document.querySelector(".cDown");
const nextBtn = document.querySelector(".cNext");
const prevBtn = document.querySelector(".cPrev");
const infoBox = document.querySelector(".infobox p");

const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

// toggle left and right btns (when we are up and down we want to hide them)
function toggleNavBtns() {
  nextBtn.classList.toggle("hide");
  prevBtn.classList.toggle("hide");
}

// first 2 items in the store are special they are at the top and bottom of our diamond
function checkSpecialIndex(index, state) {
  return state.currentModels[index] === 0 || state.currentModels[index] === 1;
}

function updateInfoBox(store) {
  const index = state.currentModels[state.currentActiveModelIndex];
  const title = store[index]?.title;
  const link = store[index]?.link;

  if (link) infoBox.innerHTML = `<a href="${link}">${title}</a>`;
  else infoBox.textContent = title;
}
/**
 *  method to load the next model
 * @param state
 */

async function loadNext(state, isMain) {
  // which model to set
  let nxtModel = state.nxtModelIndex + 1;

  // if the next model is already in our current model list then keep on increasing
  while (
    state.currentModels.indexOf(nxtModel) !== -1 ||
    nxtModel >= store.length
  ) {
    if (nxtModel >= store.length) nxtModel = 0;
    else nxtModel++;
  }

  // model index to remove
  let remModelIndex = state.currentModels.length - 1;
  // if the model index to remove is special one then keep on decreasing
  while (true) {
    if (isMain && checkSpecialIndex(remModelIndex, state)) {
      remModelIndex--;
      if (remModelIndex < 0) remModelIndex = state.currentModels.length - 1;
    } else {
      state.currentModels.splice(remModelIndex, 1);
      break;
    }
  }

  // update the state
  state.nxtModelIndex = nxtModel;
  state.currentModels.unshift(state.nxtModelIndex);

  // add our new model
  addModel(state.nxtModelIndex, state.points[state.toAddPoint], state);

  // which point to set to
  let toRem = state.toAddPoint - 1;

  if (toRem < 0) toRem = state.points.length - 1;
  state.toAddPoint = toRem; // update point

  // remove model
  removeModel(state.points[toRem]);

  // update currentActiveModel
  let activeIndex = 1;

  while (isMain && checkSpecialIndex(activeIndex, state)) {
    activeIndex++;
    if (activeIndex >= state.currentModels.length) activeIndex = 1;
  }

  state.currentActiveModelIndex = activeIndex;
}

/**
 * Method to load the previous model
 * @param state
 */

async function loadPrev(state, isMain) {
  // save as loadNxt but in the opposite direction
  // model to remove
  let nxtModel = state.nxtModelIndex - 1;

  while (state.currentModels.indexOf(nxtModel) !== -1 || nxtModel < 0) {
    if (nxtModel < 0) nxtModel = store.length - 1;
    else nxtModel--;
  }

  let remModelIndex = 0;
  while (true) {
    if (isMain && checkSpecialIndex(remModelIndex, state)) {
      remModelIndex++;
      if (remModelIndex >= state.currentModels.length) remModelIndex = 0;
    } else {
      state.currentModels.splice(remModelIndex, 1);
      break;
    }
  }

  state.nxtModelIndex = nxtModel;
  state.currentModels.push(state.nxtModelIndex);
  addModel(state.nxtModelIndex, state.points[state.toAddPoint], state);

  // Poin to remove
  let toRem = state.toAddPoint + 1;

  if (toRem >= state.points.length) toRem = 0;
  state.toAddPoint = toRem;

  removeModel(state.points[toRem]);

  // update currentActiveModel
  let activeIndex = state.currentModels.length - 2;

  while (isMain && checkSpecialIndex(activeIndex, state)) {
    activeIndex--;
    if (activeIndex < 0) activeIndex = state.currentModels.length - 2;
  }

  state.currentActiveModelIndex = activeIndex;
}

/**
 * Event Listers on the dom btns
 * @param  state
 */
export default async function eventListener(state, s, obj) {
  // import s from storeLink;
  store = s;
  carousel = obj.carousel;
  camera = obj.camera;
  renderer = obj.renderer;
  let centerIndex;

  // only main have up and down models

  if (obj.isMain) {
    // when the user clicks up btn move the camera to the top
    upBtn.addEventListener("click", () => {
      camUpDown("up", "down");
      if (state.camera === "up") {
        centerIndex = state.currentActiveModelIndex;
        state.currentActiveModelIndex = state.currentModels.indexOf(0);
      } else state.currentActiveModelIndex = centerIndex;

      updateInfoBox(store);
    });

    // when the user clicks down btn move the camera to the bottom
    downBtn.addEventListener("click", () => {
      camUpDown("down", "up");
      if (state.camera === "down") {
        centerIndex = state.currentActiveModelIndex;
        state.currentActiveModelIndex = state.currentModels.indexOf(1);
      } else state.currentActiveModelIndex = centerIndex;
      updateInfoBox(store);
    });
  }

  /**
   * move camera
   * @param {*} newCamPosi  - where to move the camera
   * @param {*} prevCamPosi  - it's current position
   */
  function camUpDown(newCamPosi, prevCamPosi) {
    // if the camera isn't already at the new cam position  then hide the side btns
    if (state.camera !== newCamPosi) toggleNavBtns();
    // if the camera is at the previous position then set the camera state to center
    if (state.camera === prevCamPosi) state.camera = "center";
    // if it's already at the center then move the camera to the new poisition
    else if (state.camera === "center") state.camera = newCamPosi;
  }

  // load prev model when click prev btn
  prevBtn.addEventListener("click", () => {
    // basically we are rotating by 90 degrees (clockwise)
    const from = state.rotation.to;
    const to = state.rotation.to + Math.PI / 2;
    state.rotation = { from, to, dir: "next" };
    loadNext(state, obj.isMain); // invert effet
    updateInfoBox(store);
  });

  // load next model when click next btn
  nextBtn.addEventListener("click", () => {
    // basically we are rotating by 90 degrees (anticlcok)
    const from = state.rotation.to;
    const to = state.rotation.to - Math.PI / 2;
    state.rotation = { from, to, dir: "prev" };
    loadPrev(state, obj.isMain);
    updateInfoBox(store);
  });

  const canvas = document.querySelector("canvas");
  canvas.addEventListener(
    "click",
    (event) => {
      console.log("wanna redirect");
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      detect();
    },
    false
  );

  window.addEventListener("resize", onWindowResize);

  function detect() {
    raycaster.setFromCamera(pointer, camera);

    const models = carousel.children.slice(1);
    const intersects = raycaster.intersectObjects(models);

    if (intersects[0]) {
      let model = intersects[0].object;

      while (true && model) {
        const link = model.userData.link;
        const modelLink = model.userData.model;

        if (link) {
          window.location.pathname = link;
          break;
        } else if (modelLink) {
          window.location = `/single-model.html?model=${modelLink}`;
        }

        model = model.parent;
      }
    }
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
export { updateInfoBox };
