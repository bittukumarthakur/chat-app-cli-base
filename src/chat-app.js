const { EventEmitter } = require("events");

class ChatService {
  #users;
  #chatIO;
  #sockets;

  constructor(users, chatIO) {
    this.#users = users;
    this.#sockets = {};
    this.#chatIO = chatIO;
  }

  #formatMessage(sender, message) {
    return JSON.stringify({
      sender,
      messages: [message]
    });
  }

  #onNewUser() {
    this.#chatIO.on("new-user", (data, socket) => {
      const name = JSON.parse(data).sender;
      this.#users.addUser(name);

      this.#sockets[name] = socket;
      socket.write(this.#formatMessage("server", `Hello ${name}`));
    });
  }

  #onPrivateChatRequest() {
    this.#chatIO.on("private-chat-req", (data) => {
      const { sender, receiver } = JSON.parse(data);
      this.#users.connect(sender, receiver);
    });
  }

  #onMessage() {
    this.#chatIO.on("message", (data) => {
      const { sender, messages } = JSON.parse(data);
      const receiver = this.#users.findReceiver(sender); //sender is sender name

      const formattedMsg = this.#formatMessage(sender, ...messages);
      this.#sockets[receiver].write(`${formattedMsg}`);
    });
  }

  start() {
    this.#chatIO.buildConnection({
      formatter: (msg) => this.#formatMessage(msg),
      isChatRequest: (data) => JSON.parse(data).receiver !== ""
    });

    this.#onNewUser();
    this.#onPrivateChatRequest();
    this.#onMessage();
  }
}

class ChatIO extends EventEmitter {
  #server;

  constructor(server) {
    super();
    this.#server = server;
  }

  buildConnection(onData) {
    const { formatter, isChatRequest } = onData;

    this.#server.on("connection", (socket) => {
      const prompt = formatter("Enter your name");
      socket.write(`${prompt}`);

      socket.once("data", (data) => {
        this.emit("new-user", data, socket);

        socket.on("data", (data) => {
          if (isChatRequest(data)) {
            this.emit("private-chat-req", data);
            return;
          }

          this.emit("message", data);
        });
      });
    });
  }
}

module.exports = {
  ChatIO,
  ChatService,
};