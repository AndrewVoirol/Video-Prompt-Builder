# Web Browsing with MCP

This guide covers how to use the Puppeteer MCP server for web browsing automation, particularly for finding and extracting code components from documentation sites like Kibo-UI.

## Prerequisites

- Node.js 20+ and pnpm installed
- MCP server configured in `warp-mcp-config.json`
- react-syntax-highlighter and @types/react-syntax-highlighter packages

## Server Management

### Starting the MCP Server

The MCP puppeteer server runs directly from TypeScript without compilation:

```bash
# Direct execution (recommended for development)
pnpm exec tsx ./scripts/puppeteer-mcp-server.ts

# Or using npm script (if configured)
pnpm run mcp:server
```

### Verifying Server Status

Look for this confirmation message:
```
Puppeteer MCP server running...
```

### Stopping the Server

```bash
# Find and kill the process
pkill -f "puppeteer-mcp-server"

# Or use Ctrl+C if running in foreground
```

### Warp Integration

If you have Warp configured with the MCP server, you can use:
```bash
warp mcp start puppeteer-automation
warp mcp stop puppeteer-automation
```

## Component Discovery Workflow

### 1. Launch Browser and Navigate

```json
// Step 1: Launch browser
{
  "tool": "launch_browser",
  "arguments": { "headless": true }
}

// Step 2: Create a new page
{
  "tool": "new_page",
  "arguments": { "pageId": "kibo-search" }
}

// Step 3: Navigate to component library
{
  "tool": "navigate",
  "arguments": {
    "pageId": "kibo-search",
    "url": "https://www.kibo-ui.com/components"
  }
}
```

### 2. Extract Component Links

```json
// Search for component links
{
  "tool": "evaluate",
  "arguments": {
    "pageId": "kibo-search",
    "expression": "Array.from(document.querySelectorAll('a[href*="/components/"]')).map(a => ({ name: a.textContent.trim(), href: a.href }))"
  }
}
```

### 3. Navigate to Specific Component

```json
// Navigate to a specific component page
{
  "tool": "navigate",
  "arguments": {
    "pageId": "kibo-search",
    "url": "https://www.kibo-ui.com/components/code-block"
  }
}
```

### 4. Extract Code Examples

```json
// Extract code from syntax-highlighted blocks
{
  "tool": "evaluate",
  "arguments": {
    "pageId": "kibo-search",
    "expression": "Array.from(document.querySelectorAll('pre code, .highlight code')).map(code => ({ language: code.className.match(/language-(\w+)/)?.[1] || 'unknown', content: code.textContent }))"
  }
}
```

## Saving Code Snippets and Screenshots

### Code Snippet Extraction

#### Using Terminal Commands
```bash
# Search for components in current project
grep -r "CodeViewer" ./components --include="*.tsx" --include="*.ts"

# Extract specific component from Kibo-UI documentation
curl -s "https://www.kibo-ui.com/components/code-block" | grep -o 'href="/components/[^"]*"' | sort -u

# Save component list to file
curl -s "https://www.kibo-ui.com/components" | grep -o 'href="/components/[^"]*"' | sed 's/href="//g' | sed 's/"//g' | sort -u > kibo-components.txt
```

#### Using MCP Evaluate Tool
```json
// Extract and save code from a component page
{
  "tool": "evaluate",
  "arguments": {
    "pageId": "kibo-search",
    "expression": "document.querySelector('table.highlight')?.innerText || document.querySelector('pre code')?.textContent"
  }
}
```

### Screenshot Capture

```json
// Take a screenshot of the current page
{
  "tool": "screenshot",
  "arguments": {
    "pageId": "kibo-search",
    "path": "./screenshots/kibo-code-block.png",
    "fullPage": true
  }
}

// Take a screenshot of a specific component
{
  "tool": "screenshot",
  "arguments": {
    "pageId": "kibo-search",
    "path": "./screenshots/component-demo.png",
    "fullPage": false
  }
}
```

### Enhanced Component Testing

```json
// Test component with React state validation
{
  "tool": "test_component_enhanced",
  "arguments": {
    "pageId": "local",
    "selector": "#demo-kibo-button",
    "interactions": [
      { "type": "click", "target": "#demo-kibo-button" },
      { "type": "hover", "target": ".copy-button" }
    ],
    "screenshots": true,
    "captureState": true,
    "enableDevTools": true
  }
}
```

## File Organization

### Directory Structure
```
project/
├── components/
│   └── CodeViewer.tsx          # Custom code viewer component
├── screenshots/                # Generated screenshots
├── docs/
│   └── kibo-ui-components.md   # Component documentation
└── scripts/
    └── puppeteer-mcp-server.ts # MCP server
```

### Saving Extracted Components

Create a markdown file to catalog discovered components:

```bash
# Create components catalog
cat > docs/kibo-ui-components.md << 'EOF'
# Kibo-UI Component Library

Successfully located components from https://www.kibo-ui.com/components/

## AI Chatbot Components
- `/components/ai-branch` - AI Branch
- `/components/ai-conversation` - AI Conversation
...
EOF
```

## Troubleshooting

### MCP Connection Issues

```bash
# Check if MCP server is running
lsof -i :3000  # or appropriate port

# Restart MCP server
pkill -f "puppeteer-mcp-server" && pnpm exec tsx ./scripts/puppeteer-mcp-server.ts
```

### Browser Debugging

```json
// Launch browser in non-headless mode for debugging
{
  "tool": "launch_browser",
  "arguments": { "headless": false }
}
```

### Common Error Solutions

1. **"sending into a closed channel"**
   - Restart the MCP server
   - Check Warp MCP configuration
   - Verify network connectivity

2. **Page not found (404)**
   - Verify the URL is correct
   - Check if the site requires authentication
   - Try with different user-agent headers

3. **Screenshot failures**
   - Ensure screenshots directory exists: `mkdir -p screenshots`
   - Check file permissions
   - Verify page has loaded completely

4. **Component extraction issues**
   - Use browser developer tools to identify correct selectors
   - Wait for dynamic content to load
   - Check for CORS restrictions

### Debug Mode Setup

```json
// Enable comprehensive debugging
{
  "tool": "launch_browser",
  "arguments": {
    "headless": false,
    "devtools": true,
    "slowMo": 250
  }
}
```

### Performance Tips

- Use `headless: true` for production automation
- Implement proper wait strategies for dynamic content
- Close unused pages to free memory
- Use specific selectors for faster element location

## Integration with Development Workflow

### Local Development Server

Ensure your Next.js dev server is running:

```bash
pnpm dev  # Starts on http://localhost:3000
```

### Testing Custom Components

Navigate to your test pages:

```json
{
  "tool": "navigate",
  "arguments": {
    "pageId": "local",
    "url": "http://localhost:3000/theme-test"
  }
}
```

### Theme Testing

Test components across different themes:

```json
// Click theme selector
{
  "tool": "click",
  "arguments": {
    "pageId": "local",
    "selector": "[data-theme-toggle]"
  }
}

// Take screenshot after theme change
{
  "tool": "screenshot",
  "arguments": {
    "pageId": "local",
    "path": "./screenshots/dark-theme.png",
    "fullPage": true
  }
}
```
