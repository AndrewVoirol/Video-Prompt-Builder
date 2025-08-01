#!/usr/bin/env ts-node
import { ThemeTestRunner } from './theme-test.runner';

async function debugThemeSelector() {
  const runner = new ThemeTestRunner();
  
  try {
    await runner.start();
    const client = runner.getMCPClient();
    
    if (!client) {
      throw new Error('MCP client not initialized');
    }

    // Launch browser
    await client.callTool({ name: 'launch_browser', arguments: { headless: false } });
    await client.callTool({ name: 'new_page', arguments: { pageId: 'debug' } });
    await client.callTool({ name: 'navigate', arguments: { pageId: 'debug', url: 'http://localhost:3000/theme-test' } });
    
    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Debug: Get all the select elements and buttons
    const debugInfo = await client.callTool({ 
      name: 'evaluate', 
      arguments: { 
        pageId: 'debug', 
        expression: `
          (() => {
            // Find all select-like elements
            const selects = document.querySelectorAll('select, [role="combobox"], button[aria-haspopup="listbox"]');
            const buttons = document.querySelectorAll('button');
            
            const selectInfo = Array.from(selects).map(el => ({
              tag: el.tagName,
              role: el.getAttribute('role'),
              ariaHaspopup: el.getAttribute('aria-haspopup'),
              text: el.textContent?.trim(),
              className: el.className,
              id: el.id
            }));
            
            const buttonInfo = Array.from(buttons).slice(0, 10).map(el => ({
              text: el.textContent?.trim(),
              className: el.className,
              onclick: el.onclick ? 'has onclick' : 'no onclick'
            }));
            
            // Check current theme
            const html = document.documentElement;
            const currentTheme = html.getAttribute('data-theme');
            const isDark = html.classList.contains('dark');
            
            return {
              selects: selectInfo,
              buttons: buttonInfo,
              currentTheme,
              isDark,
              selectCount: selects.length,
              buttonCount: buttons.length
            };
          })()
        ` 
      } 
    });
    
    console.log('Debug Info:', JSON.stringify(JSON.parse((debugInfo as any).content[0].text), null, 2));
    
    // Try to find and click the theme selector
    console.log('\nTrying to click theme selector...');
    
    // Try different selectors
    const selectors = [
      'button[role="combobox"]',
      '[data-radix-collection-item]',
      'button:has-text("Cyberpunk")',
      'button:has-text("Theme")',
      '.flex.items-center.gap-2 button'
    ];
    
    for (const selector of selectors) {
      try {
        console.log(`Trying selector: ${selector}`);
        await client.callTool({ name: 'click', arguments: { pageId: 'debug', selector } });
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if dropdown opened
        const dropdownCheck = await client.callTool({ 
          name: 'evaluate', 
          arguments: { 
            pageId: 'debug', 
            expression: `document.querySelector('[role="listbox"]') !== null` 
          } 
        });
        
        if (JSON.parse((dropdownCheck as any).content[0].text)) {
          console.log(`✓ Dropdown opened with selector: ${selector}`);
          break;
        }
      } catch (e) {
        console.log(`✗ Failed with selector: ${selector}`);
      }
    }
    
    // Get dropdown options
    const options = await client.callTool({ 
      name: 'evaluate', 
      arguments: { 
        pageId: 'debug', 
        expression: `
          (() => {
            const options = document.querySelectorAll('[role="option"], [role="menuitem"], [data-radix-collection-item]');
            return Array.from(options).map(el => ({
              text: el.textContent?.trim(),
              role: el.getAttribute('role'),
              className: el.className
            }));
          })()
        ` 
      } 
    });
    
    console.log('\nDropdown options:', JSON.stringify(JSON.parse((options as any).content[0].text), null, 2));
    
    // Keep browser open for inspection
    console.log('\nBrowser will stay open for inspection. Press Ctrl+C to exit.');
    
  } catch (error) {
    console.error('Debug failed:', error);
    throw error;
  }
}

// Run the debug
debugThemeSelector().catch(console.error);
