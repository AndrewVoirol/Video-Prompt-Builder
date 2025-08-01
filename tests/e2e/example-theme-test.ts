#!/usr/bin/env ts-node
import { ThemeTestRunner } from './theme-test.runner';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';

async function runThemeTests() {
  const runner = new ThemeTestRunner();
  
  try {
    // Start all services
    await runner.start();
    
    // Run test with MCP client
    await runner.runTest(async (client: Client) => {
      console.log('Running theme tests...');
      
      // Example: Launch browser
      const launchResult = await client.callTool('launch_browser', {
        headless: false
      });
      console.log('Browser launched:', launchResult);
      
      // Example: Create a new page
      const pageResult = await client.callTool('new_page', {
        pageId: 'main'
      });
      console.log('Page created:', pageResult);
      
      // Example: Navigate to the app
      const navResult = await client.callTool('navigate', {
        pageId: 'main',
        url: 'http://localhost:3000'
      });
      console.log('Navigated to app:', navResult);
      
      // Example: Wait for the app to load
      const waitResult = await client.callTool('wait_for_selector', {
        pageId: 'main',
        selector: 'body',
        timeout: 5000
      });
      console.log('App loaded:', waitResult);
      
      // Example: Take a screenshot
      const screenshotResult = await client.callTool('screenshot', {
        pageId: 'main',
        path: 'tests/e2e/screenshots/theme-test.png',
        fullPage: true
      });
      console.log('Screenshot taken:', screenshotResult);
      
      // Clean up
      await client.callTool('close_browser', {});
      console.log('Browser closed');
    });
    
    console.log('Theme tests completed successfully!');
  } catch (error) {
    console.error('Theme tests failed:', error);
    process.exit(1);
  } finally {
    // Stop all services
    await runner.stop();
  }
}

// Run the tests
if (require.main === module) {
  runThemeTests();
}
