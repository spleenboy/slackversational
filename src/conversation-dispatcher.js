"use strict";

const EventEmitter = require('events');

module.exports = class ConversationDispatcher extends EventEmitter {
    constructor(slack) {
        this.conversations = {};
        this.listen(slack);
    }


    dispatch(message) {
        let conversation = this.conversations[message.channel.id];
        if (!conversation) {
            conversation = new Conversation(message.channel);
            conversation.on('end', this.end.bind(this, conversation));
            this.conversations[message.channel.id] = conversation;
            this.emit('start', conversation, message);
        }
        conversation.process(message);
    }


    end(conversation) {
        delete this.conversations[conversation.channel.id];
    }


    listen(slack) {
        this.slack = slack;
        this.slack.on('message', (message) => {
            message.channel = this.slack.getChannelGroupOrDMByID(message.channel);
            message.user = this.slack.getUserByID(message.user);
            this.dispatch(message);
        });
    }
}
