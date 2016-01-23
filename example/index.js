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

    // Initialize the conversation based on the message received
    const getName = new Talker.Request("getName");
    getName.questions = [["What do you want?"], ["What is it you want?"]];
    getName.responses = [(msg) => `I see you want ${msg.value}.`];
    getName.on('valid', (msg) => {
        console.log("Got valid input", msg.value);
        conversation.nextRequest();
    });
    conversation.addRequest(getName);

    const getWhen = new Talker.Request("getWhen");
    getWhen.questions = ["When do you want it?"];
    getWhen.responses = [(msg) => `${msg.value}. Sounds good. Thanks!`];
    getWhen.processors = [
        new Talker.Parsers.FutureDate(),
        new Talker.Validators.Required(["That doesn't make sense."]),
    ];
    getWhen.on('valid', (msg) => {
        console.log("Got valid input", msg.value);
        console.log("Ending conversation");
        conversation.say(["Okaythxbye"]);
        conversation.end();
    });
    conversation.addRequest(getWhen);

    conversation.on('saying', (request, msg) => {
        console.log("saying", msg.output);
    });

    console.log("Processing first message");
    try {
        conversation.process(message);
    }
    catch (e) {
        console.error(e);
    }
});

slack.login();
