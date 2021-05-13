import * as THREE from '../../node_modules/three/build/three.module.js';

export default class Sound {

    constructor(sources, radius, scene, ap) {

        this.audio = document.createElement("audio");
        this.radius = radius;
        this.scene = scene;

        sources.forEach(source => {
            const src = document.createElement("source");
            src.src = source;
            this.audio.appendChild(src);
        });

        this.position = "position" in ap ? new THREE.Vector3(ap.position.x, ap.position.y, ap.position.z) : new THREE.Vector3(0, 0, 0);

        this.volume = "volume" in ap ? ap.volume > 1 ? 1 : ap.volume : 1;

        if ("debug" in ap) {
            if (ap.debug) {
                this.debugMode();
            }
        }
    }

    debugMode() {
        this.mesh = new THREE.Mesh(
            new THREE.SphereGeometry(this.radius, 10, 10),
            new THREE.MeshBasicMaterial({
                color: 0xfff,
                wireframe:true
            })
        )
        this.mesh.position.set(this.position.x, this.position.y, this.position.z);
        this.scene.add(this.mesh);
    }

    play() {
        this.audio.play().catch( (err) => {
            console.log(err);
        });
    }

    update(element) {
        const distance = this.position.distanceTo(element.position);
        let volume = distance <= this.radius ? this.volume * (1 - distance / this.radius) : 0;
        this.audio.volume = volume;
    }

}
