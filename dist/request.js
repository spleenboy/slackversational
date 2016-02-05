"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require('lodash');
var Promise = require('bluebird');
var EventEmitter = require('events');
var log = require('./logger');

module.exports = function (_EventEmitter) {
    _inherits(Request, _EventEmitter);

    function Request() {
        var id = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

        _classCallCheck(this, Request);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Request).call(this));

        _this.id = id || _.uniqueId();

        // The number of times this request has been asked.
        _this.asked = 0;

        // The questions to ask
        _this.questions = [];

        // The responses of successful reads
        _this.responses = [];

        // The parsers used to process a response's input
        _this.processors = [];
        return _this;
    }

    _createClass(Request, [{
        key: 'handleAsking',
        value: function handleAsking(exchange) {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
                exchange.write(_this2.questions);
                resolve(exchange);
            });
        }
    }, {
        key: 'handleResponding',
        value: function handleResponding(exchange) {
            var _this3 = this;

            return new Promise(function (resolve, reject) {
                if (exchange.valid && _this3.responses) {
                    exchange.write(_this3.responses);
                }
                resolve(exchange);
            });
        }

        // Returns a promise to resolve all of the processors
        // on the exchange

    }, {
        key: 'process',
        value: function process(exchange) {
            return Promise.each(this.processors, function (p) {
                return p.apply(exchange);
            });
        }

        // Returns an array of string statements, pulled randomly from
        // the available questions. This is usually step #1 in processing a request.

    }, {
        key: 'ask',
        value: function ask(exchange) {
            var _this4 = this;

            var handle = Promise.method(this.handleAsking.bind(this));
            return handle(exchange).then(function () {
                _this4.asked++;
                _this4.emit('asked', exchange);
                return exchange;
            });
        }

        // Reads and processes input. Returns a Response object.
        // Typically step #2, after a request has been asked.
        // This part of the request involves parsing and validating
        // the input through one or more processors.

    }, {
        key: 'read',
        value: function read(exchange) {
            var _this5 = this;

            return this.process(exchange).then(function () {
                var handle = Promise.method(_this5.handleResponding.bind(_this5));
                return handle(exchange).then(function () {
                    _this5.emit('read', exchange);
                    if (!exchange.valid) {
                        log.debug("Received invalid input. Asking again", exchange.input.text);
                        _this5.emit('invalid', exchange);
                        return _this5.ask(exchange);
                    } else {
                        _this5.emit('valid', exchange);
                        return exchange;
                    }
                });
            });
        }
    }], [{
        key: 'emits',
        get: function get() {
            return ['asked', 'read', 'valid', 'invalid'];
        }
    }]);

    return Request;
}(EventEmitter);