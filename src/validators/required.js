"use strict";

const Validator = require('./validator');
const _ = require('lodash');

module.exports = class Required extends Validator {
    isValid(value) {
        return _.toString(value).length > 0;
    }
}
