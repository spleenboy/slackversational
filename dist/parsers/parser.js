"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
    function Parser() {
        _classCallCheck(this, Parser);
    }

    _createClass(Parser, [{
        key: "parse",
        value: function parse(value) {
            return value;
        }
    }, {
        key: "apply",
        value: function apply(response, context) {
            response.value = this.parse(response.value);
        }
    }, {
        key: "hasWord",
        value: function hasWord(text, word) {
            var search = new RegExp("(\b|^)" + word + "(\b|$)", 'i');
            var matches = search.test(text);
            return matches;
        }
    }, {
        key: "hasAnyWord",
        value: function hasAnyWord(text, words) {
            return words.some(this.hasWord.bind(this, text));
        }
    }]);

    return Parser;
}();