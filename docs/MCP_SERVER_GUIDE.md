# MCP Server Guide - Puppeteer Browser Automation

This guide covers the Model Context Protocol (MCP) server implementation for browser automation using Puppeteer, including setup, usage, troubleshooting, and component testing.

## Table of Contents

- [Overview](#overview)
- [Setup and Configuration](#setup-and-configuration)
- [Available Tools](#available-tools)
- [Usage Examples](#usage-examples)
- [Component Testing](#component-testing)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## Overview

The MCP Puppeteer server (`scripts/puppeteer-mcp-server.ts`) provides a comprehensive set of browser automation tools for:

- **Component Testing**: Interactive testing with React state validation
- **UI Automation**: Click, type, hover, and navigation actions
- **Screenshot Capture**: Visual testing and documentation
- **JavaScript Evaluation**: Custom script execution in browser context
- **React DevTools Integration**: Enhanced component debugging

### Architecture

```
MCP Server (stdio) ↔ Warp Terminal ↔ Browser Instances
                                    ↗ Page Management
                                    ↗ Component Testing
                                    ↗ Screenshot Capture
```

## Setup and Configuration

### Prerequisites

- Node.js 20.11.0+
- pnpm package manager
- Puppeteer dependencies installed
- Next.js dev server running (for component testing)

### Starting the MCP Server

**⚠️ Critical**: Always run the MCP server in the background to avoid blocking terminal operations.

```bash
# ✅ Correct: Run in background with output redirection
nohup pnpm exec tsx ./scripts/puppeteer-mcp-server.ts > mcp-server.log 2>&1 &

# ❌ Wrong: Blocks terminal
pnpm exec tsx ./scripts/puppeteer-mcp-server.ts

# ❌ Wrong: Hangs on input
pnpm exec tsx ./scripts/puppeteer-mcp-server.ts &
```

### Verify Server Status

```bash
# Check if server is running
ps aux | grep puppeteer | grep -v grep

# Check server logs
tail -f mcp-server.log

# List background jobs
jobs
```

### Server Configuration

The server uses `StdioServerTransport` for communication with Warp:

```typescript
// Server initialization
const server = new PuppeteerMCPServer();
const transport = new StdioServerTransport();
await server.connect(transport);
```

## Available Tools

### Core Browser Tools

| Tool | Description | Required Parameters |
|------|-------------|-------------------|
| `launch_browser` | Launch Puppeteer browser | `headless?: boolean` |
| `new_page` | Create new browser page/tab | `pageId: string` |
| `navigate` | Navigate to URL | `pageId: string, url: string` |
| `close_page` | Close specific page | `pageId: string` |
| `close_browser` | Close entire browser | None |

### Interaction Tools

| Tool | Description | Required Parameters |
|------|-------------|-------------------|
| `click` | Click element by selector | `pageId: string, selector: string` |
| `type` | Type text into input | `pageId: string, selector: string, text: string` |
| `wait_for_selector` | Wait for element to appear | `pageId: string, selector: string, timeout?: number` |
| `evaluate` | Execute JavaScript | `pageId: string, expression: string` |

### Testing & Capture Tools

| Tool | Description | Required Parameters |
|------|-------------|-------------------|
| `screenshot` | Take page screenshot | `pageId: string, path: string, fullPage?: boolean` |
| `test_component_enhanced` | Enhanced component testing | See [Component Testing](#component-testing) |

## Usage Examples

### Basic Browser Session

```typescript
// 1. Launch browser
await call_mcp_tool("launch_browser", { headless: false });

// 2. Create page
await call_mcp_tool("new_page", { pageId: "main-page" });

// 3. Navigate
await call_mcp_tool("navigate", { 
  pageId: "main-page", 
  url: "http://localhost:3000" 
});

// 4. Take screenshot
await call_mcp_tool("screenshot", { 
  pageId: "main-page", 
  path: "homepage.png",
  fullPage: true 
});

// 5. Cleanup
await call_mcp_tool("close_browser", {});
```

### Element Interaction

```typescript
// Wait for element to load
await call_mcp_tool("wait_for_selector", {
  pageId: "main-page",
  selector: "#my-button"
});

// Click element
await call_mcp_tool("click", {
  pageId: "main-page",
  selector: "#my-button"
});

// Type in input field
await call_mcp_tool("type", {
  pageId: "main-page",
  selector: "input[name='email']",
  text: "test@example.com"
});
```

### JavaScript Evaluation

```typescript
// Get page title
await call_mcp_tool("evaluate", {
  pageId: "main-page",
  expression: "document.title"
});

// Check element properties
await call_mcp_tool("evaluate", {
  pageId: "main-page",
  expression: `
    (() => {
      const element = document.querySelector('#my-component');
      return {
        visible: element?.offsetParent !== null,
        text: element?.textContent,
        className: element?.className
      };
    })()
  `
});
```

## Component Testing

### Enhanced Component Testing Tool

The `test_component_enhanced` tool provides comprehensive React component testing:

```typescript
await call_mcp_tool("test_component_enhanced", {
  pageId: "test-page",
  selector: "#demo-kibo-button",
  interactions: [
    { type: "click", target: "button[aria-label='copy']" },
    { type: "hover", target: ".language-selector" },
    { type: "input", target: "select", value: "javascript" }
  ],
  screenshots: true,
  captureState: true,
  enableDevTools: false
});
```

#### Parameters

- **`selector`**: CSS selector for target component
- **`interactions`**: Array of user interactions to perform
- **`screenshots`**: Whether to capture visual evidence
- **`captureState`**: Whether to capture React component state
- **`enableDevTools`**: Whether to inject React DevTools

#### Interaction Types

```typescript
interface Interaction {
  type: 'click' | 'hover' | 'input';
  target: string;  // CSS selector
  value?: string;  // For input type only
}
```

### Component Testing Workflow

1. **Setup**: Launch browser and navigate to test page
2. **Wait**: Ensure component is loaded
3. **Test**: Execute enhanced component test
4. **Verify**: Check results and screenshots
5. **Cleanup**: Close browser resources

```typescript
// Complete component testing workflow
async function testCodeViewerComponent() {
  // 1. Setup
  await call_mcp_tool("launch_browser", { headless: false });
  await call_mcp_tool("new_page", { pageId: "test-page" });
  await call_mcp_tool("navigate", { 
    pageId: "test-page", 
    url: "http://localhost:3000/theme-test" 
  });
  
  // 2. Wait for component
  await call_mcp_tool("wait_for_selector", {
    pageId: "test-page",
    selector: "#demo-kibo-button"
  });
  
  // 3. Test component interactions
  const results = await call_mcp_tool("test_component_enhanced", {
    pageId: "test-page",
    selector: "#demo-kibo-button",
    interactions: [
      { type: "click", target: "button:has(svg)" }, // Copy button
      { type: "click", target: "select" },          // Language selector
      { type: "hover", target: ".code-header" }     // Header hover
    ],
    screenshots: true,
    captureState: true
  });
  
  // 4. Cleanup
  await call_mcp_tool("close_browser", {});
  
  return results;
}
```

## Troubleshooting

### Common Issues and Solutions

#### 1. "sending into a closed channel" Error

**Cause**: MCP server not running or improperly started
```bash
# ❌ Problem: Server not in background
pnpm exec tsx ./scripts/puppeteer-mcp-server.ts

# ✅ Solution: Use nohup with output redirection
nohup pnpm exec tsx ./scripts/puppeteer-mcp-server.ts > mcp-server.log 2>&1 &
```

#### 2. "MCP server tool not found" Error

**Cause**: Server connection or tool name issues
```bash
# Check server status
ps aux | grep puppeteer

# Restart server if needed
kill $(ps aux | grep puppeteer | awk '{print $2}')
nohup pnpm exec tsx ./scripts/puppeteer-mcp-server.ts > mcp-server.log 2>&1 &
```

#### 3. "Page not found" Error

**Cause**: Invalid pageId or page already closed
```typescript
// ❌ Problem: Using non-existent pageId
await call_mcp_tool("click", { pageId: "invalid-page", selector: "#btn" });

// ✅ Solution: Ensure page exists
await call_mcp_tool("new_page", { pageId: "my-page" });
await call_mcp_tool("click", { pageId: "my-page", selector: "#btn" });
```

#### 4. Selector Timeout Errors

**Cause**: Element not found or slow loading
```typescript
// ❌ Problem: Short timeout
await call_mcp_tool("wait_for_selector", {
  pageId: "test-page",
  selector: "#slow-component",
  timeout: 1000
});

// ✅ Solution: Increase timeout and check selector
await call_mcp_tool("wait_for_selector", {
  pageId: "test-page",
  selector: "#slow-component",
  timeout: 10000
});
```

### Debugging Commands

```bash
# Check MCP server logs
tail -f mcp-server.log

# Verify server process
ps aux | grep puppeteer | grep -v grep

# Kill stuck processes
pkill -f puppeteer-mcp-server

# Check port availability (if using custom ports)
lsof -i :3000

# Verify Next.js dev server
curl -s http://localhost:3000 | head -5
```

### Console Error Monitoring

```typescript
// Monitor browser console during testing
await call_mcp_tool("evaluate", {
  pageId: "test-page",
  expression: `
    (() => {
      const errors = [];
      const originalError = console.error;
      console.error = function(...args) {
        errors.push(args.join(' '));
        originalError.apply(console, args);
      };
      
      // Restore after 5 seconds
      setTimeout(() => console.error = originalError, 5000);
      
      return 'Console monitoring started';
    })()
  `
});
```

## Best Practices

### 1. Resource Management

```typescript
// ✅ Always clean up resources
try {
  await call_mcp_tool("launch_browser", { headless: false });
  await call_mcp_tool("new_page", { pageId: "test" });
  // ... test operations
} finally {
  await call_mcp_tool("close_browser", {});
}
```

### 2. Error Handling

```typescript
// ✅ Handle expected failures gracefully
try {
  await call_mcp_tool("wait_for_selector", {
    pageId: "test",
    selector: "#optional-element",
    timeout: 5000
  });
} catch (error) {
  console.log("Optional element not found, continuing...");
}
```

### 3. Selector Best Practices

```typescript
// ✅ Use stable, semantic selectors
const selectors = {
  good: [
    "#unique-id",
    "[data-testid='component-name']",
    "[aria-label='copy button']"
  ],
  avoid: [
    ".css-generated-class",
    "div:nth-child(3)",
    ".dynamic-class-name"
  ]
};
```

### 4. Performance Optimization

```typescript
// ✅ Use appropriate headless settings
await call_mcp_tool("launch_browser", { 
  headless: true  // For CI/automated testing
});

await call_mcp_tool("launch_browser", { 
  headless: false // For debugging/development
});
```

### 5. Screenshot Organization

```typescript
// ✅ Use descriptive, timestamped filenames
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
await call_mcp_tool("screenshot", {
  pageId: "test",
  path: `screenshots/component-test-${timestamp}.png`,
  fullPage: false
});
```

## Integration with Development Workflow

### Pre-commit Testing

```bash
#!/bin/bash
# scripts/test-components.sh
set -e

echo "Starting MCP server..."
nohup pnpm exec tsx ./scripts/puppeteer-mcp-server.ts > mcp-server.log 2>&1 &
MCP_PID=$!

echo "Starting dev server..."
pnpm dev > dev-server.log 2>&1 &
DEV_PID=$!

sleep 5  # Wait for servers to start

echo "Running component tests..."
# Your component tests here

echo "Cleaning up..."
kill $MCP_PID $DEV_PID
```

### CI/CD Integration

```yaml
# .github/workflows/component-tests.yml
name: Component Tests
on: [push, pull_request]

jobs:
  test-components:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with: 
          node-version: '20'
      
      - run: pnpm install
      - run: pnpm build
      
      - name: Run Component Tests
        run: |
          nohup pnpm exec tsx ./scripts/puppeteer-mcp-server.ts > mcp.log 2>&1 &
          pnpm dev > dev.log 2>&1 &
          sleep 10
          # Run your MCP-based tests here
          pkill -f puppeteer-mcp-server
```

This comprehensive MCP server guide provides everything needed to effectively use browser automation for component testing and development workflows.
