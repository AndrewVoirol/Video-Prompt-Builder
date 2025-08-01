# Warp MCP Integration Setup Guide

This guide walks you through setting up the Puppeteer MCP server for use with Warp's AI agents.

## Prerequisites

1. Warp terminal installed and configured
2. Node.js 20.11.0+ installed
3. pnpm package manager

## Installation Steps

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Build the MCP Server

```bash
pnpm mcp:build
```

This compiles the TypeScript MCP server to JavaScript in the `dist/scripts` directory.

### 3. Add MCP Server to Warp

1. Open Warp
2. Navigate to MCP Server settings using one of these methods:
   - From Warp Drive: Personal > MCP Servers
   - From Command Palette: Search for "Open MCP Servers"
   - From Settings: Settings > AI > Manage MCP servers

3. Click the **+ Add** button
4. Choose **CLI Server (Command)**
5. Copy and paste this configuration:

```json
{
  "mcpServers": {
    "puppeteer-automation": {
      "command": "node",
      "args": ["./dist/scripts/puppeteer-mcp-server.js"],
      "working_directory": "/Users/andrewvoirol/Dev/DevProjects/Video-Prompt-Builder",
      "env": {}
    }
  }
}
```

**Important**: Update the `working_directory` path to match your actual project location.

### 4. Start the MCP Server

Click the **Start** button next to your newly added server in the MCP servers page.

## Available Tools

Once the server is running, the following tools will be available to Warp's AI agents:

### Browser Management
- `launch_browser` - Launch a new browser instance (headless or visible)
- `close_browser` - Close the browser and all pages

### Page Management
- `new_page` - Create a new page/tab with a unique ID
- `close_page` - Close a specific page

### Navigation & Interaction
- `navigate` - Navigate to a URL
- `click` - Click an element by CSS selector
- `type` - Type text into an input field

### Testing & Validation
- `screenshot` - Take a screenshot (saved as PNG)
- `wait_for_selector` - Wait for an element to appear

## Usage Examples

When using Warp AI agents, you can now request browser automation tasks:

```
"Take a screenshot of the homepage"
"Navigate to the theme test page and click the dark mode toggle"
"Fill out the form with test data and submit"
```

## Testing the Setup

To verify the MCP server is working correctly:

```bash
pnpm mcp:test
```

This runs a basic test to ensure the server can start and respond to requests.

## Troubleshooting

### Server won't start
- Ensure you've run `pnpm mcp:build` first
- Check that the working directory path is correct
- Verify Node.js is installed and accessible

### Tools not available
- Make sure the server shows as "Running" in Warp's MCP servers page
- Try stopping and restarting the server
- Check the logs by clicking "View Logs" on the server

### Screenshot paths
- Screenshots are saved relative to the working directory
- Ensure the directory exists before taking screenshots
- All screenshots must use the `.png` extension

## Security Notes

- The browser runs in headless mode by default for security
- Be cautious when navigating to untrusted URLs
- Console logs from web pages are forwarded to the MCP server logs

## Development

To modify the MCP server:

1. Edit `scripts/puppeteer-mcp-server.ts`
2. Rebuild with `pnpm mcp:build`
3. Restart the server in Warp

For development, you can run the TypeScript version directly:
```bash
pnpm mcp:server
```

## Additional Resources

- [Warp MCP Documentation](https://docs.warp.dev/knowledge-and-collaboration/mcp)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [Puppeteer Documentation](https://pptr.dev/)
