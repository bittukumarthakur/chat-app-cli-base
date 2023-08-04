const { EventEmitter } = require("events");
const { User } = require("./users");
const event = { message: "message", disconnect: "disconnect" };

class ChatService {
  #users;
  #chatIO;
  #chatHistory;

  constructor(users, chatIO, chatHistory) {
    this.#users = users;
    this.#chatIO = chatIO;
    this.#chatHistory = chatHistory;
  }

  #formatMessage(sender, message) {
    return JSON.stringify([{ sender, message }]);
  }

  #registerUser(name) {
    const user = new User(name);
    this.#users.addUser(user);
    const formattedMsg = this.#formatMessage("server", `Hello ${name}`);

    this.#chatIO.write(name, formattedMsg);
  }

  #onMessage(conversation) {
    const { sender, receiver, message } = conversation;
    const formattedMsg = this.#formatMessage(sender, message);
    this.#chatHistory.addToPersonal(conversation);

    this.#chatIO.write(receiver, formattedMsg);
  }

  #onDisconnect(name) {
    this.#users.toggleStatus(name);
  }

  #logIn(name) {
    if (!this.#users.isRegisteredUser(name)) {
      this.#registerUser(name);
      return;
    }

    this.#users.toggleStatus(name);
  }

  #isInvalidAccess(name) {
    return this.#users.isRegisteredUser(name) && this.#users.isOnline(name);
  }

  #getPersonalChatHistory({ sender, receiver }) {
    const chatHistory = this.#chatHistory.getPersonal(sender, receiver);
    this.#chatIO.write(sender, JSON.stringify(chatHistory));
  }

  #handleRequest(request) {
    const { type, data } = request;

    switch (type) {
      case "log-in": {
        this.#logIn(data.name);
        break;
      }

      case "personal-chat": {
        this.#onMessage(data);
        break;
      }

      case "personal-chat-history": {
        this.#getPersonalChatHistory(data);
      }
    }
  }

  start() {
    this.#chatIO.buildConnection({
      handleRequest: (request) => this.#handleRequest(request),
      isInvalidAccess: (name) => this.#isInvalidAccess(name),
      onDisconnect: (name) => this.#onDisconnect(name)
    });
  }
}

class ChatIO {
  #server;
  #sockets;

  constructor(server) {
    this.#server = server;
    this.#sockets = {};
  }

  buildConnection({ handleRequest, isInvalidAccess, onDisconnect }) {
    this.#server.on("connection", (socket) => {
      socket.setEncoding("utf-8");
      socket.on("data", (data) => {
        const request = JSON.parse(data);

        if (request.type === "log-in") {
          const { name } = request.data;

          if (isInvalidAccess(name)) {
            socket.end();
            return;
          }

          socket.on("end", () => {
            console.log(`>> Disconnected: ${name}`);
            onDisconnect(name);
          });

          this.#sockets[name] = socket;
        }

        handleRequest(request);
      });
    });
  }

  write(receiver, message) {
    this.#sockets[receiver].write(message);
  }
}

module.exports = {
  ChatIO,
  ChatService,
};