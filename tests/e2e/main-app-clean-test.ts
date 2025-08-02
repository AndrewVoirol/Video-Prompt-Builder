#!/usr/bin/env ts-node
import { ThemeTestRunner } from './theme-test.runner';

async function runMainAppTest() {
  const runner = new ThemeTestRunner();
  
  try {
    await runner.start();
    console.log('\n🚀 Testing MAIN APPLICATION themes...\n');
    
    const client = runner.getMCPClient();
    if (!client) {
      throw new Error('MCP client not initialized');
    }

    // Launch browser and navigate to MAIN APPLICATION
    await client.callTool({ name: 'launch_browser', arguments: { headless: true } });
    await client.callTool({ name: 'new_page', arguments: { pageId: 'main-app' } });
    await client.callTool({ name: 'navigate', arguments: { pageId: 'main-app', url: 'http://localhost:3000' } });
    
    // Wait for main app to load
    await client.callTool({ name: 'wait_for_selector', arguments: { pageId: 'main-app', selector: '[data-theme]' } });
    
    const themes = [
      { name: 'Mono', value: 'mono' },
      { name: 'Kodama Grove', value: 'kodama-grove' },
      { name: 'Cyberpunk', value: 'cyber-punk' }
    ];
    
    for (const theme of themes) {
      console.log(`\n📸 Capturing ${theme.name} theme on main app...`);
      
      // Set theme directly via DOM
      await client.callTool({ 
        name: 'evaluate', 
        arguments: { 
          pageId: 'main-app', 
          expression: `
            document.documentElement.setAttribute('data-theme', '${theme.value}');
            document.documentElement.classList.remove('dark');
          `
        } 
      });
      
      // Wait for styles to apply
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Light mode screenshot
      await client.callTool({ 
        name: 'screenshot', 
        arguments: { 
          pageId: 'main-app', 
          path: `tests/e2e/screenshots/main-app-${theme.value}-light.png`,
          fullPage: true 
        } 
      });
      
      console.log(`  ✅ ${theme.name} light mode captured`);
      
      // Switch to dark mode
      await client.callTool({ 
        name: 'evaluate', 
        arguments: { 
          pageId: 'main-app', 
          expression: `document.documentElement.classList.add('dark');`
        } 
      });
      
      // Wait for dark mode transition
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Dark mode screenshot
      await client.callTool({ 
        name: 'screenshot', 
        arguments: { 
          pageId: 'main-app', 
          path: `tests/e2e/screenshots/main-app-${theme.value}-dark.png`,
          fullPage: true 
        } 
      });
      
      console.log(`  ✅ ${theme.name} dark mode captured`);
    }
    
    // Verify current theme state
    console.log('\n🔍 Verifying theme state...');
    const verification = await client.callTool({ 
      name: 'evaluate', 
      arguments: { 
        pageId: 'main-app', 
        expression: `({
          currentTheme: document.documentElement.getAttribute('data-theme'),
          isDark: document.documentElement.classList.contains('dark'),
          backgroundColorCSS: getComputedStyle(document.documentElement).getPropertyValue('--background').trim(),
          primaryColorCSS: getComputedStyle(document.documentElement).getPropertyValue('--primary').trim(),
          radiusCSS: getComputedStyle(document.documentElement).getPropertyValue('--radius').trim(),
          fontFamilyCSS: getComputedStyle(document.documentElement).getPropertyValue('--font-sans').trim()
        })`
      } 
    });
    
    console.log('Theme verification:', verification);
    
    await client.callTool({ name: 'close_browser', arguments: {} });
    console.log('\n🎉 Main app theme testing completed!');
    console.log('📁 View screenshots in: tests/e2e/screenshots/viewer.html');
    
    await runner.stop();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Main app test failed:', error);
    await runner.stop();
    process.exit(1);
  }
}

runMainAppTest();
