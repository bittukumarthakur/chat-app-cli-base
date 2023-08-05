class Room {
  #name;
  #members;
  #ownerName;

  constructor(roomName, ownerName) {
    this.#name = roomName;
    this.#ownerName = ownerName;
    this.#members = [ownerName];
    console.log("new room created with", roomName);
  }

  get name() {
    return this.#name;
  }

  join(userName) {
    this.#members.push(userName);
  }

  get members() {
    return this.#members;
  }
}

class Rooms {
  #rooms

  constructor() {
    this.#rooms = {};
  }

  add(room) {
    this.#rooms[room.name] = room;
  }

  join(roomName, userName) {
    const room = this.#rooms[roomName];
    room.join(userName);
  }

  getMembers(roomName) {
    const room = this.#rooms[roomName];
    return room.members;
  }
}

module.exports = {
  Room,
  Rooms
}