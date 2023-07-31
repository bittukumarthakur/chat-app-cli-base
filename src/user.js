const net = require("node:net");
const PORT = 8000;

const onData = (data, user) => {
  user.write(data);
};

const display = (data) => {
  console.log(data);
};

const main = () => {
  const user = net.createConnection(PORT);

  user.on("connect", () => {
    process.stdin.setEncoding("utf-8");
    user.setEncoding("utf-8");

    process.stdin.on("data", (data) => {
      onData(data.trim(), user);
    });

    user.on("data", (data) => display(data));
  });

};

main();