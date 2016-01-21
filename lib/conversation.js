"use strict";

const EventEmitter = require('events');

module.exports = class Conversation extends EventEmitter {
    constructor(channel) {
        this.channel = channel;
        this.tree = new RequestTree(); // The tree of requests processed
    }

    process(message) {}

    end(message) {
        this.emit('end', message);
    }
};