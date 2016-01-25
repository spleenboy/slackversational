"use strict";

const Parser = require('./parser');

module.exports = class Delay extends Parser {
    constructor(time = 1000) {
        super();
        this.time = time;
    }

    parse(value) {
        return new Promise((resolve, reject) => {
            setTimeout(resolve.bind(this, value), this.time);
        });
    }
}
