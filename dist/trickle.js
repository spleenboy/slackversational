"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventEmitter = require('events');

// Queues up actions to be exectued in FIFO order with a delay

var Trickle = function (_EventEmitter) {
    _inherits(Trickle, _EventEmitter);

    function Trickle() {
        _classCallCheck(this, Trickle);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Trickle).call(this));

        _this.queue = [];
        _this.delay = 1000;
        _this.timer = null;
        return _this;
    }

    _createClass(Trickle, [{
        key: 'add',
        value: function add(method) {
            this.queue.push(method);
            if (!this.timer) {
                this.emit('start');
                this.run();
            }
        }
    }, {
        key: 'run',
        value: function run() {
            if (!this.queue.length) {
                this.timer = null;
                this.emit('done');
                return;
            }

            var next = this.queue.shift();
            next();

            this.timer = setTimeout(this.run.bind(this), this.delay);
        }
    }]);

    return Trickle;
}(EventEmitter);

module.exports = Trickle;