// a method to generate random numbers between -0.125 to 0.125
const genRandom = () => {
  let result = Math.random() - 0.5;
  result *= 0.25;
  return result;
};

/**
 *  this method will calculate all the position for the diamond texture
 * @param {*} width
 * @param {*} height
 * @returns position array
 */
const calculatePosition = (width, height) => {
  // how many diamond texture on each edge
  const count = 200;
  // we have 12 edges and each point requires 3 axises (x, y, z) hence count *12 * 3

  const positions = new Float32Array(count * 12 * 3);

  // current position index
  let index = 0;
  // top trianlge
  for (let i = 0; i < count * 12; i++) {
    const i3 = i * 3;

    let x, y, z;
    // this will helps us find which edge we should be working on now
    const rem = Math.floor(i / count);

    switch (rem) {
      // first is top left
      case 0:
        // determinds the x position
        x = -width + (index % height) + genRandom();
        // y position
        y = (index % height) + genRandom();
        // z position (it doens't change much)
        z = genRandom();
        // we are adding some randomness to each of them
        break;

      // first is top right
      case 1:
        x = width - (index % height) + genRandom();
        y = (index % height) + genRandom();
        z = genRandom();
        break;
      // and so on
      case 2:
        x = genRandom();
        y = (index % height) + genRandom();
        z = -width + (index % height) + genRandom();
        break;
      case 3:
        x = genRandom();
        y = (index % height) + genRandom();
        z = width - (index % height) + genRandom();
        break;
      case 4:
        x = (index % height) + genRandom();
        y = genRandom();
        z = width - (index % height) + genRandom();
        break;
      case 5:
        x = (index % height) + genRandom();
        y = genRandom();
        z = -width + (index % height) + genRandom();
        break;
      case 6:
        x = (-index % height) + genRandom();
        y = genRandom();
        z = width - (index % height) + genRandom();
        break;
      case 7:
        x = (-index % height) + genRandom();
        y = genRandom();
        z = -width + (index % height) + genRandom();
        break;
      case 8:
        x = width - (index % height) + genRandom();
        y = (-index % height) + genRandom();
        z = genRandom();
        break;
      case 9:
        x = -width + (index % height) + genRandom();
        y = (-index % height) + genRandom();
        z = genRandom();
        break;
      case 10:
        x = genRandom();
        y = (-index % height) + genRandom();
        z = -width + (index % height) + genRandom();
        break;
      case 11:
        x = genRandom();
        y = (-index % height) + genRandom();
        z = width - (index % height) + genRandom();
        break;

      default:
        x = -width + (index % height) + genRandom();
        y = (index % height) + genRandom();
        z = genRandom();
    }

    positions[i3 + 0] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;

    index += 0.2;
  }

  return positions;
};

/**
 * method to create the diamond
 * @param {*} width
 * @param {*} height
 * @param {*} THREE
 * @returns diamond mesh and points
 */
const createDiamond = (width, height, THREE) => {
  // initilizaing texture loader
  const textureLoader = new THREE.TextureLoader();
  // loading the texture
  const pointTexture = textureLoader.load("/assets/textures/9.png");

  // these are the points in space
  const a = [0, height, 0]; // top
  const b = [-width, 0, 0]; // left
  const c = [0, 0, width]; // front
  const d = [width, 0, 0]; // right
  const e = [0, 0, -width]; // back
  const f = [0, -height, 0]; // down

  // callding calculate position and storeing the positions in position variable
  const positions = calculatePosition(width, height);

  // create a buffer geometry  and provide it the the positions we just calculated
  const diamondG = new THREE.BufferGeometry();
  diamondG.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );
  diamondG.computeVertexNormals();

  // initizilaing point material
  const diamondM = new THREE.PointsMaterial({
    size: 1, // size of each point
    sizeAttenuation: true, // give us perspective sizing
    color: new THREE.Color("#2a85ec"), // color
    transparent: true, // opacity enable
    alphaMap: pointTexture, // texture
    depthWrite: false, // helps with transparency
  });

  // creating our point mesh
  const diamond = new THREE.Points(diamondG, diamondM);

  //  returning it
  return { points: [a, f, b, c, d, e], diamond };
};

export { createDiamond };
