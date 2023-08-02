const net = require("node:net");
const PORT = 9000;

const sendResponse = (state, client, data) => {
  client.write(JSON.stringify({ ...state, messages: [data] }));
};

const display = (data) => {
  const parsedData = JSON.parse(data);
  const messages = parsedData.map(({ sender, messages }) => `${sender}: ${messages[0]}`);
  console.log(messages.join("\n"));
};

const isChangePartnerReq = (data) => data.startsWith('to:');

const onData = (data, client, state) => {
  const message = data.trim();
  if (isChangePartnerReq(message)) {
    state.receiver = message.split(":").at(1);
    return;
  };

  sendResponse(state, client, message);
}

const chat = (client) => {
  const [sender, receiver] = ["", ""];
  const state = { sender, receiver };

  process.stdin.setEncoding("utf-8");
  client.setEncoding("utf-8");

  process.stdin.once("data", (data) => {
    state.sender = data.trim();
    sendResponse(state, client, "");

    process.stdin.on("data", (data) => onData(data, client, state));
  });

  client.on("data", display);
  client.on("end", () => process.stdin.destroy());
}

const main = () => {
  const client = net.createConnection(PORT);
  client.on("connect", () => chat(client));
};

main();
