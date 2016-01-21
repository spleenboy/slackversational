"use strict";

module.exports = class Abandoned extends Parser {
    parse(value) {
        return (/^(nm|nevermind|cancel)$/i.test(value)
        );
    }
};