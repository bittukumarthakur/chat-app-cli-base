const connectUser = (socket) => {
  socket.setEncoding("utf-8");

  socket.write("Enter your name: ");
  socket.once("data", (data) => {
    const name = data.trim();
    socket.write(`Hello ${name}!\n`);
  });
};

module.exports = {
  connectUser
}