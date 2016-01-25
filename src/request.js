"use strict";

const _ = require('lodash');
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


    getQuestions(exchange) {
        return new Promise((resolve, reject) => {
            resolve(this.questions);
        });
    }


    getResponses(exchange) {
        return new Promise((resolve, reject) => {
            resolve(exchange.valid ? this.responses : []);
        });
    }


    // Returns an array of string statements, pulled randomly from
    // the available questions. This is usually step #1 in processing a request.
    ask(exchange) {
        return this.getQuestions(exchange)
        .then((questions) => {
            exchange.write(questions);
            this.asked++;
            return exchange;
        });
    }

    // Reads and processes input. Returns a Response object.
    // Typically step #2, after a request has been asked.
    // This part of the request involves parsing and validating
    // the input through one or more processors.
    read(exchange) {
        this.processors.forEach(process => {
            try {
                process.apply(exchange);
            } catch (e) {
                console.error("Processor error", e, process);
            }
        });

        this.emit(exchange.valid ? 'valid' : 'invalid', exchange);

        return this.getResponses(exchange)
        .then((responses) => {
            if (responses) {
                exchange.write(responses);
            }

            if (!exchange.valid) {
                log.debug("Received invalid input. Asking again", exchange.input.text);
                return this.ask(exchange);
            } else {
                return exchange;
            }
        });
    }
}
