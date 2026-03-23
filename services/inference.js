// Inference Router — Ollama with fallback chain
const ENDPOINTS = [
  "http://localhost:11434",
  "http://192.168.4.38:11434",
  "http://192.168.4.101:11434",
];

async function infer(model, messages, opts = {}) {
  for (const endpoint of ENDPOINTS) {
    try {
      const res = await fetch(endpoint + "/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, messages, stream: false, options: { num_predict: opts.maxTokens || 60, temperature: opts.temperature || 0.7 } }),
        signal: AbortSignal.timeout(opts.timeout || 30000),
      });
      const data = await res.json();
      if (data.message?.content) return { text: data.message.content, endpoint, model };
    } catch {}
  }
  return { text: "(all endpoints offline)", endpoint: null, model };
}

async function* stream(model, messages) {
  for (const endpoint of ENDPOINTS) {
    try {
      const res = await fetch(endpoint + "/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, messages, stream: true }),
        signal: AbortSignal.timeout(60000),
      });
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split("\n"); buf = lines.pop();
        for (const line of lines) {
          if (!line.trim()) continue;
          try { const d = JSON.parse(line); if (d.message?.content) yield d.message.content; } catch {}
        }
      }
      return;
    } catch {}
  }
  yield "(offline)";
}

module.exports = { infer, stream, ENDPOINTS };
