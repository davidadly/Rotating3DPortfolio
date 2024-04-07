// import { OrbitControls } from "https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js";
import Stats from "/scripts/build/stats.module.js";
import * as dat from "/scripts/build/dat.gui.module.js";

// export default function addDebuggingTools(camera, scene, renderer, THREE) {
function debuggingTools(camera, scene, renderer, THREE) {
  // initilizing dat gui
  const guiD = new dat.GUI();

  // dat-gui camera position
  const guiCamera = guiD.addFolder("Camera");
  guiCamera.add(camera.position, "x", -100, 100, 1);
  guiCamera.add(camera.position, "y", -100, 100, 1);
  guiCamera.add(camera.position, "z", -100, 100, 1);

  // dat-dui camera rotation
  const guiCameraRot = guiD.addFolder("Camera Rot");
  guiCameraRot.add(camera.rotation, "x", -Math.PI, Math.PI, 0.01);
  guiCameraRot.add(camera.rotation, "y", -Math.PI, Math.PI, 0.01);
  guiCameraRot.add(camera.rotation, "z", -Math.PI, Math.PI, 0.01);

  // camera helper
  const cameraHelper = new THREE.CameraHelper(camera);
  scene.add(cameraHelper);

  // axes helper
  const axesHelper = new THREE.AxesHelper(20);
  scene.add(axesHelper);

  // stat js

  const appStatsD = new Stats();
  appStatsD.showPanel(1);
  document.body.appendChild(appStatsD.dom);

  // orbit controller
  // const controlsD = new OrbitControls(camera, renderer.domElement);
  // controlsD.enableDamping = true;
  // controlsD.rotateSpeed = 0.5;

  // controlsD.update();
  return { guiD, controlsD, appStatsD };
}
export default { add: debuggingTools };
