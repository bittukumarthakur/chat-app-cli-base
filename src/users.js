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
  #count;
  #chatPartners;

  constructor() {
    this.#users = [];
    this.#chatPartners = {};
  }

  findReceiver(sender) {
    return this.#chatPartners[sender];
  }

  addUser(name) {
    this.#count++;
    const user = new User(this.#count, name);
    this.#users.push(user);
  }

  connect(sender, receiver) {
    this.#chatPartners[sender] = receiver;
  }
}

module.exports = {
  Users
};