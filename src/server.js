const net = require("node:net");
const { connectUser, SocketService, Users, ChatService } = require("./chat-app");
const PORT = 9000;

const main = () => {
  const chatServer = net.createServer();

  const users = new Users();
  const socketService = new SocketService(chatServer);
  const chatService = new ChatService(users, socketService);

  chatService.start();

  chatServer.listen(PORT, () => {
    console.log("chat server is online");
  });

};

main();