"use strict";

export default class Storage {
    constructor() {
        this.buckets = {};
    }

    findById(id) {
        return new Promise((resolve, reject) => {
            resolve(this.buckets[id]);
        });
    }

    removeById(id) {
        return new Promise((resolve, reject) => {
            delete this.buckets[id];
            resolve();
        });
    }

    add(id, obj) {
        return new Promise((resolve, reject) => {
            this.buckets[id] = obj;
            resolve(obj);
        });
    }
}