"use strict";

module.exports = class Confirmation extends Parser {
    parse(value) {
        return this.hasAnyWord(value, ['yes', 'yeah', 'yup', 'ok', 'sure', 'fine', 'right', 'correct']);
    }
};