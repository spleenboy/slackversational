"use strict";

const EventEmitter = require('events');
const Promise = require('bluebird');
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
                    if (created) {
                        created.process(exchange)
                        log.debug("Starting conversation", created.id);
                    } else {
                        log.debug("No conversation created. Skipping exchange.");
                    }
                });
            } else {
                log.debug("Processing exchange with conversation", conversation.id);
                conversation.process(exchange);
            }
        });
    }

    create(exchange) {
        return new Conversation(exchange.input.channel);
    }

    start(exchange) {
        const create = Promise.method(this.create.bind(this));
        return create(exchange).then((conversation) => {
            this.emit('start', conversation, exchange)
            conversation.on('end', this.ended.bind(this, conversation));
            return this.storage.add(conversation.id, conversation)
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
