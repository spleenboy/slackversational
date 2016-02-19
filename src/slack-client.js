"use strict";

const Slack = require('slack-client');
const RTM_EVENTS = Slack.RTM_EVENTS;
const CLIENT_EVENTS = Slack.CLIENT_EVENTS.RTM;

// Wrapper for the Slack Client to manage API changes gracefully
module.exports = class SlackClient {
    constructor(client) {
        this.client = client;
    }

    static create(token, options = {}) {
        if (!options.dataStore) {
            options.dataStore = new Slack.MemoryDataStore();
        }
        const rtm = new Slack.RtmClient(token, options);
        return new SlackClient(rtm);
    }

    getChannelById(id) {
        return this.client.dataStore.getChannelGroupOrDMById(id);
    }

    getUserById(id) {
        return this.client.dataStore.getUserById(id);
    }

    sendMessageToChannel(message, channelId, callback) {
        this.client.sendMessage(message, channelId, callback);
    }

    start(opts) {
        this.client.start(opts);
    }

    // Common events...
    onOpen(callback) {
        this.client.on(CLIENT_EVENTS.RTM_CONNECTION_OPENED, callback);
    }

    onClose(callback) {
        this.client.on(CLIENT_EVENTS.DISCONNECT, callback);
    }

    onMessage(callback) {
        this.client.on(RTM_EVENTS.MESSAGE, callback);
    }
}
