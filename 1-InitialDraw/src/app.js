import * as THREE from '../../node_modules/three/build/three.module.js';
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

export let speed = 0.01;
let spotLight;
let objects = [];

document.body.onload = () => {
    main();
    const speedUpBtn = document.querySelector("#speedUp");
    const speedDownBtn = document.querySelector("#speedDown");

    speedUpBtn.onclick = () => {
        speedUp();
    }
    speedDownBtn.onclick = () => {
        speedDown();
    }
}

function main() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    camera.position.z = 5;
    camera.position.y = 5;
    

    // Controles
    const controls = new OrbitControls( camera, renderer.domElement );

    // Lights
    setUpLights();
    
    let el = drawCube(0xFF0000);
    el.position.z = 0;
    el.position.y = 3;
    scene.add(el);
    objects.push(el);

    camera.lookAt(el.position);

    let plane = drawPlane(10, 10, 4, 4, 0x404040, true);
    plane.rotation.x = Math.PI / 2;
    scene.add(plane);


    

    animate();
}

function drawCube(color, wireframe = false) {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshPhongMaterial({
        color,
        wireframe
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.castShadow = true;
    return cube;
}

function drawPlane(w, h, sw, sh, color, ds = false) {
    const geometry = new THREE.PlaneGeometry( w,h, sw, sh );
    const material = new THREE.MeshPhongMaterial({ color, side: ds ? THREE.DoubleSide : undefined });
    const plane = new THREE.Mesh(geometry, material);
    plane.receiveShadow = true;
    return plane;
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    objects[0].rotation.x += speed;
    objects[0].rotation.y += speed;

    // cube.rotation.x += speed;

    const speedLabel = document.querySelector("#speed");
    speedLabel.innerHTML = speed;
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

     // lightHelper = new THREE.SpotLightHelper( spotLight );
     // scene.add( lightHelper );
}

function speedUp() {
    console.log("Subiendo velocidad");
    speed += 0.01;
}

function speedDown() {
    speed -= 0.01;
}
