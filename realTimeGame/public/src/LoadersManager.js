import * as THREE from '../../node_modules/three/build/three.module.js';
import {OBJLoader} from '../../node_modules/three/examples/jsm/loaders/OBJLoader.js';

const loader = new THREE.TextureLoader();
const objLoader = new OBJLoader();

export const TexturesManager = {

    pasiveLoad: (path, success = TexturesManager.success, loading = TexturesManager.loading, fail = TexturesManager.loadFails) => {
        loader.load(path, success, loading, fail);
    },
    
    load: async (path, success = TexturesManager.success, loading = TexturesManager.loading, fail = TexturesManager.loadFails) => {
        const promise = new Promise((resolve, reject) => {
            try {
                loader.load(path, (texture) => {
                    resolve(success(texture));
                }, loading);
            } catch (error) {
                fail(reject, error, path);
            }
        });
        return promise;
    },

    success: (texture) => {
        /*console.log("Hemos cargado la textura exitosamente");
        console.log(texture)*/
        return texture;
    },

    loading: (progress) => {
        console.log(`Cargando textura ${progress.loaded} de ${progress.total}`);
    },

    loadFails: (reject, error, path) => {
        reject(`Error cargando la textura ${path}. Error: ${error}`)
    }
}

export const ObjsManager = {

    pasiveLoad: (path, success = ObjsManager.success, loading = ObjsManager.loading, fail = ObjsManager.loadFails) => {
        objLoader.load(path, success, loading, fail);
    },
    
    load: async (path, success = ObjsManager.success, loading = ObjsManager.loading, fail = ObjsManager.loadFails) => {
        const promise = new Promise((resolve, reject) => {
            try {
                objLoader.load(path, (obj) => {
                    resolve(success(obj));
                }, loading);
            } catch (error) {
                fail(reject, error, path);
            }
        });
        return promise;
    },

    success: (obj) => {
        /*console.log("Hemos cargado la textura exitosamente");
        console.log(obj)*/
        return obj;
    },

    loading: (progress) => {
        console.log(`Cargando Obj ${progress.loaded} de ${progress.total}`);
    },

    loadFails: (reject, error, path) => {
        reject(`Error cargando la textura ${path}. Error: ${error}`)
    }
}
