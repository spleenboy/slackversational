"use strict";

const Parser = require('./parser');

module.exports = class FutureDate extends Parser {
    parse(value) {
        const check = /<#(C[a-zA-Z0-9]+)(\||>)/;
        const matches = check.exec(value);
        return matches ? matches[1] : null;
    }
}
