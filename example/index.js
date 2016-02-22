"use strict";

const slack = require('slack-client');
const secret = require('./secret.json');
const Talker = require('../index');

const client = new slack.RtmClient(secret.token);
const dispatcher = new Talker.Dispatcher();

// You must implement message dispatching
client.on(slack.RTM_EVENTS.MESSAGE, dispatcher.messageHandler);

dispatcher.exclude = (exchange) => exchange.type !== Talker.Exchange.DM;

dispatcher.on('start', (conversation, message) => {
    console.log("Conversation started based on message", message.input.text);

    // You must implement an event handler for the conversation's
    // `say` event. Actual message sending is not handled by this module.
    // Instead, the conversation handles the timing of message sending.
    conversation.on('say', (msg) => {
        console.log("say", msg);
        client.sendMessage(msg.text, msg.channel);
    });

    // You can short circuit the conversation request by setting the
    // exchange.ended value to false when processing first begins.
    conversation.on('preparing', (request, exchange) => {
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
});

client.start();
