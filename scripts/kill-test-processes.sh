#!/bin/bash

echo "Killing test-related processes..."

# Kill any running puppeteer processes
pkill -f "puppeteer" 2>/dev/null && echo "✓ Killed puppeteer processes"

# Kill any ts-node processes running tests
pkill -f "ts-node.*test" 2>/dev/null && echo "✓ Killed ts-node test processes"

# Kill any node processes running MCP server
pkill -f "puppeteer-mcp-server" 2>/dev/null && echo "✓ Killed MCP server processes"

# Kill Chrome/Chromium instances started by Puppeteer
pkill -f "Chrome.*--remote-debugging" 2>/dev/null && echo "✓ Killed Chrome debug instances"
pkill -f "Chromium.*--remote-debugging" 2>/dev/null && echo "✓ Killed Chromium debug instances"

# Check if Next.js dev server should be killed
read -p "Kill Next.js dev server too? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    pkill -f "next dev" 2>/dev/null && echo "✓ Killed Next.js dev server"
fi

echo "Done! All test processes cleaned up."
