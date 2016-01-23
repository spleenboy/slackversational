"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventEmitter = require('events');
var Storage = require('./storage');
var Conversation = require('./conversation');
var Message = require('./message');

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
        value: function dispatch(message) {
            var _this2 = this;

            if (this.exclude && this.exclude(message)) {
                this.emit('excluded', message);
                return;
            }

            this.storage.findById(message.input.channel).then(function (conversation) {
                if (conversation) {
                    conversation.process(message);
                } else {
                    _this2.start(message);
                }
            });
        }
    }, {
        key: 'start',
        value: function start(message) {
            var _this3 = this;

            var conversation = new Conversation(message.input.channel);

            this.storage.add(conversation.id, conversation).then(function () {
                conversation.on('end', _this3.ended.bind(_this3, conversation));
                _this3.emit('start', conversation, message);
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
            slack.on('message', function (input) {
                try {
                    var message = new Message(input, slack);
                    _this4.dispatch(message);
                } catch (e) {
                    console.error("Error dispatching message", e);
                }
            });
        }
    }]);

    return Dispatcher;
}(EventEmitter);