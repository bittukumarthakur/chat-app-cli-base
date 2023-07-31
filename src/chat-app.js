const net = require("node:net");
const PORT = 8000;

const connectUser = (socket) => {
  socket.setEncoding("utf-8");

  socket.write("Enter your name: ");
  socket.once("data", (data) => {
    const name = data.trim();
    socket.write(`Hello ${name}!\n`);
  });
};

const main = () => {
  const chatServer = net.createServer();

  chatServer.listen(PORT, () => {
    console.log("chat server is online");
  });

  chatServer.on("connection", (socket) => connectUser(socket));
};

main();