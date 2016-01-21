"use strict";

const EventEmitter = require('events');

// Queues up actions to be exectued in FIFO order with a delay
class Trickle extends EventEmitter {
    constructor() {
        this.queue = [];
        this.delay = 1000;
        this.timer = null;
    }

    add(method) {
        this.queue.push(method);
        if (!this.timer) {
            this.emit('start');
            this.run();
        }
    }

    run() {
        if (!this.queue.length) {
            this.timer = null;
            this.emit('done');
            return;
        }

        const next = this.queue.shift();
        next();

        this.timer = setTimeout(this.run.bind(this), this.delay);
    }
}

module.exports = Trickle;
