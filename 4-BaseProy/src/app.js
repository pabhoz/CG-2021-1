import * as THREE from '../../node_modules/three/build/three.module.js';
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls.js';
import * as dat from '../../node_modules/three/examples/jsm/libs/dat.gui.module.js';

let controls = undefined;
let gui = undefined;
const size = 0;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const palette = {
    bgColor: '#2c3e50', // CSS string
    planeColor: 0xbdc3c7, // HEX
    c3: [ 0, 128, 255, 0.3 ], // RGB with alpha
    c4: { h: 350, s: 0.9, v: 0.3 } // Hue, saturation, value
};

let plane = undefined;
const objects = {};
const lights = {
    sp: undefined
};

let spotLight;

window.onresize = () => {
    camera.aspect = window.innerWidth/ window.innerHeight;
    camera.updateProjectionMatrix();
   renderer.setSize(window.innerWidth, window.innerHeight, true);
}

function reset() {
    scene.children = [];
}
export function main(size) {

    reset();

    size = size;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.setClearColor(palette.bgColor, 1);
    document.body.appendChild(renderer.domElement);

    camera.position.z = 15;
    camera.position.y = 15;
    
    // Controles
    controls = new OrbitControls(camera, renderer.domElement);
    // GUI
    loadGUI();
    // Lights
    setUpLights();

    // Plano base
    const geometry = new THREE.PlaneGeometry( size, size, size, size );
    const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide, wireframe: true} );
    plane = new THREE.Mesh( geometry, material );
    scene.add(plane);
    plane.rotation.x = Math.PI / 2;

    loadTexturedCube({
        texture: '../convinientlyPlacedTextures/cartoonBox.jpeg',
    });

    loadTexturedCube({
        texture: '../convinientlyPlacedTextures/radioactive.jpg',
        position: {
            x: 2,
            y: 0.5,
            z: 0
        }
    });

    loadTexturedCube({
        w: 1,
        h: 1,
        d: 1,
        texture: '../convinientlyPlacedTextures/solidRock.jpg',
        color: 0xffffff,
        position: {
            x: -2,
            y: 0.5,
            z: 0
        }
    });

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    updateElements();
    renderer.render(scene, camera);
}

function updateElements() {
    renderer.setClearColor(palette.bgColor, 1);
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

function loadGUI() {
    cleanGUI();
    gui = new dat.GUI();
    console.log(gui);

    const folder1 = gui.addFolder('Carpeta 1');
    folder1.open();

    var person = {
        name: 'Sam',
        age: 45,
        favNumber: 4
    };
    // Ejemplo de Input de texto
    folder1.add(person, 'name');    
    folder1.add(person, 'favNumber');
    // Ejemplo de Slider
    folder1.add(person, 'age', 0, 100);
    // Ejemplo de paleta de colores
    folder1.addColor(palette, "bgColor");
    folder1.addColor(palette, "planeColor");
    folder1.addColor(palette, "c3");
    folder1.addColor(palette, "c4");
    gui.close();
}

export function cleanGUI() {
    const dom = document.querySelector(".dg.main");
    if (dom) dom.remove();
}

/**
 * 
 * @param {*} params
 * {
        w: 1,
        h: 1,
        d: 1,
        texture: '../convinientlyPlacedTextures/cartoonBox.jpeg',
        color: 0xffffff,
        position: {
            x: 0,
            y: 0.5,
            z: 0
        }
    } 
 */
function loadTexturedCube(params) {
    const geometry = new THREE.BoxGeometry(params.w && params.w || 1, params.h && params.h || 1, params.d && params.d || 1);
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(params.texture);

    const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        map: texture
    });
    
    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = params.position && params.position.x || 0;
    cube.position.y = params.position && params.position.y || 0.5;
    cube.position.z = params.position && params.position.z || 0;
    
    scene.add(cube);
}
