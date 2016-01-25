"use strict";

const EventEmitter = require('events');
const Storage = require('./storage');
const Conversation = require('./conversation');
const Exchange = require('./exchange');
const log = require('./logger');

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

        log.debug("Dispatching exchange from", exchange.input.channel);
        this.storage.findById(exchange.input.channel)
        .then((conversation) => {
            if (!conversation) {
                this.start(exchange)
                .then((created) => {
                    created && created.process(exchange)
                });
            } else {
                conversation.process(exchange);
            }
        });
    }

    create(exchange) {
        return new Promise((resolve, reject) => {
            const conversation = new Conversation(exchange.input.channel);
            conversation.on('end', this.ended.bind(this, conversation));
            this.emit('start', conversation, exchange)
            resolve(conversation);
        });
    }

    start(exchange) {
        return this.create(exchange).then((conversation) => {
            log.debug("Created new conversation", conversation.id);
            return this.storage.add(conversation.id, conversation)
                   .then(() => {return conversation});
        });
    }


    ended(conversation) {
        return this.storage.removeById(conversation.id);
    }


    listen(slack) {
        this.slack = slack;
        slack.on('message', (input) => {
            try {
                const exchange = new Exchange(input, slack);
                this.dispatch(exchange);
            } catch (e) {
                log.error("Error dispatching exchange", e);
            }
        });
    }
}
