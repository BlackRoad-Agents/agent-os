#!/bin/bash
# Boot the Agent OS
set -e
echo "Booting BlackRoad Agent OS..."
cd "$(dirname "$0")/.."
node -e "
const { Kernel } = require('./core/kernel');
const { AgentSpawner } = require('./agents/spawner');
const k = new Kernel().boot();
const s = new AgentSpawner(k);
console.log('Kernel booted:', k.stats());
console.log('Registry loaded');
"
echo "Agent OS ready."
