"use strict";

const secret = require('./secret.json');
const Slack = require('slack-client');
const Talker = require('../dist/');

const slack = new Slack(secret.token, true, true);
const dispatcher = new Talker.ConversationDispatcher(slack);

dispatcher.on('start', (conversation, message) => {
    // Initialize the conversation based on the message received
    const getName = new Request("getName");
    getName.questions = ["What do you want?"];
    getName.responses = [(message) => `I see you want ${message.text}.`];
    getName.on('valid', (response) => {
        save(response.value);
        conversation.nextRequest();
        conversation.process(response);
    });
    conversation.addRequest(getName);

    const getWhen = new Request("getWhen");
    getWhen.questions = ["When do you want it?"];
    getWhen.responses = ["Sounds good. Thanks!"];
    getName.processors = [
        new FutureDate(),
        new Required(["That doesn't make sense."]),
    ];
    getWhen.on('valid', (response) => {
        save(response.value);
        conversation.end();
    });
    conversation.addRequest(getDesc);
});
