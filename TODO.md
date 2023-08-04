## what we have to fix;
- when we enter the name, server should respond => hello name!;

## change contract 
- {type: "message", data: "hello"}
- {type: "user name", data: "bittu"}
- {type: "connect", data: "raj"}

## terminal 
node client.js bittu;
=> server: hello bittu!
to:raj
hi

## group 
node client.js bittu;
=> server: hello bittu!
create-room:step-9;
=> server: room step-9 is created;
hello step member

## home
node client.js bittu;
=> server: hello bittu!
enter:step-9;
hello 

## someone join group
node client.js raj;
join:step-9;
hello bhai
how are you

## someone enter group
node client.js raj;
enter:step-9;
hello again

## someone exit group
node client.js raj;
enter:step-9;
exit:

## chatHistory
sender name we I have 
type: [
  'personal-chat',
  'receiver name'
]

if personal chat we need receiver name'
{
  type: 'personal-chat',
  data: { sender , receiver, message}
}

if group chat we need group name along with type

{
  type: 'group-chat',
  data: {
    sender,
    group-name,
    message
  }
}

## request data format
- login/open chat app
request = {
  type: "log-in",
  data: {name: bittu}
  }

- personal chat
request = {
  type: "personal-chat",
  data: {sender: bittu, receiver: raj, message: hello bro}
  }

- create group
request = {
  type: "new-group",
  data: {sender: bittu, room: step}
  }

- group message
request = {
  type: "group-message",
  data: {sender: bittu, room: step, message}
  }

## chat history
history structure => {
  personal: [
    {sender,recevier,message},
    {sender,recevier,message},
  ],
  group: {
    groupName: [
    {source,message}
    {source,message}
    ]
  }
}

const chatHistory = new ChatHistory;
chatHistory.addToPersonal({sender,recevier,message});
chatHistory.getPersonal(sender, receiver);


to:
enter:
fetch chat history from server


to:raj