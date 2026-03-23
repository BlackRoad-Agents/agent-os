// Agent Spawner — create agent processes from registry definitions
const { Kernel } = require("../core/kernel");
const { AgentMemory } = require("../core/memory");
const { AGENTS } = require("./registry");

class AgentSpawner {
  constructor(kernel) { this.kernel = kernel; this.instances = new Map(); }

  spawn(agentId, handler) {
    const def = AGENTS[agentId];
    if (!def) throw new Error("Unknown agent: " + agentId);
    const memory = new AgentMemory(agentId);
    const proc = this.kernel.spawn(def.name, async (msg, proc) => {
      proc.memory.set("lastMessage", msg);
      return handler(msg, { agent: def, memory, proc });
    }, { capabilities: def.capabilities });
    this.instances.set(agentId, { proc, memory, def });
    return { pid: proc.pid, agent: def.name };
  }

  despawn(agentId) {
    const inst = this.instances.get(agentId);
    if (inst) { this.kernel.kill(inst.proc.pid); this.instances.delete(agentId); }
  }

  getState(agentId) {
    const inst = this.instances.get(agentId);
    if (!inst) return null;
    return { agent: inst.def, memory: inst.memory.stats(), process: { pid: inst.proc.pid, status: inst.proc.status, restarts: inst.proc.restarts } };
  }

  listRunning() { return [...this.instances.entries()].map(([id, inst]) => ({ id, name: inst.def.name, status: inst.proc.status })); }
}

module.exports = { AgentSpawner };
