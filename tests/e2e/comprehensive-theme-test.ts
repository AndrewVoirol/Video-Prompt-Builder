#!/usr/bin/env ts-node
import { ThemeTestRunner } from './theme-test.runner';

async function runComprehensiveThemeTest() {
  const runner = new ThemeTestRunner();
  
  try {
    await runner.start();
    console.log('\nStarting comprehensive theme tests...\n');
    
    const client = runner.getMCPClient();
    if (!client) {
      throw new Error('MCP client not initialized');
    }

    // Launch browser and navigate to MAIN APPLICATION
    await client.callTool({ name: 'launch_browser', arguments: { headless: false } });
    await client.callTool({ name: 'new_page', arguments: { pageId: 'main' } });
    await client.callTool({ name: 'navigate', arguments: { pageId: 'main', url: 'http://localhost:3000' } });
    
    // Wait for page to load
    await client.callTool({ name: 'wait_for_selector', arguments: { pageId: 'main', selector: '[data-theme]' } });
    
    // Test each theme with corrected names
    const themes = [
      { name: 'Mono', value: 'mono' },
      { name: 'Kodama Grove', value: 'kodama-grove' },
      { name: 'Cyberpunk', value: 'cyber-punk' }
    ];
    
    for (const theme of themes) {
      console.log(`\nTesting ${theme.name} theme...`);
      
      // Select theme using the dropdown
      await client.callTool({ 
        name: 'click', 
        arguments: { 
          pageId: 'test', 
          selector: '[role="combobox"]' // Select trigger
        } 
      });
      
      // Wait for dropdown to open
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Click on the theme option
      await client.callTool({ 
        name: 'click', 
        arguments: { 
          pageId: 'test', 
          selector: `[role="option"]:has-text("${theme.name}")` 
        } 
      });
      
      // Wait for theme to apply
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Take screenshot in light mode
      await client.callTool({ 
        name: 'screenshot', 
        arguments: { 
          pageId: 'test', 
          path: `tests/e2e/screenshots/comprehensive-${theme.value}-light.png`,
          fullPage: true 
        } 
      });
      
      console.log(`✓ ${theme.name} light mode screenshot taken`);
      
      // Click dark mode toggle button
      await client.callTool({ 
        name: 'click', 
        arguments: { 
          pageId: 'test', 
          selector: 'button:has-text("Mode")'
        } 
      });
      
      // Wait for transition
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Take screenshot in dark mode
      await client.callTool({ 
        name: 'screenshot', 
        arguments: { 
          pageId: 'test', 
          path: `tests/e2e/screenshots/comprehensive-${theme.value}-dark.png`,
          fullPage: true 
        } 
      });
      
      console.log(`✓ ${theme.name} dark mode screenshot taken`);
      
      // Test some interactive elements
      console.log(`  Testing interactive elements...`);
      
      // Click on different button variants
      const buttonVariants = ['Default', 'Secondary', 'Outline', 'Ghost', 'Destructive'];
      for (const variant of buttonVariants) {
        try {
          await client.callTool({ 
            name: 'click', 
            arguments: { 
              pageId: 'test', 
              selector: `button:has-text("${variant}")` 
            } 
          });
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (e) {
          // Button might not be visible, continue
        }
      }
      
      // Test tabs
      await client.callTool({ 
        name: 'click', 
        arguments: { 
          pageId: 'test', 
          selector: 'button[role="tab"]:has-text("Forms")' 
        } 
      });
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await client.callTool({ 
        name: 'click', 
        arguments: { 
          pageId: 'test', 
          selector: 'button[role="tab"]:has-text("Overlays")' 
        } 
      });
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Go back to components tab
      await client.callTool({ 
        name: 'click', 
        arguments: { 
          pageId: 'test', 
          selector: 'button[role="tab"]:has-text("Components")' 
        } 
      });
      
      // Toggle back to light mode for next theme
      if (theme !== themes[themes.length - 1]) {
        await client.callTool({ 
          name: 'click', 
          arguments: { 
            pageId: 'test', 
            selector: 'button:has-text("Mode")'
          } 
        });
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    // Verify theme application in DOM
    console.log('\nVerifying theme application in DOM...');
    const domCheck = await client.callTool({ 
      name: 'evaluate', 
      arguments: { 
        pageId: 'test', 
        expression: `{
          theme: document.documentElement.getAttribute('data-theme'),
          isDark: document.documentElement.classList.contains('dark'),
          bodyBg: window.getComputedStyle(document.body).backgroundColor
        }` 
      } 
    });
    
    console.log('DOM verification:', domCheck);
    
    // Close browser
    await client.callTool({ name: 'close_browser', arguments: {} });
    console.log('\n✅ All theme tests completed successfully!');
    
    // Stop services
    await runner.stop();
    process.exit(0);
  } catch (error) {
    console.error('❌ Theme test failed:', error);
    await runner.stop();
    process.exit(1);
  }
}

// Run the tests
runComprehensiveThemeTest();
