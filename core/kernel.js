// BlackRoad Agent OS Kernel
// Process spawning, supervision trees, message passing

class Kernel {
  constructor() {
    this.processes = new Map();
    this.supervisors = new Map();
    this.pidCounter = 0;
    this.bootTime = Date.now();
    this.running = false;
  }

  boot() {
    this.running = true;
    this.scheduler = new Scheduler(this);
    this.scheduler.start();
    return this;
  }

  spawn(name, fn, opts = {}) {
    const pid = ++this.pidCounter;
    const proc = new AgentProcess(pid, name, fn, opts);
    this.processes.set(pid, proc);
    if (opts.supervisor) {
      const sup = this.supervisors.get(opts.supervisor) || [];
      sup.push(pid);
      this.supervisors.set(opts.supervisor, sup);
    }
    proc.start();
    return proc;
  }

  kill(pid) {
    const proc = this.processes.get(pid);
    if (proc) { proc.stop(); this.processes.delete(pid); }
  }

  send(pid, message) {
    const proc = this.processes.get(pid);
    if (proc) proc.mailbox.push(message);
  }

  stats() {
    return {
      processes: this.processes.size,
      running: this.running,
      uptime: Date.now() - this.bootTime,
      byStatus: [...this.processes.values()].reduce((acc, p) => {
        acc[p.status] = (acc[p.status] || 0) + 1; return acc;
      }, {}),
    };
  }
}

class AgentProcess {
  constructor(pid, name, fn, opts) {
    this.pid = pid;
    this.name = name;
    this.fn = fn;
    this.status = "idle";
    this.mailbox = [];
    this.memory = new Map();
    this.capabilities = opts.capabilities || [];
    this.restarts = 0;
    this.maxRestarts = opts.maxRestarts || 5;
  }

  start() { this.status = "running"; }
  stop() { this.status = "stopped"; }

  async tick() {
    if (this.mailbox.length > 0) {
      const msg = this.mailbox.shift();
      try { await this.fn(msg, this); }
      catch (e) {
        this.status = "crashed";
        if (this.restarts < this.maxRestarts) { this.restarts++; this.status = "running"; }
      }
    }
  }
}

class Scheduler {
  constructor(kernel) { this.kernel = kernel; this.interval = null; this.tickRate = 100; }
  start() { this.interval = setInterval(() => this.tick(), this.tickRate); }
  async tick() {
    for (const [, proc] of this.kernel.processes) {
      if (proc.status === "running") await proc.tick();
    }
  }
  stop() { clearInterval(this.interval); }
}

module.exports = { Kernel, AgentProcess, Scheduler };
