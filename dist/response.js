"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _ = require('lodash');

module.exports = function () {
    function Response(input) {
        _classCallCheck(this, Response);

        // The original input
        this.input = input;

        // The parsed value culled from the input
        this.value = input;

        // Whether the input was valid
        this.valid = true;

        // The statements to use as a response
        this.output = [];
    }

    _createClass(Response, [{
        key: "say",
        value: function say(pool, context) {
            var choice = _.sample(pool);
            var statements = _.isArray(choice) ? question : [choice];
            var values = statements.map(function (statement) {
                return _.isFunction(statement) ? statement(context) : statement;
            });
            if (values) {
                this.output = this.output.concat(values);
            }
            return values;
        }
    }]);

    return Response;
}();