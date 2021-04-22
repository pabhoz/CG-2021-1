import * as THREE from '../../node_modules/three/build/three.module.js';
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls.js';
import Sound from '../src/Sound.js';
import Player from '../src/Player.js';
import Control from '../src/Controls.js';

export const players = [];

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

let plane = undefined;
let localPlayer = 0;
const objects = {};
let controls = undefined;

const lights = {
    sp: undefined
};

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

    const p1 = new Player("Player 1", undefined, new Control());
    p1.play(scene);
    const p2 = new Player("Player 2", undefined, new Control("i","l","k","j"));
    p2.element.position.x = 4;
    p2.play(scene);
    players.push(p1);
    players.push(p2);

    /*
    sounds.push(new Sound(['./media/1.mp3'], 9, scene, { position: { x: -6, y:0, z: 6}, debug: false }));
    sounds.push(new Sound(['./media/2.mp3'], 9, scene, { position: { x: 6, y:0, z: 6}, debug: false }));
    sounds.push(new Sound(['./media/2.mp3'], 9, scene, { position: { x: -6, y:0, z: -6}, debug: false }));
    sounds.push(new Sound(['./media/2.mp3'], 9, scene, { position: { x: 6, y:0, z: -6}, debug: false }));
    */
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    updateElements();
    renderer.render(scene, camera);
}

function updateElements() {
    renderer.setClearColor(0x000, 1);
    players.forEach(player => {
        player.updateControls();
        
        if (players.indexOf(player) == localPlayer) {
            sounds.forEach(sound => {
                sound.update(player.element);
            });
        }
        
    });
    
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
