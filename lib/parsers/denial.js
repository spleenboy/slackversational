"use strict";

module.exports = class Denial extends Parser {
    parse(value) {
        return this.hasAnyWord(['no', 'cancel', 'neither', 'none', 'nevermind', 'nm', 'wrong']);
    }
};