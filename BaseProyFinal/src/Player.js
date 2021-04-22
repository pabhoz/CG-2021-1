import * as THREE from '../../node_modules/three/build/three.module.js';

export default class Player {

    constructor(name, element, control, ap = {}) {
        this.name = name;
        this.element = element;
        this.control = control;
        this.control.element = this.element;
        // Operador ternario
        // Variable = Condición ? valor asignado si la condición es true : valor asignado si la condición es false
        this.vx = "vx" in ap ? ap.vx : 0.1;
        this.vy = "vy" in ap ? ap.vy : 0;
        this.m = "m" in ap ? ap.m : 5;
        this.jumpForce = "jumpForce" in ap ? ap.jumpForce : 5;
    }

    set element(mesh) {
        if (mesh instanceof THREE.Mesh) {
            this._element = mesh;
        } else {
            let geometry = new THREE.SphereGeometry(1, 10, 10)
            const randomR = Math.floor(Math.random() * 255);
            const randomG = Math.floor(Math.random() * 255);
            const randomB = Math.floor(Math.random() * 255);
            let material = new THREE.MeshPhongMaterial( {color: new THREE.Color(`rgb(${randomR}, ${randomG}, ${randomB})`), wireframe:false} );
            this._element = new THREE.Mesh( geometry, material );
            var helper = new THREE.BoxHelper(this._element, 0xff0000);
            helper.update();
            this._element.position.y = 1;
            this._element.add(helper);
            this._element.castShadow = true;
            this._element.receiveShadow = true; 
        }
    }

    get element() {
        return this._element;
    }

    updateControls() {
        this.control.update(this.vx, this.vy, this.m, this.jumpForce)
    }

    play(scene) {
        scene.add(this.element);
    }
}
