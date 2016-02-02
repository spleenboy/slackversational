"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventEmitter = require('events');
var _ = require('lodash');
var Promise = require('bluebird');
var Typist = require('./typist');
var Trickle = require('./trickle');
var log = require('./logger');

module.exports = function (_EventEmitter) {
    _inherits(Conversation, _EventEmitter);

    function Conversation(id) {
        _classCallCheck(this, Conversation);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Conversation).call(this));

        _this.id = id || _.uniqueId();
        _this.chain = [];
        _this.topic = null;
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
        key: 'getRequestAction',
        value: function getRequestAction(request, exchange) {
            if (exchange.ended) {
                // Make an empty promise since the request has been abandoned
                log.debug("Exchange is ended. Skipping request processing");
                return function (x) {
                    return x;
                };
            } else if (request.asked) {
                this.emit('reading', request, exchange);
                log.debug("Reading from request", request.id);
                return request.read.bind(request);
            } else {
                this.emit('asking', request, exchange);
                log.debug("Asking from request", request.id);
                return request.ask.bind(request);
            }
        }
    }, {
        key: 'prepareExchange',
        value: function prepareExchange(request, exchange) {
            // Allow listeners to modify the initial exchange
            this.emit('preparing', request, exchange);
            exchange.topic = this.topic;
            return exchange;
        }
    }, {
        key: 'process',
        value: function process(exchange) {
            var _this2 = this;

            var request = this.currentRequest();

            if (!request) {
                this.emit('error', 'No current request');
                log.debug("No current request found. Abandoning process.");
                return;
            }

            var prepare = Promise.method(this.prepareExchange.bind(this));
            var handle = Promise.method(this.getRequestAction(request, exchange));

            prepare(request, exchange).then(function () {
                return handle(exchange);
            }).then(function () {
                if (exchange.output) {
                    _this2.emit('saying', request, exchange);
                    _this2.say(exchange.channel, exchange.output);
                }

                if (exchange.ended) {
                    _this2.end();
                    return;
                }

                // If the request has changed, process the new one, too
                var newRequest = _this2.currentRequest();
                if (newRequest && request.id !== newRequest.id) {
                    _this2.process(exchange);
                }
            });
        }
    }, {
        key: 'end',
        value: function end(exchange) {
            this.emit('end', exchange);
        }
    }, {
        key: 'addRequest',
        value: function addRequest(request) {
            this.chain.push(request);
        }
    }, {
        key: 'setRequest',
        value: function setRequest(test) {
            var _this3 = this;

            if (_.isInteger(test)) {
                this.step = _.clamp(test, 0, this.chain.length = 1);
                return;
            }
            this.chain.some(function (request, i) {
                if (test(request)) {
                    _this3.step = i;
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