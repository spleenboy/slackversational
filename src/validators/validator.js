"use strict";

const Promise = require('bluebird');

module.exports = class Validator {
    constructor(messages = null) {
        this.messages = messages || [];
    }

    validate(value) {
        return true;
    }

    apply(exchange) {
        const validate = Promise.method(this.validate.bind(this));
        return validate(exchange.value)
        .then((valid) => {
            if (!valid) {
                exchange.valid = false;
                exchange.write(this.messages);
            }
            return exchange;
        });
    }
}
