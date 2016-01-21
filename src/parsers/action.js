"use strict";

module.exports = class Action extends Parser {
    parse(value) {
        if (this.hasAnyWord(value, ['bid', 'buy', 'offer', 'list'])) {
            return 'bid';
        }
        if (this.hasAnyWord(value, ['auction'])) {
            return 'auction';
        }
        if (this.hasAnyWord(value, ['raffle', 'sell'])) {
            return 'raffle';
        }
        return null;
    }
}
