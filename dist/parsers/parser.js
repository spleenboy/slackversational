"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Promise = require('bluebird');

module.exports = function () {
    function Parser() {
        _classCallCheck(this, Parser);
    }

    _createClass(Parser, [{
        key: 'parse',

        // Handles parsing the value. This may return either the
        // parsed value or a promise to resolve with the value.
        value: function parse(value) {
            return value;
        }
    }, {
        key: 'apply',
        value: function apply(exchange) {
            var parse = Promise.method(this.parse.bind(this));
            return parse(exchange.value).then(function (value) {
                exchange.value = value;
                return exchange;
            });
        }
    }, {
        key: 'hasWord',
        value: function hasWord(text, word) {
            var search = new RegExp('(\b|^)' + word + '(\b|$)', 'i');
            var matches = search.test(text);
            return matches;
        }
    }, {
        key: 'hasAnyWord',
        value: function hasAnyWord(text, words) {
            return words.some(this.hasWord.bind(this, text));
        }
    }]);

    return Parser;
}();