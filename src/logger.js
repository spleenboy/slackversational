"use strict";

const bunyan = require('bunyan');

const logger = bunyan.createLogger({
    name: "slackversational",
    level: "debug",
});

module.exports = logger;
