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
        if (!_.isArray(statements)) {
            statements = [statements];
        }
        const typist = new Typist(statements, this.trickle);
        typist.send(channel);
    }

    process(exchange) {
        const request = this.currentRequest();

        if (!request) {
            this.emit('error', 'No current request');
            return;
        }

        if (request.asked) {
            this.emit('reading', request, exchange);
            request.read(exchange);
        } else {
            this.emit('asking', request, exchange);
            request.ask(exchange);
        }
        if (exchange.output) {
            this.emit('saying', request, exchange);
            this.say(exchange.channel, exchange.output);
        }

        // If the request has changed, process the new one, too
        const newRequest = this.currentRequest();
        if (newRequest && request.id !== newRequest.id) {
            this.process(exchange);
        }
    }


    end(exchange) {
        this.emit('end', exchange);
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
