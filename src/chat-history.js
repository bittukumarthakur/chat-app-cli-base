class ChatHistory {
  #personalHistory;

  constructor() {
    this.#personalHistory = [];
  }

  addToPersonal(conversation) {
    this.#personalHistory.push(conversation);
  }

  getPersonal(from, to) {
    return this.#personalHistory.filter(({ sender, receiver }) => {
      return [sender, receiver].every(person => person === from || person === to);
    });
  }

}

module.exports = {
  ChatHistory
};
