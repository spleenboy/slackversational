"use strict";

const _ = require('lodash');
const log = require('./logger');

module.exports = class Exchange {
    constructor(input, slack) {
        // The original input
        this.input = input;

        // The slack client
        this.slack = slack;

        // The parsed value culled from the input
        this.value = input && input.text;

        // Whether the input was valid
        this.valid = true;

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


    write(pool) {
        const choice = _.sample(pool);
        const statements = _.isArray(choice) ? choice : [choice];
        const values = statements.map((statement) => {
            const value = _.isFunction(statement) ? statement(this) : statement;
            const text = _.toString(value);
            if (!text.length) {
                log.warn("Statement resulted in an empty string", statement);
            }
            return text;
        });

        if (values) {
            values.forEach((value) => {
                value.length && this.output.push(value);
            });
        }
        return values;
    }
}
