"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Promise = require('bluebird');

module.exports = function () {
    function Validator() {
        var messages = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

        _classCallCheck(this, Validator);

        this.messages = messages || [];
    }

    _createClass(Validator, [{
        key: "validate",
        value: function validate(value) {
            return true;
        }
    }, {
        key: "apply",
        value: function apply(exchange) {
            var _this = this;

            var validate = Promise.method(this.validate.bind(this));
            return validate(exchange.value).then(function (valid) {
                if (!valid) {
                    exchange.valid = false;
                    exchange.write(_this.messages);
                }
                return exchange;
            });
        }
    }]);

    return Validator;
}();