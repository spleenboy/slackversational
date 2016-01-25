"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventEmitter = require('events');
var Storage = require('./storage');
var Conversation = require('./conversation');
var Exchange = require('./exchange');

module.exports = function (_EventEmitter) {
    _inherits(Dispatcher, _EventEmitter);

    function Dispatcher(slack) {
        var storage = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

        _classCallCheck(this, Dispatcher);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Dispatcher).call(this));

        _this.storage = storage || new Storage();
        _this.exclude = null;
        _this.listen(slack);
        return _this;
    }

    _createClass(Dispatcher, [{
        key: 'dispatch',
        value: function dispatch(exchange) {
            var _this2 = this;

            if (this.exclude && this.exclude(exchange)) {
                this.emit('excluded', exchange);
                return;
            }

            this.storage.findById(exchange.input.channel).then(function (conversation) {
                if (!conversation) {
                    _this2.start(exchange);
                }
                conversation.process(exchange);
            });
        }
    }, {
        key: 'create',
        value: function create(exchange) {
            var conversation = new Conversation(exchange.input.channel);
            conversation.on('end', this.ended.bind(this, conversation));
            return conversation;
        }
    }, {
        key: 'start',
        value: function start(exchange) {
            var _this3 = this;

            var conversation = this.create(exchange);

            this.storage.add(conversation.id, conversation).then(function () {
                _this3.emit('start', conversation, exchange);
            });
        }
    }, {
        key: 'ended',
        value: function ended(conversation) {
            this.storage.removeById(conversation.id);
        }
    }, {
        key: 'listen',
        value: function listen(slack) {
            var _this4 = this;

            this.slack = slack;
            slack.on('exchange', function (input) {
                try {
                    var exchange = new Exchange(input, slack);
                    _this4.dispatch(exchange);
                } catch (e) {
                    console.error("Error dispatching exchange", e);
                }
            });
        }
    }]);

    return Dispatcher;
}(EventEmitter);