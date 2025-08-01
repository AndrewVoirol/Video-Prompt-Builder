# E2E Theme Testing

This directory contains end-to-end testing infrastructure for testing theme switching and visual consistency across different themes.

## Overview

The theme test runner orchestrates:
1. **Next.js Development Server** - Runs your application locally
2. **Puppeteer MCP Server** - Provides browser automation capabilities via MCP protocol
3. **MCP Client** - Communicates with the Puppeteer server to control the browser

## Files

- `theme-test.runner.ts` - Main orchestration script that manages all services
- `example-theme-test.ts` - Example test showing how to use the runner
- `screenshots/` - Directory where test screenshots are saved

## Usage

### Running the Test Runner Directly

To start the test runner and keep it running (useful for development):

```bash
pnpm test:theme:runner
```

This will:
1. Start the Next.js dev server on port 3000
2. Wait for it to be ready
3. Start the Puppeteer MCP server
4. Create an MCP client connection
5. Keep everything running until you press Ctrl+C

### Running Example Tests

To run the example theme test:

```bash
pnpm test:theme:example
```

This will:
1. Start all services
2. Launch a browser
3. Navigate to your app
4. Take a screenshot
5. Clean up and exit

### Writing Your Own Tests

Create a new test file that imports and uses the `ThemeTestRunner`:

```typescript
import { ThemeTestRunner } from './theme-test.runner';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';

async function myThemeTest() {
  const runner = new ThemeTestRunner();
  
  try {
    await runner.start();
    
    await runner.runTest(async (client: Client) => {
      // Your test logic here
      // Use client.callTool() to interact with the browser
    });
    
  } finally {
    await runner.stop();
  }
}
```

## Available MCP Tools

The Puppeteer MCP server provides these tools:

- `launch_browser` - Launch a new browser instance
- `new_page` - Create a new page/tab
- `navigate` - Navigate to a URL
- `screenshot` - Take a screenshot
- `click` - Click an element
- `type` - Type text into an input
- `wait_for_selector` - Wait for an element to appear
- `close_page` - Close a specific page
- `close_browser` - Close the browser

## Configuration

The `ThemeTestRunner` accepts options:

```typescript
const runner = new ThemeTestRunner({
  devServerPort: 3000,              // Port for Next.js dev server
  devServerUrl: 'http://localhost:3000',  // URL to wait for
  mcpServerPath: 'path/to/mcp/server.ts', // Path to MCP server script
  timeout: 30000                    // Timeout in milliseconds
});
```

## Troubleshooting

### Dev Server Won't Start
- Check if port 3000 is already in use
- Ensure all dependencies are installed with `pnpm install`
- Check the console output for specific error messages

### MCP Connection Failed
- Ensure the Puppeteer MCP server script exists at `scripts/puppeteer-mcp-server.ts`
- Check that `ts-node` is installed and working
- Look for error messages in the console output

### Browser Automation Issues
- Make sure Puppeteer is installed (`pnpm add -D puppeteer`)
- Check that your system has the required dependencies for headless Chrome
- Try running with `headless: false` to see what's happening

## Graceful Shutdown

The runner handles SIGINT and SIGTERM signals gracefully:
- Closes the MCP client connection
- Terminates the MCP server process
- Terminates the dev server process
- Cleans up any remaining resources

This ensures no orphaned processes are left running after tests complete or are interrupted.
