"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Trickle = require('./trickle');
var _ = require('lodash');

module.exports = function () {
    function MessageQueue(statements) {
        var queue = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

        _classCallCheck(this, MessageQueue);

        this.statements = statements || [];
        this.queue = queue || new Trickle();
    }

    _createClass(MessageQueue, [{
        key: 'concat',
        value: function concat(statements) {
            this.statements = this.statements.concat(statements);
        }
    }, {
        key: 'add',
        value: function add(statement) {
            this.statements.push(statement);
        }
    }, {
        key: 'clear',
        value: function clear() {
            this.statements = [];
        }
    }, {
        key: 'send',
        value: function send(channel) {
            if (!this.statements) {
                return;
            }

            var statement = undefined;
            while (statement = this.statements.shift()) {
                var cmd = channel.send.bind(channel, _.toString(statement));
                this.queue.add(cmd);
            };
        }
    }]);

    return MessageQueue;
}();