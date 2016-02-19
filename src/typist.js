"use strict"

const Trickle = require('./trickle');
const _ = require('lodash');

module.exports = class Typist {
    constructor(statements, queue = null) {
        this.statements = statements || [];
        this.queue = queue || new Trickle();
    }

    concat(statements) {
        this.statements = this.statements.concat(statements);
    }

    add(statement) {
        this.statements.push(statement);
    }

    clear() {
        this.statements = [];
    }

    send(client, channelId) {
        if (!this.statements) {
            return;
        }

        let statement;
        while ((statement = this.statements.shift())) {
            const cmd = this.client.sendMessageToChannel.bind(
                this.client,
                _.toString(statement),
                channelId
            );
            this.queue.add(cmd);
        };
    }
}
