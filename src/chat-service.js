const { Room } = require("./rooms");
const { User } = require("./users");

class ChatService {
  #users;
  #chatIO;
  #chatHistory;
  #rooms;

  constructor(users, chatIO, chatHistory, rooms) {
    this.#users = users;
    this.#chatIO = chatIO;
    this.#chatHistory = chatHistory;
    this.#rooms = rooms;
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

  #isInvalidAccess(request) {
    const { type, data: { name } } = request;
    const isDuplicateUser = this.#users.isRegisteredUser(name) && this.#users.isOnline(name);

    return type === "log-in" && isDuplicateUser;
  }

  #getPersonalChatHistory({ sender, receiver }) {
    const chatHistory = this.#chatHistory.getPersonal(sender, receiver);
    this.#chatIO.write(sender, JSON.stringify(chatHistory));
  }

  #createRoom(data) {
    const { roomName, ownerName } = data;
    const room = new Room(roomName, ownerName);
    this.#rooms.add(room);
    console.log("");
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
        break;
      }

      case "create-room": {
        this.#createRoom(data);
        break;
      }

      // case "join" 
    }
  }

  start() {
    this.#chatIO.buildConnection({
      handleRequest: (request) => this.#handleRequest(request),
      isInvalidAccess: (request) => this.#isInvalidAccess(request),
      onDisconnect: (name) => this.#onDisconnect(name),
    });
  }
}



class Auth {
  #users
  #gateway

  constructor() { }


}


class ChatIO {
  #server;
  #sockets;

  constructor(server) {
    this.#server = server;
    this.#sockets = {}; 
  }

  start({ handleRequest, isInvalidAccess, onDisconnect }) {
    this.#server.on("connection", (socket) => {
      socket.setEncoding("utf-8");

      socket.on("data", (data) => {
        const request = JSON.parse(data);
        const { data: { name } } = request;

        if (isLogin) {
          if (isInvalidAccess) {
            socket.end();
            return
          }

          this.#sockets[name] = socket;
        }

        socket.on("end", () => {
          onDisconnect(name);
        });

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