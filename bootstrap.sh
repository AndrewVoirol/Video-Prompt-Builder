#!/bin/bash
set -e
echo "🛠️ Installing dependencies..."
pnpm install
echo "🔎 Validating config files..."
pnpm exec ts-node tools/validate-configs.ts
echo "🌱 Seeding prompt configs from intents..."
pnpm exec ts-node tools/seed-prompts.ts
echo "🚀 Launching playground at http://localhost:3000 ..."
pnpm dev
