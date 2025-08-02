#!/usr/bin/env ts-node
import { ThemeTestRunner } from './theme-test.runner';

interface TweakcnTheme {
  name: string;
  value: string;
  selector: string;
}

async function captureTweakcnReference(): Promise<void> {
  const runner = new ThemeTestRunner();
  
  try {
    await runner.start();
    console.log('\n🎯 Capturing TweakCN reference screenshots...\n');
    
    const client = runner.getMCPClient();
    if (!client) {
      throw new Error('MCP client not initialized');
    }

    // Launch browser and navigate to TweakCN theme editor
    await client.callTool({ name: 'launch_browser', arguments: { headless: false } }); // Make visible for debugging
    await client.callTool({ name: 'new_page', arguments: { pageId: 'tweakcn-ref' } });
    await client.callTool({ 
      name: 'navigate', 
      arguments: { 
        pageId: 'tweakcn-ref', 
        url: 'https://tweakcn.com/editor/theme' 
      } 
    });
    
    // Wait for TweakCN to fully load
    await client.callTool({ 
      name: 'wait_for_selector', 
      arguments: { 
        pageId: 'tweakcn-ref', 
        selector: 'body' 
      } 
    });
    
    // Extra wait for dynamic content
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // First, let's inspect the page structure to understand theme switching
    console.log('🔍 Inspecting TweakCN page structure...');
    const pageStructure = await client.callTool({ 
      name: 'evaluate', 
      arguments: { 
        pageId: 'tweakcn-ref', 
        expression: `
          // Look for theme selection elements
          const themeSelectors = document.querySelectorAll('[data-theme], .theme-selector, [class*="theme"], button[class*="theme"]');
          const dropdowns = document.querySelectorAll('select, [role="combobox"], [role="listbox"]');
          const buttons = document.querySelectorAll('button');
          
          const result = {
            themeElements: Array.from(themeSelectors).map(el => ({
              tagName: el.tagName,
              className: el.className,
              dataTheme: el.getAttribute('data-theme'),
              textContent: el.textContent?.trim().substring(0, 50)
            })),
            dropdowns: Array.from(dropdowns).map(el => ({
              tagName: el.tagName,
              className: el.className,
              textContent: el.textContent?.trim().substring(0, 50),
              options: el.tagName === 'SELECT' ? Array.from(el.options).map(opt => opt.textContent) : null
            })),
            relevantButtons: Array.from(buttons).filter(btn => 
              btn.textContent?.toLowerCase().includes('theme') ||
              btn.textContent?.toLowerCase().includes('mono') ||
              btn.textContent?.toLowerCase().includes('kodama') ||
              btn.textContent?.toLowerCase().includes('cyber')
            ).map(btn => ({
              className: btn.className,
              textContent: btn.textContent?.trim(),
              onclick: btn.onclick?.toString()
            }))
          };
          
          return JSON.stringify(result, null, 2);
        `
      } 
    });
    
    console.log('Page structure:', pageStructure);
    
    const themes: TweakcnTheme[] = [
      { name: 'Modern Minimal', value: 'modern-minimal', selector: '[data-theme="modern-minimal"]' },
      { name: 'Kodama Grove', value: 'kodama-grove', selector: '[data-theme="kodama-grove"]' },
      { name: 'Cosmic Night', value: 'cosmic-night', selector: '[data-theme="cosmic-night"]' }
    ];
    
    // Capture current state first (likely default theme)
    await client.callTool({ 
      name: 'screenshot', 
      arguments: { 
        pageId: 'tweakcn-ref', 
        path: 'tests/e2e/screenshots/tweakcn-default-state.png',
        fullPage: true 
      } 
    });
    console.log('📸 Default TweakCN state captured');
    
    for (const theme of themes) {
      console.log(`\n🎨 Processing ${theme.name} theme...`);
      
      try {
        // Use TweakCN's theme switching method based on source code analysis
        await client.callTool({ 
          name: 'evaluate', 
          arguments: { 
            pageId: 'tweakcn-ref', 
            expression: `
              // Simulate theme switching like TweakCN does it
              // First find and click the theme selector
              const themeButtons = document.querySelectorAll('button[role="combobox"]');
              const themeSelector = Array.from(themeButtons).find(btn => 
                btn.textContent?.toLowerCase().includes('theme') || 
                btn.closest('[class*="theme"]') ||
                btn.querySelector('[class*="color"]')
              );
              
              if (themeSelector) {
                themeSelector.click();
                // Wait a bit for dropdown
                setTimeout(() => {
                  const options = document.querySelectorAll('[role="option"]');
                  const targetOption = Array.from(options).find(opt => 
                    opt.textContent?.toLowerCase().includes('${theme.name.toLowerCase()}') ||
                    opt.textContent?.toLowerCase().includes('${theme.value}')
                  );
                  if (targetOption) {
                    targetOption.click();
                  }
                }, 500);
              }
              
              // Fallback: direct DOM manipulation
              document.documentElement.setAttribute('data-theme', '${theme.value}');
              document.body.setAttribute('data-theme', '${theme.value}');
              document.documentElement.classList.remove('dark');
              
              // Set localStorage like TweakCN does
              localStorage.setItem('theme', '${theme.value}');
              localStorage.setItem('color-scheme', 'light');
              
              return 'Theme switched to ${theme.value}';
            `
          } 
        });
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Light mode screenshot
        await client.callTool({ 
          name: 'screenshot', 
          arguments: { 
            pageId: 'tweakcn-ref', 
            path: `tests/e2e/screenshots/tweakcn-${theme.value}-light.png`,
            fullPage: true 
          } 
        });
        console.log(`  ✅ ${theme.name} light mode captured`);
        
        // Switch to dark mode
        await client.callTool({ 
          name: 'evaluate', 
          arguments: { 
            pageId: 'tweakcn-ref', 
            expression: `document.documentElement.classList.add('dark'); true;`
          } 
        });
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Dark mode screenshot
        await client.callTool({ 
          name: 'screenshot', 
          arguments: { 
            pageId: 'tweakcn-ref', 
            path: `tests/e2e/screenshots/tweakcn-${theme.value}-dark.png`,
            fullPage: true 
          } 
        });
        console.log(`  ✅ ${theme.name} dark mode captured`);
        
      } catch (error) {
        console.warn(`  ⚠️  ${theme.name} capture failed, using current state`);
        
        // Fallback: capture whatever is currently displayed
        await client.callTool({ 
          name: 'screenshot', 
          arguments: { 
            pageId: 'tweakcn-ref', 
            path: `tests/e2e/screenshots/tweakcn-${theme.value}-fallback.png`,
            fullPage: true 
          } 
        });
      }
    }
    
    await client.callTool({ name: 'close_browser', arguments: {} });
    
    console.log('\n🎉 TweakCN reference capture completed!');
    console.log('📁 Reference screenshots ready for comparison');
    
    await runner.stop();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ TweakCN reference capture failed:', error);
    await runner.stop();
    process.exit(1);
  }
}

captureTweakcnReference();
