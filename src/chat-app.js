const sendMessage = (message, sender, users) => {
  const receiver = users.find(({ name }) => sender !== name);
  receiver.socket.write(message);
};

// const activeUsers = [];

const connectUser = (socket, activeUsers) => {
  socket.setEncoding("utf-8");

  socket.write("Enter your name: ");
  socket.once("data", (data) => {
    const name = data.trim();
    socket.write(`Hello ${name}!\n`);
    activeUsers.push({ name, socket });

    socket.on("data", (data) => sendMessage(data, name, [...activeUsers]));
  });

};

module.exports = {
  connectUser,
  sendMessage
};