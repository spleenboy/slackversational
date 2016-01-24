"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventEmitter = require('events');
var _ = require('lodash');
var Typist = require('./typist');
var Trickle = require('./trickle');

module.exports = function (_EventEmitter) {
    _inherits(Conversation, _EventEmitter);

    function Conversation(id) {
        _classCallCheck(this, Conversation);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Conversation).call(this));

        _this.id = id || _.uniqueId();
        _this.chain = [];
        _this.step = 0;
        _this.trickle = new Trickle();
        return _this;
    }

    _createClass(Conversation, [{
        key: 'say',
        value: function say(channel, statements) {
            if (!_.isArray(statements)) {
                statements = [statements];
            }
            var typist = new Typist(statements, this.trickle);
            typist.send(channel);
        }
    }, {
        key: 'process',
        value: function process(message) {
            var request = this.currentRequest();

            if (!request) {
                this.emit('error', 'No current request');
                return;
            }

            if (request.asked) {
                this.emit('reading', request, message);
                request.read(message);
            } else {
                this.emit('asking', request, message);
                request.ask(message);
            }
            if (message.output) {
                this.emit('saying', request, message);
                this.say(message.channel, message.output);
            }

            // If the request has changed, process the new one, too
            var newRequest = this.currentRequest();
            if (newRequest && request.id !== newRequest.id) {
                this.process(message);
            }
        }
    }, {
        key: 'end',
        value: function end(message) {
            this.emit('end', message);
        }
    }, {
        key: 'addRequest',
        value: function addRequest(request) {
            this.chain.push(request);
        }
    }, {
        key: 'setRequest',
        value: function setRequest(test) {
            var _this2 = this;

            if (_.isInteger(test)) {
                this.step = _.clamp(test, 0, this.chain.length = 1);
                return;
            }
            this.chain.some(function (request, i) {
                if (test(request)) {
                    _this2.step = i;
                    return true;
                }
                return false;
            });
        }
    }, {
        key: 'currentRequest',
        value: function currentRequest() {
            return this.chain[this.step];
        }
    }, {
        key: 'previousRequest',
        value: function previousRequest() {
            this.step = _.clamp(this.step - 1, 0);
            return this.chain[this.step];
        }

        // Advances one step forward, or goes to the start

    }, {
        key: 'nextRequest',
        value: function nextRequest() {
            this.step += 1;
            if (this.step >= this.chain.length) {
                this.step = 0;
            }
            return this.chain[this.step];
        }
    }], [{
        key: 'emits',
        get: function get() {
            return ['reading', 'asking', 'saying'];
        }
    }]);

    return Conversation;
}(EventEmitter);