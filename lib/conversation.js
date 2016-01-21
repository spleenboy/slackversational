"use strict";

const EventEmitter = require('events');
const RequestChain = require('./request-chain');
const Message = require('./message');

module.exports = class Conversation extends EventEmitter {
    constructor(channel) {
        this.channel = channel;
        this.chain = new RequestChain();
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
};