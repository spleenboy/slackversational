"use strict";

const EventEmitter = require('events');
const _ = require('lodash');
const Typist = require('./typist');
const Trickle = require('./trickle');

module.exports = class Conversation extends EventEmitter {
    constructor(id) {
        super();
        this.id = id || _.uniqueId();
        this.chain = [];
        this.step = 0;
        this.trickle = new Trickle();
    }

    static get emits() {
        return ['reading', 'asking', 'saying'];
    }

    say(channel, statements) {
        const typist = new Typist(statements, this.trickle);
        typist.send(channel);
    }

    process(message) {
        const request = this.currentRequest();

        if (!request) {
            this.emit('error', 'No current request');
            return;
        }

        if (request.asked) {
            this.emit('reading', request, message);
            request.read(message);
        } else {
            this.emit('asking', request, message);
            request.ask(message);
        }
        if (message.output) {
            this.emit('saying', request, message);
            this.say(message.channel, message.output);
        }

        // If the request has changed, process the new one, too
        const newRequest = this.currentRequest();
        if (newRequest && request.id !== newRequest.id) {
            this.process(message);
        }
    }


    end(message) {
        this.emit('end', message);
    }


    addRequest(request) {
        this.chain.push(request);
    }


    setRequest(test) {
        if (_.isInteger(test)) {
            this.step = _.clamp(test, 0, this.chain.length = 1);
            return;
        }
        this.chain.some((request, i) => {
            if (test(request)) {
                this.step = i;
                return true;
            }
            return false;
        });
    }


    currentRequest() {
        return this.chain[this.step];
    }


    previousRequest() {
        this.step = _.clamp(this.step - 1, 0);
        return this.chain[this.step];
    }


    // Advances one step forward, or goes to the start
    nextRequest() {
        this.step += 1;
        if (this.step >= this.chain.length) {
            this.step = 0;
        }
        return this.chain[this.step];
    }
}
