"use strict";

const Validator = require('./validator');
const _ = require('lodash');

module.exports = class Required extends Validator {
    validate(value) {
        return _.toString(value).length > 0;
    }
}
