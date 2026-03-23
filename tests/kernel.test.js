// Kernel unit tests
const { Kernel } = require("../core/kernel");
const assert = require("assert");

const k = new Kernel().boot();
assert(k.running, "kernel should be running");

const p = k.spawn("test", async (msg, proc) => { proc.memory.set("got", msg); });
assert(p.pid === 1, "first pid should be 1");
assert(k.stats().processes === 1, "should have 1 process");

k.send(p.pid, "hello");
setTimeout(() => {
  k.kill(p.pid);
  assert(k.stats().processes === 0, "should have 0 after kill");
  k.scheduler.stop();
  console.log("All kernel tests passed.");
}, 200);
