const net = require("node:net");
const { ChatIO, ChatService } = require("./chat-app");
const { Users } = require("./users");
const { ChatHistory } = require("./chat-history");
const PORT = 9000;

const main = () => {
  const chatServer = net.createServer();

  const users = new Users();
  const chatIO = new ChatIO(chatServer);
  const chatHistory = new ChatHistory();
  const chatService = new ChatService(users, chatIO, chatHistory);

  chatService.start();

  chatServer.listen(PORT, () => {
    console.log("chat server is online");
  });

};

main();