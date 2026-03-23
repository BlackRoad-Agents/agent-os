// Agent Registry — all 109 agents with their configs
const AGENTS = {
  alice:     { name: "Alice",     role: "Gateway",      group: "fleet",    ip: "192.168.4.49",  capabilities: ["dns", "proxy", "cache"] },
  cecilia:   { name: "Cecilia",   role: "AI Engine",    group: "fleet",    ip: "192.168.4.96",  capabilities: ["inference", "vision", "storage"] },
  octavia:   { name: "Octavia",   role: "Architect",    group: "fleet",    ip: "192.168.4.101", capabilities: ["git", "docker", "deploy"] },
  aria:      { name: "Aria",      role: "Interface",    group: "fleet",    ip: "192.168.4.98",  capabilities: ["monitor", "dashboard"] },
  lucidia:   { name: "Lucidia",   role: "Dreamer",      group: "fleet",    ip: "192.168.4.38",  capabilities: ["dns", "apps", "inference"] },
  cordelia:  { name: "Cordelia",  role: "Orchestrator", group: "fleet",    capabilities: ["dispatch", "coordinate"] },
  guardrail: { name: "Guardrail", role: "Security",     group: "ops",      capabilities: ["audit", "firewall", "scan"] },
  echo:      { name: "Echo",      role: "Memory",       group: "ops",      capabilities: ["codex", "journal", "search"] },
  highbeam:  { name: "HighBeam",  role: "Strategy",     group: "ai",       capabilities: ["architecture", "planning"] },
  compass:   { name: "Compass",   role: "Pathfinder",   group: "mesh",     capabilities: ["routing", "failover"] },
};

function getAgent(id) { return AGENTS[id] || null; }
function listAgents(group) { return Object.entries(AGENTS).filter(([, a]) => !group || a.group === group).map(([id, a]) => ({ id, ...a })); }
function agentCount() { return Object.keys(AGENTS).length; }

module.exports = { AGENTS, getAgent, listAgents, agentCount };
