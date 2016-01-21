"use strict";

const Validator = require('./validator');

export default class Required extends Validator {
    validate(response) {
        return response.value.length > 0;
    }
}
