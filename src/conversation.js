"use strict";

const EventEmitter = require('events');
const _ = require('lodash');
const Promise = require('bluebird');
const Typist = require('./typist');
const Trickle = require('./trickle');
const log = require('./logger');

module.exports = class Conversation extends EventEmitter {
    constructor(id) {
        super();
        this.id = id || _.uniqueId();
        this.chain = [];
        this.topic = {};
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


    getRequestAction(request, exchange) {
        if (exchange.ended) {
            // Make an empty promise since the request has been abandoned
            log.debug("Exchange is ended. Skipping request processing");
            return (x) => x;
        }
        else if (request.asked) {
            this.emit('reading', request, exchange);
            log.debug("Reading from request", request.id);
            return request.read.bind(request);
        } else {
            this.emit('asking', request, exchange);
            log.debug("Asking from request", request.id);
            return request.ask.bind(request);
        }
    }


    prepareExchange(request, exchange) {
        // Allow listeners to modify the initial exchange
        this.emit('preparing', request, exchange);
        exchange.topic = this.topic;
        return exchange;
    }


    process(exchange) {
        const request = this.currentRequest();

        if (!request) {
            this.emit('error', 'No current request');
            log.debug("No current request found. Abandoning process.");
            return;
        }

        const prepare = Promise.method(this.prepareExchange.bind(this));
        const handle = Promise.method(this.getRequestAction(request, exchange));

        prepare(request, exchange)
        .then(() => handle(exchange))
        .then(() => {
            if (exchange.output) {
                this.emit('saying', request, exchange);
                this.say(exchange.channel, exchange.output);
            }

            if (exchange.ended) {
                this.end();
                return;
            }

            // If the request has changed, process the new one, too
            const newRequest = this.currentRequest();
            if (newRequest && request.id !== newRequest.id) {
                this.process(exchange);
            }
        });
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
