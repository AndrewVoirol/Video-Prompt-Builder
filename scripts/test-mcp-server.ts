#!/usr/bin/env node
import { spawn } from 'child_process';
import { createReadStream, createWriteStream } from 'fs';

async function testMCPServer() {
  console.log('Starting MCP server test...');
  
  // Start the MCP server
  const server = spawn('node', ['dist/scripts/puppeteer-mcp-server.js'], {
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  // Set up error handling
  server.stderr.on('data', (data) => {
    console.error('Server stderr:', data.toString());
  });

  server.on('error', (error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });

  // Test message to list tools
  const listToolsRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/list',
    params: {},
  };

  // Send request to server
  server.stdin.write(JSON.stringify(listToolsRequest) + '\n');

  // Read response
  server.stdout.on('data', (data) => {
    try {
      const response = JSON.parse(data.toString());
      console.log('Response:', JSON.stringify(response, null, 2));
      
      // Clean up
      server.kill();
      process.exit(0);
    } catch (error) {
      console.error('Failed to parse response:', error);
      console.error('Raw data:', data.toString());
    }
  });

  // Timeout after 5 seconds
  setTimeout(() => {
    console.error('Test timed out');
    server.kill();
    process.exit(1);
  }, 5000);
}

testMCPServer().catch(console.error);
