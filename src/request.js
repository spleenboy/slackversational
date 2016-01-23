"use strict";

const _ = require('lodash');
const EventEmitter = require('events');

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
        return ['asking', 'valid', 'invalid', 'responding'];
    }


    // Returns an array of string statements, pulled randomly from
    // the available questions. This is usually step #1 in processing a request.
    ask(message) {

        message.write(this.questions);
        this.asked++;

        this.emit('asking', message);

        return message;
    }

    // Reads and processes input. Returns a Response object.
    // Typically step #2, after a request has been asked.
    // This part of the request involves parsing and validating
    // the input through one or more processors.
    read(message) {

        this.processors.forEach(process => {
            try {
                process.apply(message);
            } catch (e) {
                console.error("Processor error", e, process);
            }
        });

        if (message.valid) {
            this.emit('valid', message);
            this.responses && message.write(this.responses);
        } else {
            // Ask again!
            this.emit('invalid', message);
            return this.ask(message);
        }

        return message;
    }
}
