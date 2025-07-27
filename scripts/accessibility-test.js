#!/usr/bin/env node

const { chromium } = require('playwright');

async function runAccessibilityTests() {
  console.log('🚀 Starting accessibility tests...');
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Navigate to the app
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    console.log('✅ Page loaded successfully');
    
    // Run axe-core tests
    const results = await page.evaluate(async () => {
      const axe = await import('axe-core');
      return await axe.default.run();
    });
    
    console.log('\n📊 Accessibility Test Results:');
    console.log(`✅ Violations: ${results.violations.length}`);
    console.log(`⚠️  Incomplete: ${results.incomplete.length}`);
    console.log(`✨ Passes: ${results.passes.length}`);
    
    // Report violations
    if (results.violations.length > 0) {
      console.log('\n❌ Accessibility Violations:');
      results.violations.forEach((violation, index) => {
        console.log(`\n${index + 1}. ${violation.id}`);
        console.log(`   Description: ${violation.description}`);
        console.log(`   Impact: ${violation.impact}`);
        console.log(`   Help: ${violation.helpUrl}`);
        console.log(`   Elements: ${violation.nodes.length}`);
        
        violation.nodes.forEach((node, nodeIndex) => {
          console.log(`     ${nodeIndex + 1}. ${node.html}`);
          if (node.failureSummary) {
            console.log(`        Issue: ${node.failureSummary}`);
          }
        });
      });
    }
    
    // Report incomplete tests
    if (results.incomplete.length > 0) {
      console.log('\n⚠️  Incomplete Tests (manual review needed):');
      results.incomplete.forEach((incomplete, index) => {
        console.log(`${index + 1}. ${incomplete.id}: ${incomplete.description}`);
      });
    }
    
    // Color contrast specific check
    const colorContrastViolations = results.violations.filter(v => v.id === 'color-contrast');
    if (colorContrastViolations.length === 0) {
      console.log('\n✅ Color contrast: All tests passed');
    } else {
      console.log('\n❌ Color contrast violations found');
    }
    
    console.log('\n🎯 Test complete!');
    return results.violations.length;
    
  } catch (error) {
    console.error('❌ Error running accessibility tests:', error);
    return 1;
  } finally {
    await browser.close();
  }
}

if (require.main === module) {
  runAccessibilityTests()
    .then(violationCount => {
      process.exit(violationCount);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { runAccessibilityTests };
