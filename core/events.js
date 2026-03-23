// Event Bus — pub/sub for inter-agent communication
class EventBus {
  constructor() { this.topics = new Map(); this.history = []; this.deadLetters = []; }

  subscribe(topic, handler) {
    const subs = this.topics.get(topic) || [];
    subs.push(handler);
    this.topics.set(topic, subs);
  }

  publish(topic, event) {
    const subs = this.topics.get(topic) || [];
    this.history.push({ topic, event, ts: Date.now(), delivered: subs.length });
    if (subs.length === 0) { this.deadLetters.push({ topic, event, ts: Date.now() }); return 0; }
    subs.forEach(fn => { try { fn(event); } catch {} });
    return subs.length;
  }

  stats() {
    return { topics: this.topics.size, totalSubscribers: [...this.topics.values()].reduce((a, s) => a + s.length, 0),
      historySize: this.history.length, deadLetters: this.deadLetters.length };
  }
}

module.exports = { EventBus };
