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

  #signUp(name) {
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

  #logIn(name) {
    this.#users.toggleStatus(name);
    const chatHistory = this.#users.findChatHistory(name);
    this.#chatIO.write(name, JSON.stringify(chatHistory));
  }

  #authenticateUser(name) {
    if (this.#users.isRegisteredUser(name)) {
      this.#logIn(name);
      return;
    }

    this.#signUp(name);
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

    this.#chatIO.on(event.message, (data) => this.#onMessage(data));
    this.#chatIO.on(event.disconnect, (name) => this.#onDisconnect(name));
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

        socket.on("data", (data) => {
          this.emit(event.message, data);
        });

        socket.on("end", () => {
          this.emit(event.disconnect, name);
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