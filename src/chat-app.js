const { EventEmitter } = require("events");

class User {
  #name
  #id

  constructor(id, name) {
    this.#name = name;
    this.#id = id;
  }

  get name() {
    this.#name;
  }
}

class Chat {
  #users
  #activeUsers
  #count
  #connections

  constructor() {
    this.#users = [];
    this.#activeUsers = [];
  }

  sendMessage(message, sender) {

  }

  addUser(name) {
    this.#count++;
    const user = new User(this.#count, name);
    this.#activeUsers.push(user);
    this.#users.push(user);
  }
}

class ChatService {
  #chat
  #socketService
  #connections

  constructor(chat, socketService) {
    this.#chat = chat;
    this.#connections = {};
    this.#socketService = socketService;
  }

  #formatMessage(message) {
    return JSON.stringify({
      sender: "server",
      messages: [message]
    })
  }

  start() {
    this.#socketService.buildConnection((msg) => this.#formatMessage(msg));

    this.#socketService.on("new-user", (data, socket) => {
      const name = JSON.parse(data).sender;
      this.#chat.addUser(name);

      this.#connections[name] = socket;
      socket.write(this.#formatMessage(`Hello ${name}`));
    });

    this.#socketService.on("private-chat-req", () => { });
    this.#socketService.on("message", () => { });
  }
}




class SocketService extends EventEmitter {
  #server

  constructor(server) {
    super();
    this.#server = server;
  }

  buildConnection(cb) {
    this.#server.on("connection", (socket) => {
      const prompt = cb("Enter your name");
      socket.write(`${prompt}`);

      socket.once("data", (data) => {
        this.emit("new-user", data, socket);

        socket.on("data", (data) => {
          if (isChatRequest(data)) {
            this.emit("private-chat-req", data);
            return;
          }

          this.emit("message", data);

        })
      });
    })
  }
}

module.exports = {
  SocketService,
  ChatService,
  Chat,
  User
};