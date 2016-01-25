"use strict";

const EventEmitter = require('events');
const Storage = require('./storage');
const Conversation = require('./conversation');
const Exchange = require('./exchange');

module.exports = class Dispatcher extends EventEmitter {
    constructor(slack, storage = null) {
        super();
        this.storage = storage || new Storage();
        this.exclude = null;
        this.listen(slack);
    }


    dispatch(exchange) {
        if (this.exclude && this.exclude(exchange)) {
            this.emit('excluded', exchange);
            return;
        }

        this.storage.findById(exchange.input.channel)
        .then((conversation) => {
            if (conversation) {
                conversation.process(exchange);
            } else {
                this.start(exchange);
            }
        });
    }

    create(exchange) {
        const conversation = new Conversation(exchange.input.channel);
        conversation.on('end', this.ended.bind(this, conversation));
        return conversation;
    }

    start(exchange) {
        const conversation = this.create(exchange);

        this.storage.add(conversation.id, conversation)
        .then(() => {
            this.emit('start', conversation, exchange)
        });
    }


    ended(conversation) {
        this.storage.removeById(conversation.id);
    }


    listen(slack) {
        this.slack = slack;
        slack.on('exchange', (input) => {
            try {
                const exchange = new Exchange(input, slack);
                this.dispatch(exchange);
            } catch (e) {
                console.error("Error dispatching exchange", e);
            }
        });
    }
}
