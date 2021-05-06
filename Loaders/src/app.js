import * as THREE from '../../node_modules/three/build/three.module.js';
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls.js';
import Sound from '../src/Sound.js';
import Player from '../src/Player.js';
import Control from '../src/Controls.js';
import CollidableBox from '../src/CollidableBox.js';
import { TexturesManager, ObjsManager } from './LoadersManager.js';

export const players = [];

export const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
const renderer = new THREE.WebGLRenderer();

let plane = undefined;
let localPlayer = 0;
const objects = {};
let controls = undefined;

const lights = {
    sp: undefined
};

const textures = [];

let platform2 = undefined
let delta = 0

export const collidableList = [];

export const sounds = [];
let spotLight;

window.onload = () => {
    main()
}

window.onresize = () => {
    camera.aspect = window.innerWidth/ window.innerHeight;
    camera.updateProjectionMatrix();
   renderer.setSize(window.innerWidth, window.innerHeight, true);
}

export async function main() {

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    camera.position.z = 1500;
    camera.position.y = 1500;
    
    // Controles
    controls = new OrbitControls(camera, renderer.domElement);
    // Lights
    setUpLights();
    // console.log(TexturesManager)
    // Textura con carga sincronica
    //console.log("Cargando textura necesaria");
    const texture = await TexturesManager.load("../convinientlyPlacedTextures/modern_floor_texture_04.jpg");
    texture.repeat.set(4, 4);
    texture.wrapS = THREE.MirroredRepeatWrapping;
    texture.wrapT = THREE.MirroredRepeatWrapping;
    textures.push(texture);
    //console.log("Textura necesaria cargada");
    // Texturas con carga asincronica (pasivas)
    //console.log("Cargando texturas en segundo plano");
    TexturesManager.pasiveLoad("../convinientlyPlacedTextures/radioactive.jpg", (texture) => {
        textures.push(texture);
       // console.log(textures);
       // console.log("Soy radioactivo y cargué!");
    });
    TexturesManager.pasiveLoad("../convinientlyPlacedTextures/solidRock.jpg", (texture) => {
        textures.push(texture);
       // console.log(textures);
      //  console.log("Soy la roca y cargué");
    });
    //console.log("Se supone que ya cargaron las texturas en segundo plano");

    // Plano base
   
    const geometry = new THREE.PlaneGeometry( 2000,2000,20,20 );
    const material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide, wireframe: false, map: texture} );
    plane = new THREE.Mesh( geometry, material );
    scene.add(plane);
    plane.rotation.x = Math.PI / 2;

    // console.log(plane.material);
    
    setInterval(() => {
        const index = Math.floor(Math.random() * textures.length);
        textures[index].repeat.set(4, 4);
        textures[index].wrapS = THREE.MirroredRepeatWrapping;
        textures[index].wrapT = THREE.MirroredRepeatWrapping;
        plane.material.map = textures[index];
    }, 5000);

    const obj = await ObjsManager.load("../models/iphone.obj");
    obj.position.y = 100;
    scene.add(obj);
    
    //modern_floor_texture_04.jpg

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    updateElements();
    renderer.render(scene, camera);
}

function updateElements() {
    delta += 0.01;
    renderer.setClearColor(0x000, 1);
    
}

function setUpLights() {
    const ambient = new THREE.AmbientLight( 0xffffff, 0.1 );
    scene.add( ambient );

    spotLight = new THREE.SpotLight( 0xffffff, 1 );
    spotLight.position.set( 0, 10, 0 );
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.1;
    spotLight.decay = 2;
    spotLight.distance = 200;

    spotLight.castShadow = true;
    scene.add(spotLight);

    // const spotLightHelper = new THREE.SpotLightHelper(spotLight);
    // scene.add( spotLightHelper );
    
    lights.sp = spotLight;
}
