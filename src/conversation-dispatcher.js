"use strict";

const EventEmitter = require('events');
const Storage = require('./storage');

module.exports = class ConversationDispatcher extends EventEmitter {
    constructor(slack, storage = null) {
        this.storage = storage || new Storage();
        this.listen(slack);
    }


    dispatch(message) {
        this.storage.findById(message.channel.id)
        .then((conversation) => {
            if (!conversation) {
                conversation = new Conversation(message.channel);
                conversation.on('end', this.end.bind(this, conversation));
                this.storage.add(message.channel.id, conversation)
                .then(() => {this.emit('start', conversation, message)});
            }
            conversation.process(message);
        });
    }


    end(conversation) {
        this.storage.removeById(conversation.channel.id);
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
