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
    console.log('Checking if Next.js development server is already running...');
    
    // First check if server is already running
    try {
      await waitOn({
        resources: [this.options.devServerUrl!],
        timeout: 5000,
        delay: 100,
        interval: 500,
        simultaneous: 1,
        validateStatus: (status) => status >= 200 && status < 300
      });
      
      console.log('Dev server is already running!');
      return; // Server is already running, no need to start it
    } catch (error) {
      // Server is not running, start it
      console.log('Starting Next.js development server...');
    }
    
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
      { uiName: 'Cyberpunk', id: 'cyber-punk' }, // Note: The actual value is 'cyber-punk' not 'cyberpunk'
    ];

    try {
      console.log('Running theme-switch tests...');

      // Launch browser and navigate to test page
      await this.mcpClient.callTool({ name: 'launch_browser', arguments: { headless: true } }); // Set to true for CI
      await this.mcpClient.callTool({ name: 'new_page', arguments: { pageId: 'test' } });
      await this.mcpClient.callTool({ name: 'navigate', arguments: { pageId: 'test', url: 'http://localhost:3000/theme-test' } });
      
      // Wait for page to fully load
      await this.mcpClient.callTool({ name: 'wait_for_selector', arguments: { 
        pageId: 'test', 
        selector: 'body', 
        timeout: 10000 
      } });
      
      // Additional delay to ensure all resources are loaded
      await this.delay(2000);
      
      // Clear localStorage to ensure clean state
      await this.mcpClient.callTool({ name: 'evaluate', arguments: { 
        pageId: 'test', 
        expression: `
          (() => {
            localStorage.removeItem('color-scheme');
            localStorage.removeItem('mode');
            localStorage.removeItem('theme');
            return 'LocalStorage cleared';
          })()
        ` 
      } });
      
      // Reload the page to apply clean state
      await this.mcpClient.callTool({ name: 'navigate', arguments: { pageId: 'test', url: 'http://localhost:3000/theme-test' } });
      await this.delay(2000);

      for (const { uiName, id } of THEMES) {
        console.log(`\n${'='.repeat(50)}`);
        console.log(`Testing theme: ${uiName} (${id})`);
        console.log('='.repeat(50));
        
        // LIGHT MODE TEST
        console.log('\n--- Light Mode ---');
        await this.pickTheme(uiName, 'test');
        await this.delay(1500); // Wait for theme transition
        await this.takeScreenshot(`${id}-light-before`, 'test');
        await this.verifyDOM(id, false, 'test');
        await this.takeScreenshot(`${id}-light-after`, 'test');

        // DARK MODE TEST
        console.log('\n--- Dark Mode ---');
        await this.toggleDark('test');
        await this.delay(1500); // Wait for dark mode transition
        await this.takeScreenshot(`${id}-dark-before`, 'test');
        await this.verifyDOM(id, true, 'test');
        await this.takeScreenshot(`${id}-dark-after`, 'test');

        // Revert to light for next theme
        console.log('\n--- Reverting to Light Mode ---');
        await this.toggleDark('test');
        await this.delay(1000); // Wait for revert
      }

      await this.mcpClient.callTool({ name: 'close_browser', arguments: {} });
      console.log('\n✅ Theme-switch tests completed successfully!');
      console.log('\n✨ All tests PASSED ✨');
      console.log(`\nScreenshots saved to: tests/e2e/screenshots/`);
      console.log('  - 3 themes × 2 modes × 2 states (before/after) = 12 screenshots total');
    } catch (error) {
      console.error('\n❌ Test failed:', error);
      await this.cleanup();
      console.error('❌ Test did not complete successfully. Cleaned up resources. Please check for errors and retry.');
    }
  }

  private async pickTheme(uiName: string, pageId: string) {
    console.log(`\nSelecting theme: ${uiName}`);
    
    // First, let's get the current theme to see if we need to change it
    const currentTheme = await this.mcpClient!.callTool({ 
      name: 'evaluate', 
      arguments: { 
        pageId, 
        expression: `document.documentElement.getAttribute('data-theme')` 
      } 
    });
    console.log(`Current theme: ${(currentTheme as any).content[0].text}`);
    
    // Click on the first Select trigger (theme selector)
    await this.mcpClient!.callTool({ name: 'evaluate', arguments: { 
      pageId, 
      expression: `
        (() => {
          const buttons = document.querySelectorAll('button[role="combobox"]');
          if (buttons.length > 0) {
            buttons[0].click(); // Click the first combobox which is the theme selector
            return 'Clicked theme selector';
          }
          throw new Error('Theme selector button not found');
        })()
      ` 
    } });
    
    // Wait for dropdown to open
    await this.delay(500);
    
    // Click on the specific theme option
    await this.mcpClient!.callTool({ name: 'evaluate', arguments: { 
      pageId, 
      expression: `
        (() => {
          const options = document.querySelectorAll('[role="option"]');
          console.log('Found ' + options.length + ' options');
          for (const option of options) {
            console.log('Option text:', option.textContent);
            if (option.textContent && option.textContent.trim() === '${uiName}') {
              option.click();
              return 'Clicked ' + option.textContent;
            }
          }
          throw new Error('Theme option not found: ${uiName}');
        })()
      ` 
    } });
    
    // Wait for theme to be applied and dropdown to close
    await this.delay(1500);
    
    // Verify theme was applied
    const newTheme = await this.mcpClient!.callTool({ 
      name: 'evaluate', 
      arguments: { 
        pageId, 
        expression: `document.documentElement.getAttribute('data-theme')` 
      } 
    });
    console.log(`✓ Theme changed to: ${(newTheme as any).content[0].text}`);
  }

  private async toggleDark(pageId: string) {
    console.log('Toggling dark mode...');
    
    // The dark mode toggle is a button with either "Dark Mode" or "Light Mode" text
    // It's inside a div with class "flex items-center gap-4"
    await this.mcpClient!.callTool({ name: 'evaluate', arguments: { 
      pageId, 
      expression: `
        (() => {
          // Find the button that contains either "Dark Mode" or "Light Mode"
          const buttons = document.querySelectorAll('button');
          for (const button of buttons) {
            const text = button.textContent || '';
            if (text.includes('Dark Mode') || text.includes('Light Mode')) {
              button.click();
              return true;
            }
          }
          throw new Error('Dark mode toggle button not found');
        })()
      ` 
    } });
    
    // Wait for mode transition to complete
    await this.delay(1000);
    console.log('✓ Dark mode toggled');
  }

  private async takeScreenshot(name: string, pageId: string) {
    console.log(`Taking screenshot: ${name}`);
    await this.mcpClient!.callTool({ name: 'screenshot', arguments: { 
      pageId, 
      path: `tests/e2e/screenshots/${name}.png`,
      fullPage: true  // Capture the full page to see theme differences
    } });
  }

  private async verifyDOM(id: string, isDark: boolean, pageId: string) {
    console.log(`Verifying DOM state for theme: ${id}, dark mode: ${isDark}`);
    
    // Use evaluate to check multiple conditions
    const result = await this.mcpClient!.callTool({ 
      name: 'evaluate', 
      arguments: { 
        pageId, 
        expression: `
          (() => {
            const html = document.documentElement;
            const body = document.body;
            const theme = html.getAttribute('data-theme') || body.getAttribute('data-theme');
            const isDarkMode = html.classList.contains('dark') || body.classList.contains('dark');
            const computedBg = window.getComputedStyle(document.body).backgroundColor;
            const selectValue = document.querySelector('button[role="combobox"]')?.textContent || 'Not found';
            const localStorage = {
              colorScheme: window.localStorage.getItem('color-scheme'),
              mode: window.localStorage.getItem('mode'),
              theme: window.localStorage.getItem('theme')
            };
            
            return {
              theme,
              isDarkMode,
              expectedTheme: '${id}',
              expectedDark: ${isDark},
              backgroundColor: computedBg,
              themeMatch: theme === '${id}',
              darkMatch: isDarkMode === ${isDark},
              selectValue,
              localStorage
            };
          })()
        `
      } 
    });
    
    const domState = JSON.parse((result as any).content[0].text);
    
    console.log('Current DOM state:', {
      theme: domState.theme,
      isDarkMode: domState.isDarkMode,
      selectValue: domState.selectValue,
      localStorage: domState.localStorage
    });
    
    if (!domState.themeMatch || !domState.darkMatch) {
      throw new Error(`DOM verification failed:\n` +
        `  Expected theme: ${id}, got: ${domState.theme}\n` +
        `  Expected dark mode: ${isDark}, got: ${domState.isDarkMode}\n` +
        `  Background color: ${domState.backgroundColor}\n` +
        `  Select value: ${domState.selectValue}\n` +
        `  LocalStorage: ${JSON.stringify(domState.localStorage)}`);
    }
    
    console.log(`✓ DOM verification passed: ${id} (${isDark ? 'dark' : 'light'} mode)`);
    console.log(`  Background color: ${domState.backgroundColor}`);
  }
  
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
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
