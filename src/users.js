class User {
  #name;
  #online;

  constructor(name) {
    this.#name = name;
    this.#online = true;
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
}

class Users {
  #users;

  constructor() {
    this.#users = [];
  }

  addUser(user) {
    this.#users.push(user);
  }

  getUserByName(name) {
    return this.#users.find((user) => user.name === name);
  }

  isOnline(name) {
    const user = this.getUserByName(name);
    return user.isOnline();
  }

  isRegisteredUser(name) {
    return this.#users.some((user) => user.name === name);
  }

  toggleStatus(name) {
    const user = this.getUserByName(name);
    user.toggleStatus();
  }
}

module.exports = {
  Users,
  User
};