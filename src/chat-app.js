const { EventEmitter } = require("events");
const { User } = require("./users");
const event = { message: "message", disconnect: "disconnect" };

class ChatService {
  #users;
  #chatIO;

  constructor(users, chatIO) {
    this.#users = users;
    this.#chatIO = chatIO;
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

  #onMessage(data) {
    const { sender, receiver, message } = JSON.parse(data);
    const formattedMsg = this.#formatMessage(sender, message);
    this.#users.updateChatHistory(sender, receiver, message);

    this.#chatIO.write(receiver, formattedMsg);
  }

  #onDisconnect(name) {
    this.#users.toggleStatus(name);
  }

  #onUserEntry(name) {
    if (!this.#users.isRegisteredUser(name)) {
      this.#registerUser(name);
      return;
    }

    this.#users.toggleStatus(name);
    const chatHistory = this.#users.findChatHistory(name);
    this.#chatIO.write(name, JSON.stringify(chatHistory));
  }

  #isInvalidAccess(name) {
    return this.#users.isRegisteredUser(name) && this.#users.isOnline(name);
  }

  #handleRequest(request) {
    this.#onUserEntry(request.value);
  }

  start() {
    this.#chatIO.buildConnection({
      handleRequest: (request) => this.#handleRequest(request),
      isInvalidAccess: (name) => this.#isInvalidAccess(name)
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

  buildConnection({ handleRequest, isInvalidAccess }) {
    this.#server.on("connection", (socket) => {
      socket.setEncoding("utf-8");
      socket.on("data", (data) => {
        const request = JSON.parse(data);

        if (request.title === "user-name") {
          const name = request.value;

          if (isInvalidAccess(name)) {
            socket.end();
            return;
          }

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