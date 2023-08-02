class User {
  #name
  #online
  #chatHistory // rich object, message queue 

  constructor(name) {
    this.#name = name;
    this.#online = true;
    this.#chatHistory = [];
  }

  get name() {
    return this.#name;
  }

  isOnline() {
    return this.#online;
  }

  toggleStatus() {
    this.#online = !this.#online;
  }

  storeMessage(message) { //sender: message
    this.#chatHistory.push(message);
  }

  get chatHistory() {
    return [...this.#chatHistory]
  }
}

class Users {
  #users;

  constructor() {
    this.#users = [];
  }

  addUser(user) {
    this.#users.push(user);
  }

  #getUserByName(name) {
    return this.#users.find((user) => user.name === name);
  }

  isOnline(name) {
    const user = this.#getUserByName(name);
    return user.isOnline();
  }

  isRegisteredUser(name) {
    return this.#users.some((user) => user.name === name);
  }


  toggleStatus(name) {
    const user = this.#getUserByName(name);
    user.toggleStatus();
  }

  updateChatHistory(senderName, receiverName, messages) {
    const sender = this.#getUserByName(senderName);
    sender.storeMessage({ sender: senderName, messages });

    const receiver = this.#getUserByName(receiverName);
    receiver.storeMessage({ sender: senderName, messages });
  };

  findChatHistory(name) {
    const user = this.#getUserByName(name)
    return user.chatHistory;
  }
}

module.exports = {
  Users,
  User
};