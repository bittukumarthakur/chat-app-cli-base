const { EventEmitter } = require("events");

class User {
  #name;
  #id;

  constructor(id, name) {
    this.#name = name;
    this.#id = id;
  }

  get name() {
    this.#name;
  }
}

class Users {
  #users;
  #activeUsers;
  #count;
  #chatPartners;

  constructor() {
    this.#users = [];
    this.#activeUsers = [];
    this.#chatPartners = {};
  }

  findReceiver(sender) {
    return this.#chatPartners[sender];
  }
  
  addUser(name) {
    this.#count++;
    const user = new User(this.#count, name);
    this.#activeUsers.push(user);
    this.#users.push(user);
  }

  connect(sender, receiver) {
    console.log(`sender: ${sender} receiver: ${receiver}`);

    this.#chatPartners[sender] = receiver;
    console.log(">>>>>", this.#chatPartners);
  }
}

class ChatService {
  #users;
  #socketService;
  #sockets;

  constructor(users, socketService) {
    this.#users = users;
    this.#sockets = {};
    this.#socketService = socketService;
  }

  #formatMessage(sender, message) {
    return JSON.stringify({
      sender,
      messages: [message]
    });
  }

  start() {
    this.#socketService.buildConnection({
      formatter: (msg) => this.#formatMessage(msg),
      isChatRequest: (data) => JSON.parse(data).receiver !== ""
    });

    this.#socketService.on("new-user", (data, socket) => {
      const name = JSON.parse(data).sender;
      this.#users.addUser(name);

      this.#sockets[name] = socket;
      socket.write(this.#formatMessage("server", `Hello ${name}`));
    });

    this.#socketService.on("private-chat-req", (data) => {
      const { sender, receiver } = JSON.parse(data);
      this.#users.connect(sender, receiver);
    });

    this.#socketService.on("message", (data) => {
      const { sender, messages } = JSON.parse(data);
      const receiver = this.#users.findReceiver(sender); //sender is sender name

      const formattedMsg = this.#formatMessage(sender, ...messages);
      this.#sockets[receiver].write(`${formattedMsg}`);
    });
  }
}




class SocketService extends EventEmitter {
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
  SocketService,
  ChatService,
  Users,
  User
};

