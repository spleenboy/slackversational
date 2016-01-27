"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _ = require('lodash');

// Represents a collection of statements and provides the ability
// to choose a group at random and convert them to strings
//
// The pool is a two-level array.
//
// Each item in the first level is a "statement" that has one or more phrases in it.
// Each item in the second level is the collection of individual phrases within the statement.
module.exports = function () {
    function StatementPool(statements) {
        _classCallCheck(this, StatementPool);

        this.pool = [];
        statements && this.add(statements);
    }

    _createClass(StatementPool, [{
        key: "add",
        value: function add(statements) {
            if (!_.isArray(statements)) {
                statements = [statements];
            }
            this.pool.push(statements);
        }
    }, {
        key: "select",
        value: function select() {
            if (!this.selected) {
                this.selected = _.sample(this.pool);
            }
            return this.selected;
        }

        // Returns an array of strings, bound to the specified context

    }, {
        key: "bind",
        value: function bind(context) {
            var _this = this;

            var statement = this.select();

            if (!statement) {
                return [];
            }

            var phrases = statement.map(function (phrase) {
                var value = _.isFunction(phrase) ? phrase(_this) : phrase;
                var text = _.toString(value);
                if (!text.length) {
                    log.warn("Statement resulted in an empty string", phrase);
                }
                return text;
            });
            return phrases.filter(function (text) {
                return text.length;
            });
        }
    }]);

    return StatementPool;
}();