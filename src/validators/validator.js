"use strict";

module.exports = class Validator {
    constructor(messages = null) {
        this.messages = messages || [];
    }

    validate(value) {
        return true;
    }

    apply(response, context) {
        if (!this.validate(response.value)) {
            response.say(this.messages, context);
        }
    }
}
