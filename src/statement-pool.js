"use strict"

const _ = require('lodash');

// Represents a collection of statements and provides the ability
// to choose a group at random and convert them to strings
//
// The pool is a two-level array.
//
// Each item in the first level is a "statement" that has one or more phrases in it.
// Each item in the second level is the collection of individual phrases within the statement.
module.exports = class StatementPool {
    constructor(statements) {
        this.pool = [];
        statements && this.add(statements);
    }

    add(statements) {
        if (!_.isArray(statements)) {
            statements = [statements];
        }
        this.pool = this.pool.concat(statements);
    }

    select() {
        if (!this.selected) {
            this.selected = _.sample(this.pool);
        }
        return this.selected;
    }

    // Returns an array of strings, bound to the specified context
    bind(context) {
        let statement = this.select();

        if (!statement) {
            return [];
        }

        if (!_.isArray(statement)) {
            statement = [statement];
        }

        const phrases = statement.map((phrase) => {
            const value = _.isFunction(phrase) ? phrase(context) : phrase;
            const text = _.toString(value);
            if (!text.length) {
                log.warn("Statement resulted in an empty string", phrase);
            }
            return text;
        });
        return phrases.filter(text => text.length);
    }
}
