"use strict";

const _ = require('lodash');
const EventEmitter = require('event');
const Response = require('./response');

module.exports = class Request extends EventEmitter {
    constructor(id = null) {
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
        return ['asking', 'valid', 'invalid', 'responding'];
    }


    // Returns an array of string statements, pulled randomly from
    // the available questions. This is usually step #1 in processing a request.
    ask(input) {

        const response = new Response(input);
        response.say(this.questions, input);
        this.asked++;

        this.emit('asking', response);

        return response;
    }

    // Reads and processes input. Returns a Response object.
    // Typically step #2, after a request has been asked.
    // This part of the request involves parsing and validating
    // the input through one or more processors.
    read(input) {

        const response = new Response(input);
        this.processors.forEach(process => {
            process.apply(response, input);
        });

        if (response.valid && this.responses) {
            response.say(this.responses, input);
        }

        if (response.valid) {
            this.emit('valid', response);
        } else {
            this.emit('invalid', response);
        }

        this.emit('responding', response);
        return response;
    }
}
