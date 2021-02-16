import * as THREE from '../../node_modules/three/build/three.module.js';
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls.js';
import * as dat from '../../node_modules/three/examples/jsm/libs/dat.gui.module.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const palette = {
    bgColor: '#2c3e50', // CSS string
    planeColor: 0xffff00, // HEX
    c3: [ 0, 128, 255, 0.3 ], // RGB with alpha
    c4: { h: 350, s: 0.9, v: 0.3 } // Hue, saturation, value
};

export let speed = 0.01;
let spotLight;
let objects = {};

document.body.onload = () => {
    main();
}

window.onresize = () => {
    console.log("acá hacen su tarea");
}

function main() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.setClearColor(palette.bgColor, 1);
    document.body.appendChild(renderer.domElement);

    camera.position.z = 20;
    camera.position.y = 0;
    
    // Controles
    const controls = new OrbitControls(camera, renderer.domElement);
    // GUI
    loadGUI();
    // Lights
    setUpLights();


    const geometry = new THREE.PlaneGeometry( 10,10,4 );
    const material = new THREE.MeshBasicMaterial( {color: palette.planeColor, side: THREE.DoubleSide} );
    const plane = new THREE.Mesh(geometry, material);
    objects.plano = plane;
    scene.add(plane);
    console.log(objects);
    

    // Animar escena
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    updateElements();
    renderer.render(scene, camera);
}

function updateElements() {
    renderer.setClearColor(palette.bgColor, 1);
    objects.plano.material.color = new THREE.Color(palette.planeColor);
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
    scene.add( spotLight );
}

function loadGUI() {
    const gui = new dat.GUI();
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
}
