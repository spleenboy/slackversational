# slackversational
> A helper module for handling the plumbing of a Slack bot that uses [node-slack-client](https://github.com/slackhq/node-slack-client).

```
Incoming Message
       |
       |
      \|/
   Dispatcher (Examines message and routes to appropriate conversation)
       |
      \|/
    Exchange (Encapsulates incoming message and output. Passed to conversation.)
       |
       |-----> Conversation (Selects appropriate request for processing.)
                  |
                  |----> Request (Processes exchange. Asks or responds.)
                            |
                            |----> Processors (Parse and validate exchange input.)
```


## Dispatcher
The `Dispatcher` funnels messages to separate conversations based on the channel. This is typically the entry point for your custom implementation.

The constructor takes two arguments. The first is the slack client. The second is a `Storage` instance. This object is used internall by the dispatcher to keep track of all conversations. Conversations are stored and retrieved from the storage object by the channel id.

```javascript
const rtmClient = new Slack.RtmClient(secretToken);
const dispatcher = new Dispatcher();

rtmClient.on(Slack.RTM_EVENTS.MESSAGE, dispatcher.messageHandler);

dispatcher.on('start', (conversation, exchange) => {
    // Initialize the conversation
    conversation.on('say', (msg) => {
        rtmClient.sendMessage(msg.text, msg.channel);
    });
});

dispatcher.on('end', (conversation, exchange) => {
    // Handle the conversation ending
});

rtmClient.start();
```


## Request
The `Request` object has two main methods `ask` and `read`. A request represents the exchange of one idea between the bot and a user. Requests are processed in order, first by calling the `ask` method, which issues one or more lines to the user.

After a user responds to the `ask`, the `read` method is called. The `read` method will process a received message and emit either a `valid` or `invalid` event, depending on the results of the processing.

### Request Statements
A request has an array of both `questions` and `responses`.


## Conversation
A `Conversation` tracks the thread of exchanges passed back and forth through a channel. Each exchange between the bot and external user is treated as a `Request` object. The conversation object keeps track of the current request and passes the current exchange to the request for processing.

A `Conversation` exposes three request events: `reading`, `asking`, `saying`. These events are emitted immediately before each call to the current request. See the `Request` object for details on these methods.

When a conversation is started, you'll initialize it by adding requests to the conversation `chain` property.

```javascript
dispatcher.on('start', (conversation, exchange) => {
    const getDate = new GetDateRequest();
    conversation.addRequest(getDate);
});
```

### Moving the Conversation Along
The conversation object support several methods for changing the current request.

`setRequest` is the most flexible. It takes a single argument than can be either an integer or a predicate function. If the argument is an integer, the zero-indexed request in the chain is selected. The predicate should expect a request object as its argument

```javascript
getDate.on('valid', (exchange) => {
    conversation.setRequest((request) => request === getTime);
});
```

You can also use `conversation.previousRequest` and `conversation.nextRequest` to change the current request. If the request is changed before the end of exchange processing, the conversation will call the `ask` method on the next request.


## Exchange 


## Processors

### Validators


### Parsers


