#!/usr/bin/env node

// Simple wrapper to run the MCP server
const { spawn } = require('child_process');
const path = require('path');

const serverPath = path.join(__dirname, '..', 'dist', 'scripts', 'puppeteer-mcp-server.js');

console.error('Starting Puppeteer MCP Server from:', serverPath);

// Run the server with proper stdio handling
const server = spawn('node', [serverPath], {
  stdio: 'inherit',
  cwd: path.join(__dirname, '..'),
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

server.on('exit', (code) => {
  process.exit(code || 0);
});

// Handle termination signals
process.on('SIGTERM', () => {
  server.kill('SIGTERM');
});

process.on('SIGINT', () => {
  server.kill('SIGINT');
});
