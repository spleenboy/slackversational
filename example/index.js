"use strict";

const secret = require('./secret.json');
const Slack = require('slack-client');
const Talker = require('../dist/');

const slack = new Slack(secret.token, true, true);
const dispatcher = new Talker.Dispatcher(slack);

slack.on('open', console.log.bind(console));
slack.on('error', console.error.bind(console));

dispatcher.exclude = (message) => !message.channel.is_im;

dispatcher.on('start', (conversation, message) => {
    console.log("Conversation started based on message", message.input.text);

    // You can short circuit the conversation request by setting the
    // exchange.valid value to false when processing first begins.
    conversation.on('processing', (request, exchange) => {
        if (exchange.input.text === "cancel") {
            exchange.ended = true;
            exchange.write("Canceling");
        }
    });

    // Initialize the conversation based on the message received
    const getName = new Talker.Request("getName");
    getName.questions = [["What do you want?"], ["What is it you want?"]];
    getName.on('valid', (msg) => {
        console.log("Got valid input", msg.value);
        if (msg.value !== "nothing") {
            msg.write(`I see you want _${msg.value}_.`);
            conversation.setRequest(r => r.id === "getWhen");
        } else {
            msg.write("Okay. Fine.");
            conversation.end();
        }
    });
    conversation.addRequest(getName);

    const getWhen = new Talker.Request("getWhen");
    getWhen.questions = ["When do you want it?"];
    getWhen.responses = [[(msg) => `${msg.value}. Sounds good.`, "okthxbye"]];
    getWhen.processors = [
        new Talker.Parsers.FutureDate(),
        new Talker.Validators.Required(["That doesn't make sense."]),
        new Talker.Parsers.Delay(),
    ];
    getWhen.on('valid', (msg) => {
        console.log("Got valid input", msg.value);
        conversation.end();
    });
    conversation.addRequest(getWhen);

    conversation.on('saying', (request, msg) => {
        console.log("saying", msg.output);
    });
});

slack.login();
