// Agent Memory — hash-chained persistent state (PS-SHA-infinity)
const crypto = require("crypto");

class AgentMemory {
  constructor(agentId) {
    this.agentId = agentId;
    this.shortTerm = new Map();
    this.longTerm = [];
    this.chain = [];
  }

  store(key, value, ttl = 0) {
    this.shortTerm.set(key, { value, stored: Date.now(), ttl });
    this._hash("store", key);
  }

  recall(key) {
    const entry = this.shortTerm.get(key);
    if (!entry) return null;
    if (entry.ttl > 0 && Date.now() - entry.stored > entry.ttl) { this.shortTerm.delete(key); return null; }
    return entry.value;
  }

  commit(data) {
    const prev = this.chain.length ? this.chain[this.chain.length - 1].hash : "genesis";
    const hash = crypto.createHash("sha256").update(JSON.stringify(data) + prev + Date.now()).digest("hex");
    this.chain.push({ data, hash, prev, ts: Date.now() });
    this.longTerm.push({ data, hash, ts: Date.now() });
  }

  _hash(action, entity) {
    const prev = this.chain.length ? this.chain[this.chain.length - 1].hash : "genesis";
    const hash = crypto.createHash("sha256").update(action + entity + prev + Date.now()).digest("hex");
    this.chain.push({ action, entity, hash, prev, ts: Date.now() });
  }

  search(q) { return this.longTerm.filter(e => JSON.stringify(e.data).toLowerCase().includes(q.toLowerCase())); }

  stats() {
    return { agentId: this.agentId, shortTermKeys: this.shortTerm.size, longTermEntries: this.longTerm.length,
      chainLength: this.chain.length, lastHash: this.chain.length ? this.chain[this.chain.length - 1].hash.slice(0, 16) : null };
  }
}

module.exports = { AgentMemory };
