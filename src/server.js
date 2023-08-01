const net = require("node:net");
const { connectUser, SocketService, Chat, ChatService } = require("./chat-app");
const PORT = 9000;

const main = () => {
  const chatServer = net.createServer();

  const chat = new Chat();
  const socketService = new SocketService(chatServer);
  const chatService = new ChatService(chat, socketService);

  chatService.start();

  chatServer.listen(PORT, () => {
    console.log("chat server is online");
  });

};

main();