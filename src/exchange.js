"use strict";

const log = require('./logger');
const StatementPool = require('./statement-pool');

module.exports = class Exchange {
    constructor(input) {
        // The original input
        this.input = input;

        // Stores the current topic of conversation
        this.topic = {};

        // The parsed value culled from the input
        this.value = input && input.text;

        // Whether the input was valid
        this.valid = true;

        // Whether the exchange was abandoned completely
        this.ended = false;

        // The message objects to used as a response
        this.output = [];
    }

    static get DM() {
        return 'D';
    }

    static get CHANNEL() {
        return 'C';
    }

    static get GROUP() {
        return 'G';
    }

    get type() {
        return this.input && this.input.channel.substr(0, 1);
    }

    write(statements, channel = null) {
        if (!channel) channel = this.input.channel;
        const pool = new StatementPool(statements);
        const texts = pool.bind(this);
        texts.forEach((text) => {
            const msg = {text, channel};
            text.length && this.output.push(msg);
        });
    }
}
