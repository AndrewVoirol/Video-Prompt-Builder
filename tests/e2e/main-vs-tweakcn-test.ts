#!/usr/bin/env ts-node
import { ThemeTestRunner } from './theme-test.runner';

async function runMainVsTweakcnTest() {
  const runner = new ThemeTestRunner();
  
  try {
    await runner.start();
    console.log('\n🔍 Starting Main App vs TweakCN Reference Comparison...\n');
    
    const client = runner.getMCPClient();
    if (!client) {
      throw new Error('MCP client not initialized');
    }

    // Launch browser
    await client.callTool({ name: 'launch_browser', arguments: { headless: true } });
    
    // PART 1: Capture main app screenshots
    console.log('📸 Capturing main application screenshots...');
    await client.callTool({ name: 'new_page', arguments: { pageId: 'main' } });
    await client.callTool({ name: 'navigate', arguments: { pageId: 'main', url: 'http://localhost:3000' } });
    await client.callTool({ name: 'wait_for_selector', arguments: { pageId: 'main', selector: '[data-theme]' } });
    
    const themes = [
      { name: 'Mono', value: 'mono' },
      { name: 'Kodama Grove', value: 'kodama-grove' },
      { name: 'Cyberpunk', value: 'cyber-punk' }
    ];
    
    for (const theme of themes) {
      console.log(`  📷 Main app: ${theme.name}...`);
      
      // Set theme directly via DOM
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
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Light mode
      await client.callTool({ 
        name: 'screenshot', 
        arguments: { 
          pageId: 'main', 
          path: `tests/e2e/screenshots/main-${theme.value}-light.png`,
          fullPage: true 
        } 
      });
      
      // Dark mode  
      await client.callTool({ 
        name: 'evaluate', 
        arguments: { 
          pageId: 'main', 
          expression: `document.documentElement.classList.add('dark');`
        } 
      });
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await client.callTool({ 
        name: 'screenshot', 
        arguments: { 
          pageId: 'main', 
          path: `tests/e2e/screenshots/main-${theme.value}-dark.png`,
          fullPage: true 
        } 
      });
      
      console.log(`  ✅ Main app ${theme.name} captured`);
    }
    
    // PART 2: Capture tweakcn reference screenshots
    console.log('\n📸 Capturing TweakCN reference screenshots...');
    await client.callTool({ name: 'new_page', arguments: { pageId: 'tweakcn' } });
    await client.callTool({ name: 'navigate', arguments: { pageId: 'tweakcn', url: 'https://tweakcn.com/editor/theme' } });
    await client.callTool({ name: 'wait_for_selector', arguments: { pageId: 'tweakcn', selector: 'body' } });
    
    // Wait for page to fully load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    for (const theme of themes) {
      console.log(`  📷 TweakCN: ${theme.name}...`);
      
      try {
        // Try to select theme (this might need adjustment based on tweakcn UI)
        await client.callTool({ 
          name: 'click', 
          arguments: { 
            pageId: 'tweakcn', 
            selector: `[data-theme="${theme.value}"], button:contains("${theme.name}")`
          } 
        });
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Light mode screenshot
        await client.callTool({ 
          name: 'screenshot', 
          arguments: { 
            pageId: 'tweakcn', 
            path: `tests/e2e/screenshots/tweakcn-${theme.value}-light.png`,
            fullPage: true 
          } 
        });
        
        // Try to toggle dark mode
        await client.callTool({ 
          name: 'click', 
          arguments: { 
            pageId: 'tweakcn', 
            selector: 'button[aria-label*="dark"], button[aria-label*="theme"], .dark-toggle'
          } 
        });
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Dark mode screenshot
        await client.callTool({ 
          name: 'screenshot', 
          arguments: { 
            pageId: 'tweakcn', 
            path: `tests/e2e/screenshots/tweakcn-${theme.value}-dark.png`,
            fullPage: true 
          } 
        });
        
        console.log(`  ✅ TweakCN ${theme.name} captured`);
        
      } catch (e) {
        console.log(`  ⚠️  TweakCN ${theme.name} - manual capture needed`);
        
        // Just take screenshot of current state
        await client.callTool({ 
          name: 'screenshot', 
          arguments: { 
            pageId: 'tweakcn', 
            path: `tests/e2e/screenshots/tweakcn-current-state.png`,
            fullPage: true 
          } 
        });
      }
    }
    
    await client.callTool({ name: 'close_browser', arguments: {} });
    
    console.log('\n🎉 Screenshot comparison ready!');
    console.log('📁 View results in: tests/e2e/screenshots/viewer.html');
    
    await runner.stop();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Comparison test failed:', error);
    await runner.stop();
    process.exit(1);
  }
}

runMainVsTweakcnTest();
