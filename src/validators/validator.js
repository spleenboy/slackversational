"use strict";

module.exports = class Validator {
    constructor(messages = null) {
        this.messages = messages || [];
    }

    isValid(value) {
        return true;
    }

    apply(response) {
        if (!this.isValid(response.value) && this.messages) {
            console.log("Invalid response value", response.value);
            response.write(this.messages);
            response.valid = false;
        }
    }
}
