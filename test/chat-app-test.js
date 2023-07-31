const { it, describe } = require("node:test");
const assert = require("assert");
const { connectUser, sendMessage } = require("../src/chat-app");

describe("connectUser", () => {
  it("should prompt the user to enter their name", (context) => {
    const setEncoding = context.mock.fn();
    const write = context.mock.fn();
    const on = context.mock.fn();
    const once = context.mock.fn((_, callback) => {
      callback("bittu\n");
    });
    const socket = { setEncoding, write, once, on };

    connectUser(socket, []);
    const encoding = setEncoding.mock.calls[0].arguments[0];
    const greeting = write.mock.calls[1].arguments[0];

    assert.strictEqual(encoding, "utf-8");
    assert.strictEqual(greeting, "Hello bittu!\n");
  });
});

describe("sendMessage", () => {
  it("should send message to the other user", (context) => {
    const write = context.mock.fn();

    const bittu = { name: "bittu", socket: { write } };
    const swagato = { name: "swagato", socket: { write } };

    const users = [bittu, swagato];
    const message = "what's up";

    sendMessage(message, "bittu", users);
    const sentMsg = swagato.socket.write.mock.calls[0].arguments[0];
    assert.strictEqual(sentMsg, "what's up");
  });
});