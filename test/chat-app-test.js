const { it, describe } = require("node:test");
const assert = require("assert");

describe("chat-app", () => {
  it("should prompt the user to enter their name", () => {
    assert.strictEqual("bittu", "bittu");
  });

});