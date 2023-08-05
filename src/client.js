const net = require("node:net");
const PORT = 9000;
const commands = { to: "", createRoom: "", join: "", exit: "" };

// make a class 
const currentState = { type: '', receiver: '' };

const sendRequest = (request, client) => {
  client.write(JSON.stringify(request));
};

const display = (response) => {
  if (response.length === 0) {
    return;
  }

  const conversations = response.map(({ sender, message }) => `${sender}: ${message}`);
  console.log(conversations.join("\n"));
};

const fetchChatHistory = (sender, receiver, client) => {
  const type = 'personal-chat-history';
  const data = { sender, receiver };

  sendRequest({ type, data }, client);
};

const isPersonalChat = (data) => data.startsWith("to:");
const isCreateRoom = (data) => data.startsWith("create-room:");

const raiseRequest = (data, client, name) => {

  //darwana switch case
  switch (true) {
    // extract into function
    case isPersonalChat(data): {
      receiver = data.split(":").at(1);
      currentState.type = 'personal-chat';
      currentState.receiver = receiver;
      console.clear();
      fetchChatHistory(name, receiver, client);
      break;
    }

    case isCreateRoom(data): {
      const roomName = data.split(":").at(1);
      currentState.type = 'create-room';
      currentState.receiver = roomName;
      const request = { type: currentState.type, data: { ownerName: name, roomName } }
      sendRequest(request, client);
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
    client.on("data", (data) => display(JSON.parse(data)));
  });
};

main();
