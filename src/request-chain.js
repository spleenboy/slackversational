"use strict";

const _ = require('lodash');

export default class RequestChain {
    constructor() {
        this.chain = [];
        this.step = 0;
    }


    add(request) {
        this.chain.push(request);
    }


    setStep(test) {
        if (_.isInteger(test)) {
            this.step = _.clamp(test, 0, this.chain.length = 1);
            return;
        }
        this.chain.some((request, i) => {
            if (test(request)) {
                this.step = i;
                return true;
            }
            return false;
        });
    }


    current() {
        return this.chain[this.step];
    }


    previous() {
        this.step = _.clamp(this.step - 1, 0);
    }


    // Advances one step forward, or goes to the start
    next() {
        this.step += 1;
        if (this.step >= this.chain.length) {
            this.step = 0;
        }
    }
}
