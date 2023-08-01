const net = require("node:net");
const { connectUser,  ChatIO,  ChatService } = require("./chat-app");
const {Users} = require("./users");
const PORT = 9000;

const main = () => {
  const chatServer = net.createServer();

  const users = new Users();
  const chatIO = new ChatIO(chatServer);
  const chatService = new ChatService(users, chatIO);

  chatService.start();

  chatServer.listen(PORT, () => {
    console.log("chat server is online");
  });

};

main();