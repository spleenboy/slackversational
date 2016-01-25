"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _ = require('lodash');
var log = require('./logger');

module.exports = function () {
    function Exchange(input, slack) {
        _classCallCheck(this, Exchange);

        // The original input
        this.input = input;

        // The slack client
        this.slack = slack;

        // The parsed value culled from the input
        this.value = input && input.text;

        // Whether the input was valid
        this.valid = true;

        // The statements to use as a response
        this.output = [];
    }

    _createClass(Exchange, [{
        key: 'write',
        value: function write(pool) {
            var _this = this;

            var choice = _.sample(pool);
            var statements = _.isArray(choice) ? choice : [choice];
            var values = statements.map(function (statement) {
                var value = _.isFunction(statement) ? statement(_this) : statement;
                var text = _.toString(value);
                if (!text.length) {
                    log.warn("Statement resulted in an empty string", statement);
                }
                return text;
            });

            if (values) {
                values.forEach(function (value) {
                    value.length && _this.output.push(value);
                });
            }
            return values;
        }
    }, {
        key: 'channel',
        get: function get() {
            if (!this._channel) {
                this._channel = this.slack.getChannelGroupOrDMByID(this.input.channel);
            }
            return this._channel;
        }
    }, {
        key: 'user',
        get: function get() {
            if (!this._user) {
                this._user = this.slack.getUserByID(this.input.user);
            }
            return this._user;
        }
    }]);

    return Exchange;
}();