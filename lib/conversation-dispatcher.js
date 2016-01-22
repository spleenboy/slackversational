"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventEmitter = require('events');
var Storage = require('./storage');

module.exports = function (_EventEmitter) {
    _inherits(ConversationDispatcher, _EventEmitter);

    function ConversationDispatcher(slack) {
        var storage = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

        _classCallCheck(this, ConversationDispatcher);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ConversationDispatcher).call(this));

        _this.storage = storage || new Storage();
        _this.exclude = null;
        _this.listen(slack);
        return _this;
    }

    _createClass(ConversationDispatcher, [{
        key: 'dispatch',
        value: function dispatch(message) {
            var _this2 = this;

            if (this.exclude && this.exclude(message)) {
                return;
            }

            this.storage.findById(message.channel.id).then(function (conversation) {
                if (!conversation) {
                    conversation = new Conversation(message.channel);
                    conversation.on('end', _this2.ended.bind(_this2, conversation));
                    _this2.storage.add(message.channel.id, conversation).then(function () {
                        _this2.emit('start', conversation, message);
                    });
                }
                conversation.process(message);
            });
        }
    }, {
        key: 'ended',
        value: function ended(conversation) {
            this.storage.removeById(conversation.channel.id);
        }
    }, {
        key: 'listen',
        value: function listen(slack) {
            var _this3 = this;

            this.slack = slack;
            this.slack.on('message', function (message) {
                message.channel = _this3.slack.getChannelGroupOrDMByID(message.channel);
                message.user = _this3.slack.getUserByID(message.user);
                _this3.dispatch(message);
            });
        }
    }]);

    return ConversationDispatcher;
}(EventEmitter);