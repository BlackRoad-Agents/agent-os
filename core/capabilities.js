// Capability system — what each agent is allowed to do
class CapabilityManager {
  constructor() { this.agents = new Map(); this.definitions = new Map(); this.auditLog = []; }

  define(name, desc) { this.definitions.set(name, { name, desc, created: Date.now() }); }

  grant(agentId, capability) {
    const caps = this.agents.get(agentId) || new Set();
    caps.add(capability);
    this.agents.set(agentId, caps);
    this.auditLog.push({ action: "grant", agentId, capability, ts: Date.now() });
  }

  revoke(agentId, capability) {
    const caps = this.agents.get(agentId);
    if (caps) { caps.delete(capability); this.auditLog.push({ action: "revoke", agentId, capability, ts: Date.now() }); }
  }

  check(agentId, capability) { return (this.agents.get(agentId) || new Set()).has(capability); }

  listAll() { return { totalAgents: this.agents.size, totalDefinitions: this.definitions.size, auditLogSize: this.auditLog.length }; }
}

module.exports = { CapabilityManager };
