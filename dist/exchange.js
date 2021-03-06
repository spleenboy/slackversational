"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var log = require('./logger');
var StatementPool = require('./statement-pool');

module.exports = function () {
    function Exchange(input) {
        _classCallCheck(this, Exchange);

        // The original input
        this.input = input;

        // Stores the current topic of conversation
        this.topic = {};

        // The parsed value culled from the input
        this.value = input && input.text;

        // Whether the input was valid
        this.valid = true;

        // Whether the exchange was abandoned completely
        this.ended = false;

        // The message objects to used as a response
        this.output = [];
    }

    _createClass(Exchange, [{
        key: 'write',
        value: function write(statements) {
            var _this = this;

            var channel = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

            if (!channel) channel = this.input.channel;
            var pool = new StatementPool(statements);
            var texts = pool.bind(this);
            texts.forEach(function (text) {
                var msg = { text: text, channel: channel };
                text.length && _this.output.push(msg);
            });
        }
    }, {
        key: 'type',
        get: function get() {
            return this.input && this.input.channel.substr(0, 1);
        }
    }], [{
        key: 'DM',
        get: function get() {
            return 'D';
        }
    }, {
        key: 'CHANNEL',
        get: function get() {
            return 'C';
        }
    }, {
        key: 'GROUP',
        get: function get() {
            return 'G';
        }
    }]);

    return Exchange;
}();