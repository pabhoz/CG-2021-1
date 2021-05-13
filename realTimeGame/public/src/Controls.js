import { players, localPlayer, sounds } from './app.js';

let soundsPlaying = false;

export default class Control {

    constructor(up, right, down, left, jump, aButton, bButton, select, start) {

        this.initControls();

        this.up = up || "w";
        this.right = right || "d";
        this.down = down || "s";
        this.left = left || "a";
        this.jump = jump || "x";
        this.aButton = aButton || "q";
        this.bButton = bButton || "e";
        this.select = select || "";
        this.start = start || "";

        this.element = undefined;
    }

    initControls() {
        this._up = { key: "", isPressed: false };
        this._right = { key: "", isPressed: false };
        this._down = { key: "", isPressed: false };
        this._left = { key: "", isPressed: false };
        this._jump = { key: "", isPressed: false };
        this._aButton = { key: "", isPressed: false };
        this._bButton = { key: "", isPressed: false };
        this._select = { key: "", isPressed: false };
        this._start = { key: "", isPressed: false };
    }

    set element(mesh) {
        this._element = mesh;
    }

    get element() {
        return this._element;
    }

    set up(key) {
        this._up.key = key;
    }

    get up() {
        return this._up.key;
    }

    set right(key) {
        this._right.key = key;
    }

    get right() {
        return this._right.key;
    }

    set down(key) {
        this._down.key = key;
    }

    get down() {
        return this._down.key;
    }

    set left(key) {
        this._left.key = key;
    }

    get left() {
        return this._left.key;
    }

    set jump(key) {
        this._jump.key = key;
    }

    get jump() {
        return this._jump.key;
    }

    set select(key) {
        this._select.key = key;
    }

    get select() {
        return this._select.key;
    }

    set start(key) {
        this._start.key = key;
    }

    get start() {
        return this._start.key;
    }

    update(vx, vy, m, jumpForce) {
        this.vx = vx;
        this.vy = vy;
        this.m = m;
        this.jumpForce = jumpForce;
        // Up is pressed
        if (this._up.isPressed) this.element.position.z -= this.vx;
        if (this._right.isPressed) this.element.position.x += this.vx;
        if (this._down.isPressed) this.element.position.z += this.vx;
        if (this._left.isPressed) this.element.position.x -= this.vx;
        if (this._jump.isPressed) this.element.position.y += this.vy;

        // console.log(this.vx)
        // console.log(this.element.position)
    }
    // up => this._up.isPressed = true;
    pressBtn(btnName) {
        if (`_${btnName}` in this) {
            this[`_${btnName}`].isPressed = true;
        } else {
            console.log(`No existe un botón asociado a la tecla ${btnName} en este control`);
        }
    }

    releaseBtn(btnName) {
        if (`_${btnName}` in this) {
            this[`_${btnName}`].isPressed = false;
        } else {
            console.log(`No existe un botón asociado a la tecla ${btnName} en este control`);
        }
    }
}

document.onkeydown = (e) => {

    if (!soundsPlaying) {
        sounds.forEach(sound => {
            sound.play();
        });
        soundsPlaying = true;
    }
        const control = players[localPlayer].control;

        switch (e.key) {
            case control.up:
                control.pressBtn("up");
                break;
            case control.right:
                control.pressBtn("right");
                break;
            case control.down:
                control.pressBtn("down");
                break;
            case control.left:
                control.pressBtn("left");
                break;
            case control.jump:
                control.pressBtn("jump");
                break;
        }

}

document.onkeyup = (e) => {

        const control = players[localPlayer].control;

        switch (e.key) {
            case control.up:
                control.releaseBtn("up");
                break;
            case control.right:
                control.releaseBtn("right");
                break;
            case control.down:
                control.releaseBtn("down");
                break;
            case control.left:
                control.releaseBtn("left");
                break;
            case control.jump:
                control.releaseBtn("jump");
                break;
        }

}
