"use strict";

const Parser = require('./parser');

module.exports = class Currency extends Parser {
    parse(value) {
        if (this.hasAnyWord(value, ['free', 'nothing'])) {
            return 0;
        }
        const parsed = parseFloat(value.replace(/[[^0-9\.]/g, ''));
        if (isNaN(parsed)) {
            return null;
        }
        return parsed;
    }
}
