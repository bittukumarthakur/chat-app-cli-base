const net = require("node:net");
const PORT = 8000;

const connectUser = (socket) => {
  socket.write("Enter your name: ");
};

const main = () => {
  const chatServer = net.createServer();
  chatServer.listen(PORT, () => {
    console.log("chat server is online");
  });

  chatServer.on("connection", (socket) => connectUser(socket));

};

main();