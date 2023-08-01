const { count } = require("node:console");
const net = require("node:net");
const PORT = 9000;

const onData = (client, name, data) => {
  const response = {sender: name, receiver: '', messages: []};

  if (data.startsWith('to:')) {
    const [, receiver] = data.split(':');
    response.receiver = receiver;
  } else {
    response.messages.push(data);
  }

  client.write(JSON.stringify(response));
};

const display = (data) => {
  const messages = data.messages.join('\n');
  console.log(`${data.sender}: ${messages}`);
};

const main = () => {
  const client = net.createConnection(PORT);

  client.on("connect", () => {
    let name;

    process.stdin.setEncoding("utf-8");
    client.setEncoding("utf-8");

    process.stdin.once("data", (data) => {
      name = data.trim();
      onData(client, name, '');

      process.stdin.on("data", (data) => {
        onData(client, name, data.trim());
      });
    });
    
    client.on("data", (data) => display(JSON.parse(data)));
  });

};

main();
