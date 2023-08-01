const { count } = require("node:console");
const net = require("node:net");
const PORT = 9000;

const onData = (data, user) => {

  user.write(JSON.stringify({
    sender: data,
  }));
};

const display = (data) => {
  const messages = data.messages.join('\n');
  console.log(`${data.sender}: ${messages}`);
};

const main = () => {
  const user = net.createConnection(PORT);

  user.on("connect", () => {
    process.stdin.setEncoding("utf-8");
    user.setEncoding("utf-8");

    process.stdin.on("data", (data) => {
      onData(data.trim(), user);
    });

    user.on("data", (data) => display(JSON.parse(data)));
  });

};

main();
