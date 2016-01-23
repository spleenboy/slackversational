"use strict";

const EventEmitter = require('events');
const Storage = require('./storage');
const Conversation = require('./conversation');
const Message = require('./message');

module.exports = class Dispatcher extends EventEmitter {
    constructor(slack, storage = null) {
        super();
        this.storage = storage || new Storage();
        this.exclude = null;
        this.listen(slack);
    }


    dispatch(message) {
        if (this.exclude && this.exclude(message)) {
            this.emit('excluded', message);
            return;
        }

        this.storage.findById(message.input.channel)
        .then((conversation) => {
            if (conversation) {
                conversation.process(message);
            } else {
                this.start(message);
            }
        });
    }

    start(message) {
        const conversation = new Conversation(message.input.channel);

        this.storage.add(conversation.id, conversation)
        .then(() => {
            conversation.on('end', this.ended.bind(this, conversation));
            this.emit('start', conversation, message)
        });
    }


    ended(conversation) {
        this.storage.removeById(conversation.id);
    }


    listen(slack) {
        this.slack = slack;
        slack.on('message', (input) => {
            try {
                const message = new Message(input, slack);
                this.dispatch(message);
            } catch (e) {
                console.error("Error dispatching message", e);
            }
        });
    }
}
