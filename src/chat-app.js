const { EventEmitter } = require("events");
const { User } = require("./users");

class ChatService {
  #users;
  #chatIO;

  constructor(users, chatIO) {
    this.#users = users;
    this.#chatIO = chatIO;
  }

  #formatMessage(sender, message) {
    return JSON.stringify([{ sender, messages: [message] }]);
  }

  #onNewUser(name) {
    const user = new User(name);
    this.#users.addUser(user);
    const formattedMsg = this.#formatMessage("server", `Hello ${name}`);
    this.#chatIO.write(name, formattedMsg);

  }

  #onMessage(data) {
    const { sender, receiver, messages } = JSON.parse(data);
    const formattedMsg = this.#formatMessage(sender, ...messages);
    this.#users.updateChatHistory(sender, receiver, messages);
    this.#chatIO.write(receiver, formattedMsg);
  }

  #onDisconnect(name) {
    this.#users.toggleStatus(name);
  }

  #logIn(name) {
    const chatHistory = this.#users.findChatHistory(name);
    this.#chatIO.write(name, JSON.stringify(chatHistory));
  }

  #authenticateUser(name) {
    if (this.#users.isRegisteredUser(name)) {
      this.#logIn(name);
      return;
    }

    this.#onNewUser(name);
  }

  #isInvalidAccess(name) {
    return this.#users.isRegisteredUser(name) && this.#users.isOnline(name);
  }

  start() {
    this.#chatIO.buildConnection({
      formatter: (sender, msg) => this.#formatMessage(sender, msg),
      isInvalidAccess: (name) => this.#isInvalidAccess(name),
      authenticateUser: (name) => this.#authenticateUser(name)
    });

    this.#chatIO.on("message", (data) => this.#onMessage(data));
    this.#chatIO.on("new-user", (name) => this.#onNewUser(name));
    this.#chatIO.on("disconnect", (name) => this.#onDisconnect(name));

  }
}

class ChatIO extends EventEmitter {
  #server;
  #sockets;

  constructor(server) {
    super();
    this.#server = server;
    this.#sockets = {};
  }

  buildConnection(onData) {
    this.#server.on("connection", (socket) => {
      socket.setEncoding("utf-8");

      const { formatter, isInvalidAccess, authenticateUser } = onData;
      const prompt = formatter("server", "Enter your name");
      socket.write(`${prompt}`);

      socket.once("data", (data) => {
        const name = JSON.parse(data).sender;

        if (isInvalidAccess(name)) {
          socket.write(formatter("server", "Name already exist"),
            () => socket.end());
          return;
        }

        this.#sockets[name] = socket;
        authenticateUser(name);
        // this.emit("new-user", name);

        socket.on("data", (data) => {
          this.emit("message", data);
        });

        socket.on("end", () => {
          // emit here offline event;
          this.emit("disconnect", name);
        })
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