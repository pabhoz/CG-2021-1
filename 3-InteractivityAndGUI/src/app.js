import * as THREE from '../../node_modules/three/build/three.module.js';
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls.js';
import * as dat from '../../node_modules/three/examples/jsm/libs/dat.gui.module.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const palette = {
    bgColor: '#2c3e50', // CSS string
    planeColor: 0xbdc3c7, // HEX
    c3: [ 0, 128, 255, 0.3 ], // RGB with alpha
    c4: { h: 350, s: 0.9, v: 0.3 } // Hue, saturation, value
};

const controller = {
    UP: { active: false, code: "KeyW" },
    RIGHT: { active: false, code: "KeyD" },
    DOWN: { active: false, code: "KeyS" },
    LEFT: { active: false, code: "KeyA" }
}

const lights = {
    sp: undefined
};

let speed = 0.1;
let spotLight;
let objects = {};

document.body.onload = () => {
    main();
}

window.onresize = () => {
    camera.aspect = window.innerWidth/ window.innerHeight;
    camera.updateProjectionMatrix();
   renderer.setSize(window.innerWidth, window.innerHeight, true);
}

// window.onkeypress = () => { console.log("Presionado");}
window.onkeydown = (e) => { 
    switch (e.code) {
        case controller.UP.code:
            controller.UP.active = true;
            break;
        case controller.RIGHT.code:
            controller.RIGHT.active = true;
            break;
        case controller.DOWN.code:
            controller.DOWN.active = true;
            break;
        case controller.LEFT.code:
            controller.LEFT.active = true;
            break;
    }
}
window.onkeyup = (e) => { 
    switch (e.code) {
        case controller.UP.code:
            controller.UP.active = false;
            break;
        case controller.RIGHT.code:
            controller.RIGHT.active = false;
            break;
        case controller.DOWN.code:
            controller.DOWN.active = false;
            break;
        case controller.LEFT.code:
            controller.LEFT.active = false;
            break;
    }
}

function main() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.setClearColor(palette.bgColor, 1);
    document.body.appendChild(renderer.domElement);

    camera.position.z = 7;
    camera.position.y = 15;
    
    // Controles
    const controls = new OrbitControls(camera, renderer.domElement);
    // GUI
    loadGUI();
    // Lights
    setUpLights();


    const geometry = new THREE.PlaneGeometry( 15,15,4 );
    const material = new THREE.MeshBasicMaterial( {color: palette.planeColor, side: THREE.DoubleSide} );
    const plane = new THREE.Mesh(geometry, material);
    objects.plano = plane;
    objects.plano.rotation.x = Math.PI / 2;
    scene.add(plane);
    console.log(objects);

    for (let i = 0; i < 3; i++) {
        const geometry = new THREE.SphereGeometry(1, 36, 36);
        const color = 0xe74c3c;
        const material = i == 0 ?
            new THREE.MeshBasicMaterial({ color }) : i == 1 ?
                new THREE.MeshLambertMaterial({ color }) : new THREE.MeshPhongMaterial({ color });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.y = 1;
        sphere.position.x = -5 + (i * 5);
        scene.add( sphere ); 
    }
    
    // condición ? valor si true : valor si false;
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
    spotLight.position.x = controller.LEFT.active ? spotLight.position.x - speed : spotLight.position.x;
    spotLight.position.x = controller.RIGHT.active ? spotLight.position.x + speed : spotLight.position.x;
    spotLight.position.y = controller.UP.active ? spotLight.position.y + speed : spotLight.position.y;
    spotLight.position.y = controller.DOWN.active ? spotLight.position.y - speed : spotLight.position.y;
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

    const spotLightHelper = new THREE.SpotLightHelper(spotLight);
    scene.add( spotLightHelper );
    
    lights.sp = spotLight;
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
    gui.close();
}
