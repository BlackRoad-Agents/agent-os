// NLP Intent Parser — 25 patterns, entity extraction
const INTENTS = {
  greet:    { patterns: [/^(hi|hello|hey|sup|yo)/i], agent: "hestia" },
  status:   { patterns: [/\b(status|health|alive|running)\b/i], agent: "alice" },
  security: { patterns: [/\b(secure|vuln|firewall|audit)\b/i], agent: "guardrail" },
  dns:      { patterns: [/\b(dns|domain|resolve|pihole)\b/i], agent: "pitstop" },
  deploy:   { patterns: [/\b(deploy|push|ship|release)\b/i], agent: "oneway" },
  git:      { patterns: [/\b(git|repo|commit|branch)\b/i], agent: "octavia" },
  ai:       { patterns: [/\b(ai|model|inference|ollama)\b/i], agent: "gematria" },
  search:   { patterns: [/\b(search|find|look.?up)\b/i], agent: "roadsearch" },
  monitor:  { patterns: [/\b(monitor|log|metric|alert)\b/i], agent: "prism" },
  network:  { patterns: [/\b(network|ip|port|ssh|vpn)\b/i], agent: "tollbooth" },
};

function parseIntent(message) {
  const intents = [];
  for (const [name, { patterns, agent }] of Object.entries(INTENTS)) {
    if (patterns.some(p => p.test(message))) intents.push({ intent: name, agent });
  }
  const entities = {};
  const ip = message.match(/\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/);
  if (ip) entities.ip = ip[1];
  const mention = message.match(/@(\w+)/);
  if (mention) entities.mention = mention[1].toLowerCase();
  return { intents: intents.length ? intents : [{ intent: "chat", agent: "road" }], entities };
}

function dispatch(message) {
  const { intents } = parseIntent(message);
  return intents[0].agent;
}

module.exports = { parseIntent, dispatch, INTENTS };
