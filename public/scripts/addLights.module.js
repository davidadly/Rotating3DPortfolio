/**
 * method to add ambient light on scene
 * @param  scene
 * @param  THREE
 */
function addAmbientLight(scene, THREE) {
  const color = 0x0db2fe;
  const intensity = 0.5;
  const hLight = new THREE.AmbientLight(color, intensity);
  scene.add(hLight);
}

/**
 * method to add directional light on the scene
 * @param scene
 * @param THREE
 */

function addDirLight(scene, THREE) {
  const color = 0x0db2fe;
  const intensity = 0.9;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(5, 20, 20); // light position
  scene.add(light);
  scene.add(light.target); // don't why i have to do this
}

export default { ambient: addAmbientLight, directional: addDirLight };
