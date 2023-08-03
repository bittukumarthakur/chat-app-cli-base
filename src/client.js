const net = require("node:net");
const PORT = 9000;
const commands = { to: "", createRoom: "", join: "", exit: "" };

// make a class 
const currentState = { type: '', receiver: '' };

const sendRequest = (request, client) => {
  client.write(JSON.stringify(request));
};

const display = (data) => {
  const parsedData = JSON.parse(data);
  const conversations = parsedData.map(({ sender, message }) => `${sender}: ${message}`);
  console.log(conversations.join("\n"));
};

const isPersonalChat = (data) => data.startsWith("to:");

const raiseRequest = (data, client, name) => {
  switch (true) {
    case isPersonalChat(data): {
      receiver = data.split(":").at(1);
      currentState.type = 'personal-chat';
      currentState.receiver = receiver;
      break;
    }

    default: {
      const request = {
        type: currentState.type,
        data: {
          sender: name,
          receiver: currentState.receiver,
          message: data
        }
      };

      sendRequest(request, client);
    }
  }
};

const raiseRequestOnData = (client, name) => {
  process.stdin.setEncoding("utf-8");
  client.setEncoding("utf-8");

  process.stdin.on("data", (data) => raiseRequest(data.trim(), client, name));
};

const main = () => {
  const name = process.argv[2];
  const client = net.createConnection(PORT);

  client.on("connect", () => {
    const request = { type: "log-in", data: { name } };
    sendRequest(request, client);

    raiseRequestOnData(client, name);
    client.on("data", display);
  });
};

main();
