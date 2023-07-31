const sendMessage = (message, sender, users) => {
  const receiver = users.find(({ name }) => sender !== name);
  receiver.socket.write(`${sender}: ${message}`);
};

const receiveLeftMessage = (sender, receiver) => {
  const messages = sender.messages.map((message) => `${sender.name}: ${message}`);
  receiver.write(messages.join(''));
}

const onMessage = (message, sender, activeUsers) => {
  if (activeUsers.length === 1) {
    activeUsers[0].messages.push(message);
    return;
  }

  sendMessage(message, sender, [...activeUsers]);
}

const connectUser = (socket, activeUsers) => {
  socket.setEncoding("utf-8");

  socket.write("Enter your name: ");

  socket.once("data", (data) => {
    const name = data.trim();
    socket.write(`Hello ${name}!\n`);
    console.log(`${name} connected`);

    if (activeUsers.length === 1) receiveLeftMessage(...activeUsers, socket);

    activeUsers.push({ name, socket, messages: [] });

    socket.on("data", (data) => onMessage(data, name, activeUsers));
  });

};

module.exports = {
  connectUser,
  sendMessage,
  onMessage
};