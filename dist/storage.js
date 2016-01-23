"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
    function Storage() {
        _classCallCheck(this, Storage);

        this.buckets = {};
    }

    _createClass(Storage, [{
        key: "findById",
        value: function findById(id) {
            var _this = this;

            return new Promise(function (resolve, reject) {
                resolve(_this.buckets[id]);
            });
        }
    }, {
        key: "removeById",
        value: function removeById(id) {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
                delete _this2.buckets[id];
                resolve();
            });
        }
    }, {
        key: "add",
        value: function add(id, obj) {
            var _this3 = this;

            return new Promise(function (resolve, reject) {
                _this3.buckets[id] = obj;
                resolve(obj);
            });
        }
    }]);

    return Storage;
}();