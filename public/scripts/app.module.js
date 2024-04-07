// Here we are importing bunch of shit
// like createDiamonds, light etc I moved them to their own seperate module
// to make things cleaner

import * as THREE from "https://cdn.skypack.dev/three@v0.137.0";
import { createDiamond } from "/scripts/diamond.module.js";
import lights from "/scripts/addLights.module.js";
import debuggingTools from "/scripts/debuggingTools.module.js";
import { loadModels } from "/scripts/model.module.js";
import eventListener from "./events.module.js";

const APP = (store, isMain = false) => {
  // This object determins the state of our app
  let state = {
    isDebug: false, // is debugging more true or false
    camera: "center", // current camera position
    rotation: { from: 0, to: 0 }, // when rotating the carousel/diamond when moving from left to right
    points: [], // points where our models are
    toAddPoint: null, // where should the next model go
    currentModels: [], // current models
    nxtModelIndex: 0, // next model index
    loading: true, // is there any model  loading
    loadPercent: 0, // how much it has loaded
    currentActiveModelIndex: null,
  };

  window.state = state;

  // These are some global variables like scene, camra remder etc
  let scene, camera, renderer;
  let sizes = { width: window.innerWidth, height: window.innerHeight };
  let controls, appStats;
  // this is the carousel group which include the diamond shap and the models
  let carousel = new THREE.Group();
  window.carousel = carousel;

  // our init function this function should execute first
  async function init() {
    // initilizating scene
    scene = new THREE.Scene();
    // adding carousel group to the scene
    scene.add(carousel);

    // initilizing our perspective camera
    camera = new THREE.PerspectiveCamera(
      45, // fov
      sizes.width / sizes.height, // aspect ratio
      0.1, // near viewer - can't see object which are closer then 0.1 from camera
      100 // far view - we can't see object that are at 100+ distance from camera
    );
    // setting it up and inwards (towards z-axis)
    camera.position.set(0, 0.75, 25);

    // adding the camera to the scene
    scene.add(camera);

    // canvas in our html
    const canvas = document.querySelector("canvas#scene");
    // initilizaing the renderer
    renderer = new THREE.WebGLRenderer({
      antialias: true, // this will improve the edges
      canvas, // canvas object
      alpha: true, // opacity true
      powerPreference: "high-performance", // we want the hight performance
    });
    // calling render with scene and the camera
    renderer.render(scene, camera);
    // setting size of the renderer
    renderer.setSize(sizes.width, sizes.height);
    // setting Pixel ratio - we don't want more then 2
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));

    // here we are calling create diamond method with 15 width 15 height and THREEJS
    // it returns the diamond mesh and the coordinates
    const { diamond, points } = createDiamond(15, 15, THREE);
    //  we are savings the coordinates in our state.points
    state.points = points;
    // adding the diamond to the carousel
    carousel.add(diamond);

    // here we are adding some lights
    lights.ambient(scene, THREE);
    lights.directional(scene, THREE);
    // now we are loading the models
    loadModels(state, store, carousel, isMain);

    // if the debugger mode is on
    if (state.isDebug) {
      // then we are calling the addDebugginTools method
      const { controlsD, appStatsD } = debuggingTools.add(
        camera,
        scene,
        renderer,
        THREE
      );
      // here we are setting the global variables
      controls = controlsD;
      appStats = appStatsD;
    }
    // calling animate function
    animate();
  }

  // this variable will keep track of the time the aniamte function was called previously
  let prevTime = Date.now();

  // this method is used to animate the camera
  // it accept the delta (time difference between each call)
  function animateCamera(delta) {
    // when the debugging mode is on we don't need to animate it we can just drage our mouse
    // also it looks ugly in debugging mode
    // as in orbit conrol the camera always looks at (0, 0, 0)
    if (!state.isDebug) {
      // rotation speed of the diamond/carousel
      const rotSpeed = 0.001 * delta;
      // movement speed of our camera
      const moveSpeed = 0.01 * delta;
      // camera current position along with y axis
      const { y: cPy } = camera.position;

      // if we wanna go up or down
      // and our camera is already there
      if (
        (state.camera === "up" && cPy >= 15) ||
        (state.camera === "down" && cPy <= -14)
      ) {
        // curent rotation angle along y axis
        const { y } = carousel.rotation;
        // where should  we rotate (final)
        const { to } = state.rotation;
        // where should  we rotate (right now)
        const val = y + rotSpeed;

        // if  our vl is gretter then our final rotation + 180 deg
        // then add 2 Pi to it as we want to rotate infinitly (as long as the camera is at top or bottom)
        if (val > to + Math.PI) state.rotation.to += Math.PI * 2;

        // rotate the carousel
        carousel.rotation.y = val;
        // if the camera is going up
      } else if (state.camera === "up") {
        // keep moving up
        camera.position.y += moveSpeed;
        // if it's going down
      } else if (state.camera === "down") {
        // keep going down
        camera.position.y -= moveSpeed;
        // if it's in the center
      } else if (state.camera === "center") {
        // if camera is above 0.8 then move it down
        if (cPy > 0.8) camera.position.y -= moveSpeed;
        // else if it's below 0.7 move it up; the diff in 0.1 is to remove unwanted glitches
        else if (cPy < 0.7) camera.position.y += moveSpeed;
        // (0.8 and 0.7) are limits ( i forgot the actual mathematical term let's just call it room for error)
        // ideally we want them both to be 0.0
        else {
          // in case it's in the center i.e at the 0 along y axis
          // at what rotation we want it to be
          const { to } = state.rotation;
          // current roation along y axis
          const { y } = carousel.rotation;
          // the differnce
          const diff = y - to;
          // as long as the diff is greter then 0.01 we keep rotation
          // again ideally we want it to be 0.0
          if (Math.abs(diff) > 0.01) {
            // if the diff is greater then 0 i.e. positive rotate it clockwise
            if (diff > 0) carousel.rotation.y -= rotSpeed;
            // otherwise rotate ii anticlock wise
            else carousel.rotation.y += rotSpeed;
          }
        }
      }
    }
  }

  // animate function this will run every second like 60 times
  function animate() {
    // stats
    if (state.isDebug) appStats.begin();

    // current time
    const currTime = Date.now();
    // difference between current time and the last time this function was executed
    // we are doing this so that our animations are consistant across all devices
    // otherwise on some computers with higher graphics our animation will run quickly
    // while on other computers with lower graphics it will run slowly
    const delta = currTime - prevTime;
    prevTime = currTime;

    // function to animate the camera
    animateCamera(delta);

    // rotate all models
    carousel.children.forEach((item, i) => {
      // at zero it's the diamond and we don't wanna rotate that
      if (i !== 0) {
        item.rotation.y += 0.0005 * delta;
      }
    });

    // update the view
    renderer.render(scene, camera);
    // app stats
    if (state.isDebug) {
      appStats.end();
      controls.update(); // orbit controls
    }

    // for animation
    window.requestAnimationFrame(animate);
  }

  init();
  eventListener(state, store, { carousel, camera, renderer, isMain });

  return { carousel, renderer, scene, camera };
};

export { APP };
