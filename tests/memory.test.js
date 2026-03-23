// Memory unit tests
const { AgentMemory } = require("../core/memory");
const assert = require("assert");

const m = new AgentMemory("test-agent");
m.store("key1", "value1");
assert(m.recall("key1") === "value1", "should recall stored value");
m.commit({ action: "test", data: "hello" });
assert(m.stats().chainLength > 0, "chain should have entries");
assert(m.stats().longTermEntries === 1, "should have 1 long-term entry");
const results = m.search("hello");
assert(results.length === 1, "should find committed data");
console.log("All memory tests passed.");
