import * as THREE from '../../node_modules/three/build/three.module.js';
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls.js';
import Sound from '../src/Sound.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

let plane = undefined;
let player = undefined;
const objects = {};
let controls = undefined;
const controller = {
    UP: { active: false, code: "KeyW" },
    RIGHT: { active: false, code: "KeyD" },
    DOWN: { active: false, code: "KeyS" },
    LEFT: { active: false, code: "KeyA" }
}
const lights = {
    sp: undefined
};

const speed = 0.05;

const sounds = [];
let soundsPlaying = false;
let spotLight;

window.onload = () => {
    main()
}

window.onkeypress = () => {
    if (!soundsPlaying) {
        sounds.forEach(sound => {
            sound.play();
        });
        soundsPlaying = true;
    } else {
        window.onkeypress = undefined;
    }
}

window.onresize = () => {
    camera.aspect = window.innerWidth/ window.innerHeight;
    camera.updateProjectionMatrix();
   renderer.setSize(window.innerWidth, window.innerHeight, true);
}

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

export function main() {

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    camera.position.z = 15;
    camera.position.y = 15;
    
    // Controles
    controls = new OrbitControls(camera, renderer.domElement);
    // Lights
    setUpLights();

    // Plano base
    const geometry = new THREE.PlaneGeometry( 20,20,20,20 );
    const material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide, wireframe: false} );
    plane = new THREE.Mesh( geometry, material );
    scene.add(plane);
    plane.rotation.x = Math.PI / 2;

    player = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1, 4, 4, 4),
        new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true
        })
    );
    player.position.x = -10;
    player.position.z = 5;
    player.position.y = 0.5;
    scene.add(player);

    sounds.push(new Sound(['./media/1.mp3'], 9, scene, { position: { x: -6, y:0, z: 6}, debug: false }));
    sounds.push(new Sound(['./media/2.mp3'], 9, scene, { position: { x: 6, y:0, z: 6}, debug: false }));
    sounds.push(new Sound(['./media/2.mp3'], 9, scene, { position: { x: -6, y:0, z: -6}, debug: false }));
    sounds.push(new Sound(['./media/2.mp3'], 9, scene, { position: { x: 6, y:0, z: -6}, debug: false }));
    
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    updateElements();
    renderer.render(scene, camera);
}

function updateElements() {
    renderer.setClearColor(0x000, 1);
    player.position.x = controller.LEFT.active ? player.position.x - speed : player.position.x;
    player.position.x = controller.RIGHT.active ? player.position.x + speed : player.position.x;
    player.position.z = controller.UP.active ? player.position.z - speed : player.position.z;
    player.position.z = controller.DOWN.active ? player.position.z + speed : player.position.z;

    sounds.forEach(sound => {
        sound.update(player);
    })
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
