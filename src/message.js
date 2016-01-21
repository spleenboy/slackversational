"use strict"

const Trickle = require('./trickle');

module.exports = class Message {
    constructor(statements, queue = null) {
        this.statements = statements || [];
        this.queue = queue || new Trickle();
        this.queue.on('done', this.clear.bind(this));
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

    send(channel) {
        this.statements.forEach((statement) => {
            this.queue.add(channel.send.bind(channel, statement));
        });
    }
}
