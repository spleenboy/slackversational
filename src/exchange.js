"use strict";

const log = require('./logger');
const StatementPool = require('./statement-pool');

module.exports = class Exchange {
    constructor(input, slack) {
        // The original input
        this.input = input;

        // The slack client
        this.slack = slack;

        // Stores the current topic of conversation
        this.topic = {};

        // The parsed value culled from the input
        this.value = input && input.text;

        // Whether the input was valid
        this.valid = true;

        // Whether the exchange was abandoned completely
        this.ended = false;

        // The statements to use as a response
        this.output = [];
    }


    get channel() {
        if (!this._channel) {
            this._channel = this.slack.getChannelGroupOrDMByID(this.input.channel);
        }
        return this._channel;
    }


    get user() {
        if (!this._user) {
            this._user = this.slack.getUserByID(this.input.user);
        }
        return this._user;
    }


    write(statements) {
        const pool = new StatementPool(statements);
        const values = pool.bind(this);
        values.forEach((value) => {
            value.length && this.output.push(value);
        });
        return values;
    }
}
