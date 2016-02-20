"use strict";

const EventEmitter = require('events');
const _ = require('lodash');
const Promise = require('bluebird');
const Trickle = require('./trickle');
const log = require('./logger');

module.exports = class Conversation extends EventEmitter {
    constructor(id) {
        super();
        this.id = id || _.uniqueId();
        this.requests = [];
        this.topic = {};
        this.step = 0;
        this.trickle = new Trickle();
    }

    static get emits() {
        return ['preparing', 'reading', 'asking', 'saying', 'say', 'error', 'end'];
    }

    say(channel, statements) {
        if (!_.isArray(statements)) {
            statements = [statements];
        }
        let text;
        while (text = statements.shift()) {
            this.trickle.add(() => {
                this.emit('say', {text, channel});
            });
        }
    }


    callAction(request, exchange) {
        if (exchange.ended) {
            // Make an empty promise since the request has been abandoned
            log.debug("Exchange is ended. Skipping request processing");
            return exchange;
        }
        else if (request.asked) {
            this.emit('reading', request, exchange);
            log.debug("Reading from request", request.id);
            return request.read(exchange);
        } else {
            this.emit('asking', request, exchange);
            log.debug("Asking from request", request.id);
            return request.ask(exchange);
        }
    }


    prepareExchange(request, exchange) {
        // Allow listeners to modify the initial exchange
        this.emit('preparing', request, exchange);
        exchange.topic = this.topic;
        log.debug("Preparing exchange", request.id);
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
        const handle = Promise.method(this.callAction.bind(this));

        prepare(request, exchange)
        .then(() => handle(request, exchange))
        .then(() => {
            if (exchange.output) {
                this.emit('saying', request, exchange);
                this.say(exchange.input.channel, exchange.output);
            }

            if (exchange.ended) {
                this.end();
                return;
            }

            // If the request has changed, process the new one, too
            const newRequest = this.currentRequest();
            if (newRequest && request !== newRequest) {
                this.process(exchange);
            }
        });
    }


    end(exchange) {
        this.emit('end', exchange);
    }


    chain(...requests) {
        let current = requests.shift();
        while (current) {
            this.addRequest(current);
            const next = requests.shift();
            if (next) {
                current.on('valid', (x) => {
                    this.setRequest((r) => r === next);
                });
            }
            current = next;
        }
    }


    addRequest(request) {
        if (!_.find(this.requests, (r) => r === request)) {
            this.requests.push(request);
        }
    }


    setRequest(test) {
        if (_.isInteger(test)) {
            this.step = _.clamp(test, 0, this.requests.length = 1);
            return;
        }
        this.requests.some((request, i) => {
            if (test(request)) {
                this.step = i;
                return true;
            }
            return false;
        });
    }


    currentRequest() {
        return this.requests[this.step];
    }


    previousRequest() {
        this.step = _.clamp(this.step - 1, 0);
        return this.requests[this.step];
    }


    // Advances one step forward, or goes to the start
    nextRequest() {
        this.step += 1;
        if (this.step >= this.requests.length) {
            this.step = 0;
        }
        return this.requests[this.step];
    }
}
