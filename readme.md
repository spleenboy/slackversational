# me-talk-slack

```javascript
const Request = require('me-talk-slack/request');
const ConversationDispatcher = require('me-talk-slack/conversation-dispatcher');
const Required = require('me-talk-slack/validators/required');
const FutureDate = require('me-talk-slack/parsers/future-date');

const dispatcher = new ConversationDispatcher(slack);

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
```
