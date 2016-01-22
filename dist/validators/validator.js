"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
        value: function apply(response, context) {
            if (!this.validate(response.value)) {
                response.say(this.messages, context);
            }
        }
    }]);

    return Validator;
}();