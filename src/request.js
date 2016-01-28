"use strict";

const _ = require('lodash');
const Promise = require('bluebird');
const EventEmitter = require('events');
const log = require('./logger');

module.exports = class Request extends EventEmitter {
    constructor(id = null) {
        super();

        this.id = id || _.uniqueId();

        // The number of times this request has been asked.
        this.asked = 0;

        // The questions to ask
        this.questions = [];

        // The responses of successful reads
        this.responses = [];

        // The parsers used to process a response's input
        this.processors = [];
    }


    static get emits() {
        return ['valid', 'invalid'];
    }


    handleAsking(exchange) {
        return new Promise((resolve, reject) => {
            exchange.write(this.questions);
            resolve(exchange);
        });
    }


    handleResponding(exchange) {
        return new Promise((resolve, reject) => {
            if (exchange.valid && this.responses) {
                exchange.write(this.responses);
            }
            resolve(exchange);
        });
    }


    // Returns a promise to resolve all of the processors
    // on the exchange
    process(exchange) {
        return Promise.each(this.processors, (p) => {
            return p.apply(exchange); 
        });
    }


    // Returns an array of string statements, pulled randomly from
    // the available questions. This is usually step #1 in processing a request.
    ask(exchange) {
        const handle = Promise.method(this.handleAsking.bind(this));
        return handle(exchange)
        .then(() => {
            this.asked++;
            return exchange;
        });
    }

    // Reads and processes input. Returns a Response object.
    // Typically step #2, after a request has been asked.
    // This part of the request involves parsing and validating
    // the input through one or more processors.
    read(exchange) {
        return this.process(exchange)
        .then(() => {
            this.emit(exchange.valid ? 'valid' : 'invalid', exchange);

            const handle = Promise.method(this.handleResponding.bind(this));
            return handle(exchange)
            .then(() => {
                if (!exchange.valid) {
                    log.debug("Received invalid input. Asking again", exchange.input.text);
                    return this.ask(exchange);
                } else {
                    return exchange;
                }
            });
        });
    }
}
