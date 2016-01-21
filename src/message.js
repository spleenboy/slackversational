"use strict"

module.exports = class Message {
    constructor(statements, queue) {
        this.statements = statements || [];
        this.queue = queue;
    }

    add(statement) {
        this.statements.push(statement);
    }

    send(channel) {
        
    }
}
