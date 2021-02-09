const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

let speed = 0.01;

function main() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // cube = drawCube(0xff00ff, true);
    // scene.add(cube);

    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array( [
        0.0, 1.0,  1.0,
        -1.0, 0.0,  1.0,
        1.0,  0.0,  1.0
    ] );

    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

    cube = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true,
    }));

    scene.add(cube);

    camera.position.z = 5;
    // camera.position.y = 5;
    // camera.lookAt(cube.position);

    animate();
}

function drawCube(color, wireframe = false) {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({
        color,
        wireframe
    });
    return new THREE.Mesh(geometry, material);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    /*cube.rotation.x += speed;
    cube.rotation.y += speed;*/

    const speedLabel = document.querySelector("#speed");
    speedLabel.innerHTML = speed;
}

function speedUp() {
    console.log("Subiendo velocidad");
    speed += 0.01;
}
function speedDown() {
    speed -= 0.01;
}
