// NLP unit tests
const { parseIntent, dispatch } = require("../services/nlp");
const assert = require("assert");

assert(dispatch("check the firewall") === "guardrail", "security → guardrail");
assert(dispatch("deploy the app") === "oneway", "deploy → oneway");
assert(dispatch("hello there") === "hestia", "greet → hestia");
assert(dispatch("check dns records") === "pitstop", "dns → pitstop");
assert(dispatch("random chat message") === "road", "default → road");
const { entities } = parseIntent("scan 192.168.4.49 port 22");
assert(entities.ip === "192.168.4.49", "should extract IP");
console.log("All NLP tests passed.");
