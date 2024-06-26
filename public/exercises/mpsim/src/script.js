import * as THREE from "https://cdn.skypack.dev/three";

import { GLTFLoader } from "https://cdn.skypack.dev/three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "https://cdn.skypack.dev/three/examples/jsm/loaders/DRACOLoader.js";

import { OrbitControls } from "https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js";

// @author prisoner849




const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x242224);
document.body.appendChild(renderer.domElement);

camera.position.set(1.75, 1, 0);
camera.lookAt(0, 0, 0);

//controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.zoomSpeed = 2;
controls.maxPolarAngle = Math.PI * 0.5;
controls.update();

const vShader =
  `
  varying vec3 vPosition;
  varying vec2 vUv;
  void main() {
  	vPosition = position;
  	vUv = uv;
  	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }`;

const fShader = `
  uniform float time;
  uniform vec3 camPos;
  uniform vec2 resolution;
  uniform sampler2D tex;
  varying vec3 vPosition;
  varying vec2 vUv;
  #define MAX_STEPS 250
  #define MAX_DIST 100.
  #define SURF_DIST 1e-4
  #define PI 3.1415926

  vec3 colors[2];
  void initColors(){
    colors[0] = vec3(0.125);
    colors[1] = vec3(1, 1, 0.75);
  }

  mat2 Rot(float a) {
    float s = sin(a), c = cos(a);
    return mat2(c, -s, s, c);
  }

  float planeSDF(vec3 p) {
  	return p.y;
  }

  float sphereSDF(vec3 p, float r) {
  	return length(p)-r;
  }

  float sdTorus( vec3 p, vec2 t )
  {
      return length( vec2(length(p.xz)-t.x,p.y) )-t.y;
  }

  float sdTorusKnot(vec3 p, vec4 t){ //https://www.youtube.com/watch?v=2dzJZx0yngg
    float r1 = 1.7, r2=.3;
    vec2 cp = vec2(length(p.xz)-t.x, p.y);
    float a = atan(p.x, p.z); // polar angle between -pi and pi
    cp *= Rot(a*t.z);
    cp.y = abs(cp.y)-t.w;

    float d = length(cp)-t.y;

    return d * 0.5;
  }

  vec2 opMin(vec2 a, vec2 b){
    return a.x < b.x ? a : b;
  }

  vec2 GetDist(in vec3 p) {
      //float objectDist = sdTorusKnot(p, vec4(0.375, 0.0625, 2.5, 0.075));
      float objectDist = sdTorus(p, vec2(0.375, 0.125));
      float groundDist = p.y + 0.5;
      vec2 d = opMin(vec2(objectDist, 0.), vec2(groundDist, 1.));
      return d;
  }

  vec2 RayMarch(vec3 ro, vec3 rd) {
  	vec2 dO=vec2(0.);
  	for(int i = 0; i < MAX_STEPS; i++) {
  		vec3 p = ro + rd*dO.x;
  		vec2 dS = GetDist(p);
  		dO.x += dS.x;
      dO.y = dS.y;
  		if(dO.x>MAX_DIST || dO.x<SURF_DIST) break;
  	}
  	return dO;
  }

  vec3 GetNormal(vec3 p) {
  	float d = GetDist(p).x;
  	vec2 e = vec2(SURF_DIST, 0);

  	vec3 n = d - vec3(
  		GetDist(p-e.xyy).x,
  		GetDist(p-e.yxy).x,
  		GetDist(p-e.yyx).x);

  	return normalize(n);
  }

  float GetShadow(in vec3 p, in vec3 l) {
  	float t = SURF_DIST;
  	float t_max = MAX_DIST;

  	float res = 1.0;
  	float ph = 1e20;
  	for(int i = 0; i < 256; ++i) {
  		if(t > t_max) break;
  		float h = GetDist(p+t*l).x;
  		if(h < SURF_DIST/10.) return 0.0;
  		float y = h*h/(2.0*ph);
  		float d = sqrt(h*h-y*y);
  		ph = h;
  		t += d;
  		res = min(res, 4.*d/max(0.,t-y));
  	}
  	return res;
  }

  float GetAo(vec3 p, vec3 n) {
  	float occ = 0.;
  	float sca = 1.;
  	for(int i = 0; i < 5; i++) {
  		float h = 0.001 + 0.15*float(i)/4.0;
  		float d = GetDist(p+h*n).x;
  		occ += (h-d)*sca;
  		sca *= 0.95;
  	}
  	return clamp( 1.0 - 1.5*occ, 0.0, 1.0 );
  }

  float GetLight(vec3 p, vec3 lPos) {
  	vec3 l = normalize(lPos-p);
  	vec3 n = GetNormal(p);

  	float dif = clamp(dot(n, l), 0., 1.);
  	float s = GetShadow(p, l);
  	dif *= s;
  	return dif;
  }

  void main() {

    initColors();

  	vec2 uv = vUv-.5;
  	vec3 ro = camPos;
  	vec3 rd = normalize(vPosition - ro);
  	vec2 d = RayMarch(ro, rd);
  	vec3 col = vec3(0);

  	vec3 p = ro + rd * d.x;
  	vec3 lightPos = vec3(3, 6, -6);
  	vec3 dir = vec3(GetLight(p, lightPos));
  	vec3 indir = vec3(.051*GetAo(p, GetNormal(p)));
  	col = dir+indir;

    // color
    int cId = int(d.y);
    vec3 diffC = colors[cId];
    if(cId == 0) { // specifically for a torus
      vec2 tUv = vec2( atan(p.z,p.x), atan(length(p.xz)-0.375,p.y) );
      tUv = 1. - (tUv + PI) / PI * 0.5;
      tUv *= vec2(30.,10.);
      tUv.y += time * 0.5;

      // http://madebyevan.com/shaders/grid/
      vec2 grid = abs(fract(tUv - 0.5) - 0.5) / fwidth(tUv);
      float line = 1. - min( min(grid.x, grid.y), 1.0);
      diffC = mix(diffC, vec3(0, 1, 0.5), line);
    }
    if(cId == 1) { // if it's the floor then make it checkered
      vec3 fp = floor(p*2.);
      float checkers = clamp(mod(fp.x + fp.z , 2.), 0., 1.) * 0.5 + 0.5;
    	diffC *= checkers;
    }
    col *= mix(diffC, vec3(1), smoothstep(1., 5., length(p.xz)));

  	col = pow(col, vec3(.4545));

    if (gl_FrontFacing){ // textured borders on front side
     vec3 img = texture2D(tex,vUv).rbg;
     vec2 fw = fwidth(vUv);
     float e = min(fw.x, fw.y);
     float s = smoothstep(0.45, 0.45 + e, max(abs(uv.x), abs(uv.y)));
     col = mix(col, img, s);
    }
  	gl_FragColor = vec4( col, 0. );
  }
  `;

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.ShaderMaterial({
  uniforms: {
    camPos: {
      value: new THREE.Vector3().copy(camera.position)
    },
    resolution: {
      value: new THREE.Vector2(window.innerWidth, window.innerHeight)
    },
    tex: {
      value: new THREE.TextureLoader().load("https://threejs.org/examples/textures/uv_grid_opengl.jpg")
    },
    time: {
      value: 0
    }
  },
  vertexShader: vShader,
  fragmentShader: fShader,
  side: THREE.DoubleSide
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

let v = new THREE.Vector3();
controls.addEventListener("change", event => {
  v.copy(camera.position);
  cube.worldToLocal(v);
  material.uniforms.camPos.value.copy(v);
}, false);
//window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

let clock = new THREE.Clock();
renderer.setAnimationLoop( _ => {
  let t = clock.getElapsedTime();
  material.uniforms.time.value = t;
  cube.rotation.y += 0.01;
  //cube.rotation.x += 0.005;
  v.copy(camera.position);
  cube.worldToLocal(v);
  material.uniforms.camPos.value.copy(v);
  renderer.render(scene, camera);
});
