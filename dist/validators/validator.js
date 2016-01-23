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
        key: "isValid",
        value: function isValid(value) {
            return true;
        }
    }, {
        key: "apply",
        value: function apply(response) {
            if (!this.isValid(response.value) && this.messages) {
                console.log("Invalid response value", response.value);
                response.write(this.messages);
                response.valid = false;
            }
        }
    }]);

    return Validator;
}();