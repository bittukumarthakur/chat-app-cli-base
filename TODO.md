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