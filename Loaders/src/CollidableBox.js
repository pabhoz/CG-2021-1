import * as THREE from '../../node_modules/three/build/three.module.js';
import { collidableList, scene } from './app.js';

var g = 0.2;
export default class CollidableBox {

    constructor(mesh, collidableDistance) {
        this.mesh = mesh;
        this.collidableDistance = collidableDistance;
        this.isFalling = { state: true, acc: 0 };
        this.isInAir = false;
        this.isJumping = false;
    }

    collide(normal, callback, verticalColliding = false) {

        const collidableRay = new THREE.Raycaster();
        collidableRay.ray.direction.set(normal.x, normal.y, normal.z);

        const origin = this.mesh.position.clone();
        collidableRay.ray.origin.copy(origin);

        const hits = collidableRay.intersectObjects(collidableList);

        if (verticalColliding) {
            if (hits.length > 0) {
                const hitDistance = hits[0].distance;
                callback(hitDistance, hits[0]?.object);
            } else {
                this.fall();
            }
        } else {
            // Colisiones horizontales
            if (hits.length > 0) {
                const hitDistance = hits[0].distance;
                if (hitDistance <= this.collidableDistance) {
                    callback(hits[0].object);
                }
            }
        }
    }

    collideFront(player) {
        const callback = (object) => {
            this.checkForCoin(object, player);
            this.mesh.position.z += player.vx;
        }
        this.collide({ x: 0, y: 0, z: -1 }, callback);
    }
    collideBack(player) {
        const callback = (object) => {
            this.checkForCoin(object, player);
            this.mesh.position.z -= player.vx;
        }
        this.collide({ x: 0, y: 0, z: 1 }, callback);
    }
    collideRight(player) {
        const callback = (object) => {
            this.checkForCoin(object, player);
            this.mesh.position.x -= player.vx;
        }
        this.collide({ x: 1, y: 0, z: 0 }, callback);
    }
    collideLeft(player) {
        const callback = (object) => {
            this.checkForCoin(object, player);
            this.mesh.position.x += player.vx;
        }
        this.collide({ x: -1, y: 0, z: 0 }, callback);
    }

    collideBottom(player) {
        const callback = (hitDistance, object) => {
            // Si voy a chocar con algo verticalmente
            if (hitDistance > this.collidableDistance) {
                this.fall(player);
            } else {
                // si ya choqué con algo verticalmente
                if (hitDistance <= this.collidableDistance + 0.1) {
                    this.isFalling.state = false;
                    this.isInAir = false;
                    this.isJumping = false;
                    this.isFalling.acc = 0;
                }
                if (hitDistance <= this.collidableDistance) {
                    this.mesh.position.y += 0.01;
                }

                // this.mesh.position.y = object.position.y + 1
                // this.checkForCoin(object, player);
            }

        }
        this.collide({ x: 0, y: -1, z: 0 }, callback, true);
    }

    checkForCoin(object, player) {
        if (object.name == "Coin") {
            player.score += 1;
            // scene.remove(object)
        }
    }

    update(player) {
        this.collideFront(player);
        this.collideBack(player);
        this.collideRight(player);
        this.collideLeft(player);
        this.collideBottom(player);
    }

    fall() {
        // console.log("Falling");
        this.isFalling.state = true;
        this.isFalling.acc += 0.01;
        this.mesh.position.y -= this.isFalling.acc;
        this.isInAir = true;
    }

}
