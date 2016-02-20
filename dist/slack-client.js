"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Slack = require('slack-client');
var RTM_EVENTS = Slack.RTM_EVENTS;
var CLIENT_EVENTS = Slack.CLIENT_EVENTS.RTM;

// Wrapper for the Slack Client to manage API changes gracefully
module.exports = function () {
    function SlackClient(client) {
        _classCallCheck(this, SlackClient);

        this.client = client;
    }

    _createClass(SlackClient, [{
        key: "sendMessageToChannel",
        value: function sendMessageToChannel(message, channelId, callback) {
            this.client.sendMessage(message, channelId, callback);
        }
    }, {
        key: "start",
        value: function start(opts) {
            this.client.start(opts);
        }

        // Common events...

    }, {
        key: "onOpen",
        value: function onOpen(callback) {
            this.client.on(CLIENT_EVENTS.RTM_CONNECTION_OPENED, callback);
        }
    }, {
        key: "onClose",
        value: function onClose(callback) {
            this.client.on(CLIENT_EVENTS.DISCONNECT, callback);
        }
    }, {
        key: "onMessage",
        value: function onMessage(callback) {
            this.client.on(RTM_EVENTS.MESSAGE, callback);
        }
    }], [{
        key: "create",
        value: function create(token) {
            var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            if (!options.dataStore) {
                options.dataStore = new Slack.MemoryDataStore();
            }
            var rtm = new Slack.RtmClient(token, options);
            return new SlackClient(rtm);
        }
    }]);

    return SlackClient;
}();