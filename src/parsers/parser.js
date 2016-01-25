"use strict";

const Promise = require('bluebird');

module.exports = class Parser {
    // Handles parsing the value. This may return either the
    // parsed value or a promise to resolve with the value.
    parse(value) {
        return value;
    }

    apply(exchange) {
        const parse = Promise.method(this.parse.bind(this));
        return parse(exchange.value).then((value) => {
            exchange.value = value;
            return exchange;
        });
    }


    hasWord(text, word) {
        const search = new RegExp(`(\b|^)${word}(\b|$)`, 'i');
        const matches = search.test(text);
        return matches
    }


    hasAnyWord(text, words) {
        return words.some(this.hasWord.bind(this, text));
    }
}
