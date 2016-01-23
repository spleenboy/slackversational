"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _ = require('lodash');

module.exports = function () {
    function Message(input) {
        _classCallCheck(this, Message);

        // The original input
        this.input = input;

        // The parsed value culled from the input
        this.value = input && input.text;

        // Whether the input was valid
        this.valid = true;

        // The statements to use as a response
        this.output = [];
    }

    _createClass(Message, [{
        key: "write",
        value: function write(pool) {
            var _this = this;

            var choice = _.sample(pool);
            var statements = _.isArray(choice) ? question : [choice];
            var values = statements.map(function (statement) {
                return _.isFunction(statement) ? statement(_this) : statement;
            });
            if (values) {
                this.output = values.concat(this.output);
            }
            return values;
        }
    }]);

    return Message;
}();