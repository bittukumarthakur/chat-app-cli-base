const net = require("node:net");
const { connectUser } = require("./chat-app");
const PORT = 8000;

const main = () => {
  const chatServer = net.createServer();
  const activeUsers = [];

  chatServer.listen(PORT, () => {
    console.log("chat server is online");
  });

  chatServer.on("connection", (socket) => connectUser(socket, activeUsers));
};

main();