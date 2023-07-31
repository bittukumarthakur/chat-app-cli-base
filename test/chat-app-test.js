const { it, describe } = require("node:test");
const assert = require("assert");
const { connectUser } = require("../src/chat-app");

describe("chat-app", () => {
  it("should prompt the user to enter their name", (context) => {
    const setEncoding = context.mock.fn();
    const write = context.mock.fn();
    const once = context.mock.fn();
    const socket = { setEncoding, write, once };

    connectUser(socket);
    const encoding = setEncoding.mock.calls[0].arguments[0];

    assert.strictEqual(encoding, "utf-8");
  });

});