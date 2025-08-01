#!/usr/bin/env ts-node
import { spawn } from 'cross-spawn';
import { ChildProcess } from 'child_process';
import waitOn from 'wait-on';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import path from 'path';

interface TestRunnerOptions {
  devServerPort?: number;
  devServerUrl?: string;
  mcpServerPath?: string;
  timeout?: number;
}

class ThemeTestRunner {
  private devServer: ChildProcess | null = null;
  private mcpServer: ChildProcess | null = null;
  private mcpClient: Client | null = null;
  private isShuttingDown = false;

  constructor(private options: TestRunnerOptions = {}) {
    this.options = {
      devServerPort: 3000,
      devServerUrl: 'http://localhost:3000',
      mcpServerPath: path.join(process.cwd(), 'dist', 'scripts', 'puppeteer-mcp-server.js'),
      timeout: 30000,
      ...options
    };

    // Set up graceful shutdown handlers
    this.setupShutdownHandlers();
  }

  private setupShutdownHandlers() {
    const shutdown = async (signal: string) => {
      if (this.isShuttingDown) return;
      
      console.log(`\n${signal} received, shutting down gracefully...`);
      this.isShuttingDown = true;
      
      await this.cleanup();
      process.exit(0);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('uncaughtException', async (error) => {
      console.error('Uncaught exception:', error);
      await this.cleanup();
      process.exit(1);
    });
    process.on('unhandledRejection', async (reason, promise) => {
      console.error('Unhandled rejection at:', promise, 'reason:', reason);
      await this.cleanup();
      process.exit(1);
    });
  }

  private async cleanup() {
    console.log('Cleaning up resources...');
    
    // Close MCP client
    if (this.mcpClient) {
      try {
        await this.mcpClient.close();
        console.log('MCP client closed');
      } catch (error) {
        console.error('Error closing MCP client:', error);
      }
    }

    // Kill MCP server
    if (this.mcpServer && !this.mcpServer.killed) {
      try {
        this.mcpServer.kill('SIGTERM');
        console.log('MCP server terminated');
      } catch (error) {
        console.error('Error killing MCP server:', error);
      }
    }

    // Kill dev server
    if (this.devServer && !this.devServer.killed) {
      try {
        this.devServer.kill('SIGTERM');
        console.log('Dev server terminated');
      } catch (error) {
        console.error('Error killing dev server:', error);
      }
    }
  }

  private async startDevServer(): Promise<void> {
    console.log('Starting Next.js development server...');
    
    this.devServer = spawn('pnpm', ['dev'], {
      stdio: 'inherit',
      shell: true,
      env: {
        ...process.env,
        PORT: String(this.options.devServerPort)
      }
    });

    this.devServer.on('error', (error: Error) => {
      console.error('Dev server error:', error);
      throw error;
    });

    this.devServer.on('exit', (code: number | null, signal: NodeJS.Signals | null) => {
      if (!this.isShuttingDown) {
        console.error(`Dev server exited unexpectedly with code ${code} and signal ${signal}`);
      }
    });

    // Wait for the dev server to be ready
    console.log(`Waiting for dev server at ${this.options.devServerUrl}...`);
    
    try {
      await waitOn({
        resources: [this.options.devServerUrl!],
        timeout: this.options.timeout,
        delay: 1000,
        interval: 1000,
        simultaneous: 1,
        validateStatus: (status) => status >= 200 && status < 300
      });
      
      console.log('Dev server is ready!');
    } catch (error) {
      console.error('Dev server failed to start:', error);
      throw error;
    }
  }

  private async startMCPServer(): Promise<void> {
    console.log('Starting Puppeteer MCP server...');
    
    this.mcpServer = spawn('node', [this.options.mcpServerPath!], {
      stdio: ['pipe', 'pipe', 'inherit'],
      shell: false,
      env: process.env
    });

    this.mcpServer.on('error', (error: Error) => {
      console.error('MCP server error:', error);
      throw error;
    });

    this.mcpServer.on('exit', (code: number | null, signal: NodeJS.Signals | null) => {
      if (!this.isShuttingDown) {
        console.error(`MCP server exited unexpectedly with code ${code} and signal ${signal}`);
      }
    });

    // Create MCP client
    const transport = new StdioClientTransport({
      command: 'node',
      args: [this.options.mcpServerPath!],
      env: process.env as Record<string, string>
    });

    this.mcpClient = new Client({
      name: 'theme-test-client',
      version: '1.0.0'
    }, {
      capabilities: {}
    });

    try {
      await this.mcpClient.connect(transport);
      console.log('MCP client connected successfully!');
    } catch (error) {
      console.error('Failed to connect MCP client:', error);
      throw error;
    }
  }

  public getMCPClient(): Client | null {
    return this.mcpClient;
  }

  public async start(): Promise<void> {
    try {
      // Start dev server first
      await this.startDevServer();
      
      // Wait for server to be ready
      await waitOn({ resources: ['http-get://localhost:3000/theme-test'], timeout: 30000 });
      
      // Then start MCP server and connect client
      await this.startMCPServer();
      
      console.log('All services started successfully!');
    } catch (error) {
      console.error('Failed to start services:', error);
      await this.cleanup();
      throw error;
    }
  }

  public async stop(): Promise<void> {
    await this.cleanup();
  }

  // Utility method to run a test function with the MCP client
  public async runTest(): Promise<void> {
    if (!this.mcpClient) {
      throw new Error('MCP client not initialized');
    }

    const THEMES = [
      { uiName: 'MonoGeist', id: 'monogeist' },
      { uiName: 'Kodama Grove', id: 'kodama-grove' },
      { uiName: 'Cyberpunk', id: 'cyberpunk' },
    ];

    try {
      console.log('Running theme-switch tests...');

      // Launch browser and navigate to test page
      await this.mcpClient.callTool({ name: 'launch_browser', arguments: { headless: true } });
      await this.mcpClient.callTool({ name: 'new_page', arguments: { pageId: 'test' } });
      await this.mcpClient.callTool({ name: 'navigate', arguments: { pageId: 'test', url: 'http://localhost:3000/theme-test' } });

      for (const { uiName, id } of THEMES) {
        // LIGHT -------------------------------------------------
        await this.pickTheme(uiName, 'test');
        await this.takeScreenshot(`${id}-light-before`, 'test');
        await this.verifyDOM(id, false, 'test');
        await this.takeScreenshot(`${id}-light-after`, 'test');

        // DARK --------------------------------------------------
        await this.toggleDark('test');
        await this.takeScreenshot(`${id}-dark-before`, 'test');
        await this.verifyDOM(id, true, 'test');
        await this.takeScreenshot(`${id}-dark-after`, 'test');

        // Revert to light for next loop
        await this.toggleDark('test');
      }

      await this.mcpClient.callTool({ name: 'close_browser', arguments: {} });
      console.log('\n✅ Theme-switch tests completed successfully!');
      console.log('\n✨ All tests PASSED ✨');
      console.log(`\nScreenshots saved to: tests/e2e/screenshots/`);
      console.log('  - 3 themes × 2 modes × 2 states (before/after) = 12 screenshots total');
    } catch (error) {
      console.error('\n❌ Test failed:', error);
      throw error;
    }
  }

  private async pickTheme(uiName: string, pageId: string) {
    await this.mcpClient!.callTool({ name: 'click', arguments: { pageId, selector: '.flex.items-center.gap-2' } });
    await this.mcpClient!.callTool({ name: 'click', arguments: { pageId, selector: `.flex.items-center.gap-3 span:text-matches("${uiName}", "i")` } });
  }

  private async toggleDark(pageId: string) {
    await this.mcpClient!.callTool({ name: 'click', arguments: { pageId, selector: '.flex.items-center.gap-4 button' } });
  }

  private async takeScreenshot(name: string, pageId: string) {
    await this.mcpClient!.callTool({ name: 'screenshot', arguments: { pageId, path: `tests/e2e/screenshots/${name}.png` } });
  }

  private async verifyDOM(id: string, isDark: boolean, pageId: string) {
    // Wait for theme changes to be applied
    await this.mcpClient!.callTool({ name: 'wait_for_selector', arguments: { 
      pageId, 
      selector: `html[data-theme="${id}"]${isDark ? '.dark' : ':not(.dark)'}`, 
      timeout: 5000 
    } });
    console.log(`✓ Theme assertion passed: ${id} (${isDark ? 'dark' : 'light'} mode)`);
  }
}

// Export the runner
export { ThemeTestRunner };

// If running directly, start the services and keep them running
if (require.main === module) {
  const runner = new ThemeTestRunner();
  
  (async () => {
    try {
      await runner.start();
      console.log('\nTheme test runner is ready!');
      
      // Run the tests
      await runner.runTest();
      
      // Stop services
      await runner.stop();
      process.exit(0);
    } catch (error) {
      console.error('Failed to start theme test runner:', error);
      process.exit(1);
    }
  })();
}
