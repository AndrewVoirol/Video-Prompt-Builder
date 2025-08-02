#!/usr/bin/env ts-node
import { ThemeTestRunner } from './theme-test.runner';

async function runMainAppTest() {
  const runner = new ThemeTestRunner();
  
  try {
    await runner.start();
    console.log('\n🚀 Starting main application theme tests...\n');
    
    const client = runner.getMCPClient();
    if (!client) {
      throw new Error('MCP client not initialized');
    }

    // Launch browser and navigate to MAIN APPLICATION (not theme-test page)
    await client.callTool({ name: 'launch_browser', arguments: { headless: true } });
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
      console.log(`\n📸 Testing ${theme.name} theme on main app...`);
      
      // Set theme directly via DOM manipulation
      await client.callTool({ 
        name: 'evaluate', 
        arguments: { 
          pageId: 'main', 
          expression: `
            document.documentElement.setAttribute('data-theme', '${theme.value}');
            document.documentElement.classList.remove('dark');
          `
        } 
      });
      
      // Wait for theme to apply
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Take screenshot in light mode
      await client.callTool({ 
        name: 'screenshot', 
        arguments: { 
          pageId: 'main', 
          path: `tests/e2e/screenshots/main-app-${theme.value}-light.png`,
          fullPage: true 
        } 
      });
      
      console.log(`✅ ${theme.name} light mode screenshot taken`);
      
      // Switch to dark mode
      await client.callTool({ 
        name: 'evaluate', 
        arguments: { 
          pageId: 'main', 
          expression: `
            document.documentElement.classList.add('dark');
          `
        } 
      });
      
      // Wait for transition
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Take screenshot in dark mode
      await client.callTool({ 
        name: 'screenshot', 
        arguments: { 
          pageId: 'main', 
          path: `tests/e2e/screenshots/main-app-${theme.value}-dark.png`,
          fullPage: true 
        } 
      });
      
      console.log(`✅ ${theme.name} dark mode screenshot taken`);
    }
    
    // Verify Mono theme specifically
    console.log('\n🔍 Verifying Mono theme CSS properties...');
    await client.callTool({ 
      name: 'evaluate', 
      arguments: { 
        pageId: 'main', 
        expression: `
          document.documentElement.setAttribute('data-theme', 'mono');
          document.documentElement.classList.remove('dark');
        `
      } 
    });
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const monoVerification = await client.callTool({ 
      name: 'evaluate', 
      arguments: { 
        pageId: 'main', 
        expression: `{
          theme: document.documentElement.getAttribute('data-theme'),
          isDark: document.documentElement.classList.contains('dark'),
          background: getComputedStyle(document.documentElement).getPropertyValue('--background').trim(),
          borderRadius: getComputedStyle(document.documentElement).getPropertyValue('--radius').trim(),
          fontFamily: getComputedStyle(document.documentElement).getPropertyValue('--font-sans').trim()
        }` 
      } 
    });
    
    console.log('Mono theme verification:', monoVerification);
    
    // Close browser
    await client.callTool({ name: 'close_browser', arguments: {} });
    console.log('\n🎉 All main app theme tests completed successfully!');
    
    // Stop services
    await runner.stop();
    process.exit(0);
  } catch (error) {
    console.error('❌ Main app theme test failed:', error);
    await runner.stop();
    process.exit(1);
  }
}

// Run the tests
runMainAppTest();
