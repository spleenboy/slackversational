"use strict";

var bunyan = require('bunyan');

var logger = bunyan.createLogger({
    name: "slackversational",
    level: "debug"
});

module.exports = logger;