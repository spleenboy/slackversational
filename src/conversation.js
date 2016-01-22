"use strict";

const EventEmitter = require('events');
const Message = require('./message');

module.exports = class Conversation extends EventEmitter {
    constructor(channel) {
        super();
        this.channel = channel;
        this.chain = [];
        this.step = 0;
    }

    static get emits() {
        return ['reading', 'asking', 'saying'];
    }

    process(message) {
        const request = this.chain.current();
        let response = null;
        if (request.asked) {
            this.emit('reading', request, message);
            response = request.read(message);
        } else {
            this.emit('asking', request, message);
            response = request.ask(message);
        }
        if (response.output) {
            this.emit('saying', response.output);
            const message = new Message(response.output);
            message.send(this.channel);
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
