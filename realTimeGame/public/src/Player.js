import * as THREE from '../../node_modules/three/build/three.module.js';
import CollidableBox from './CollidableBox.js';

export default class Player {

    constructor(name, element, control, ap = {}) {
        this.name = name;
        this.element = element;
        this.control = control;
        this.control.element = this.element;
        // Operador ternario
        // Variable = Condición ? valor asignado si la condición es true : valor asignado si la condición es false
        this.vx = "vx" in ap ? ap.vx : 2;
        this.vy = "vy" in ap ? ap.vy : 5;
        this.m = "m" in ap ? ap.m : 5;
        this.jumpForce = "jumpForce" in ap ? ap.jumpForce : 5;
        this.score = 0;
        this.id = this.name.split(" ").join("");

    }

    set element(mesh) {
        if (mesh instanceof THREE.Mesh) {
            this._element = mesh;
        } else {
            let geometry = new THREE.SphereGeometry(40, 10, 10)
            const randomR = Math.floor(Math.random() * 255);
            const randomG = Math.floor(Math.random() * 255);
            const randomB = Math.floor(Math.random() * 255);
            let material = new THREE.MeshPhongMaterial( {color: new THREE.Color(`rgb(${randomR}, ${randomG}, ${randomB})`), wireframe:false} );
            this._element = new THREE.Mesh( geometry, material );
            var helper = new THREE.BoxHelper(this._element, 0xff0000);
            helper.update();
            this._element.position.y = 40;
            this._element.add(helper);
            this._element.castShadow = true;
            this._element.receiveShadow = true; 
        }
    }

    get element() {
        return this._element;
    }

    update() {
        this.updateControls();
        this.updateGUI();
    }

    updateControls() {
        this.control.update(this.vx, this.vy, this.m, this.jumpForce)
    }

    updateGUI() {
        const myGUI = document.querySelector(`#${this.id}`);
        const contents = myGUI.querySelectorAll('label');
        contents[1].innerHTML = `Score: ${this.score}`;
    }

    play(scene) {
        this.collidableBox = new CollidableBox(this.element, 1);
        scene.add(this.element);

        const playersGUI = document.querySelector("#players");
        const pScore = document.createElement("label");
        pScore.innerHTML = `Score: ${this.score}`;
        const pName = document.createElement("label");
        pName.innerHTML = this.name;
        const pGUI = document.createElement("div");
        pGUI.classList.add("player");
        pGUI.id = this.id;
        pGUI.appendChild(pName);
        pGUI.appendChild(pScore);
        playersGUI.appendChild(pGUI);
    }
}
