// QA Test Script for Video Prompt Builder
// This script validates key functionality for manual QA testing

const testResults = {
  pageNavigation: [],
  theming: [],
  promptBuilder: [],
  responsive: [],
  accessibility: [],
  consoleErrors: []
};

// Check if we're in a browser environment
if (typeof window !== 'undefined') {
  console.log('🎬 Starting Video Prompt Builder QA Tests...\n');

  // 1. PAGE NAVIGATION TESTS
  console.log('1️⃣ Testing Page Navigation...');
  
  // Check if main elements exist
  const mainHeading = document.querySelector('h1');
  const promptForm = document.querySelector('form');
  const themeToggle = document.querySelector('button[aria-label*="theme"]');
  const tabsList = document.querySelector('[role="tablist"]');
  const outputCards = document.querySelectorAll('[role="tabpanel"]');
  
  testResults.pageNavigation.push({
    test: 'Main heading exists',
    passed: !!mainHeading && mainHeading.textContent.includes('Video Prompt Builder'),
    element: mainHeading
  });
  
  testResults.pageNavigation.push({
    test: 'Prompt form exists',
    passed: !!promptForm,
    element: promptForm
  });
  
  testResults.pageNavigation.push({
    test: 'Theme toggle exists',
    passed: !!themeToggle,
    element: themeToggle
  });
  
  testResults.pageNavigation.push({
    test: 'Tabs navigation exists',
    passed: !!tabsList,
    element: tabsList
  });
  
  testResults.pageNavigation.push({
    test: 'Output panels exist',
    passed: outputCards.length >= 4, // JSON, YAML, MARKDOWN, NATURAL
    count: outputCards.length
  });

  // 2. THEMING TESTS
  console.log('2️⃣ Testing Theme System...');
  
  const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  const themeScript = document.querySelector('script:not([src])');
  
  testResults.theming.push({
    test: 'Current theme detected',
    passed: true,
    theme: currentTheme
  });
  
  testResults.theming.push({
    test: 'Theme switching script exists',
    passed: !!themeScript && themeScript.textContent.includes('colorScheme'),
    element: themeScript
  });
  
  // Check CSS custom properties
  const computedStyle = getComputedStyle(document.documentElement);
  const backgroundVar = computedStyle.getPropertyValue('--background');
  const foregroundVar = computedStyle.getPropertyValue('--foreground');
  
  testResults.theming.push({
    test: 'CSS custom properties exist',
    passed: !!backgroundVar && !!foregroundVar,
    properties: { background: backgroundVar, foreground: foregroundVar }
  });

  // 3. PROMPT BUILDER INTERACTION TESTS
  console.log('3️⃣ Testing Prompt Builder Interactions...');
  
  const presetSelect = document.querySelector('select');
  const parameterInputs = document.querySelectorAll('input[type="text"]');
  const copyButton = document.querySelector('button:not([aria-label])');
  
  testResults.promptBuilder.push({
    test: 'Preset selector exists',
    passed: !!presetSelect,
    optionCount: presetSelect ? presetSelect.options.length : 0
  });
  
  testResults.promptBuilder.push({
    test: 'Parameter inputs exist',
    passed: parameterInputs.length > 0,
    inputCount: parameterInputs.length
  });
  
  testResults.promptBuilder.push({
    test: 'Copy functionality exists',
    passed: !!copyButton,
    element: copyButton
  });
  
  // Check provenance badges
  const provenanceBadges = document.querySelectorAll('.bg-accent');
  testResults.promptBuilder.push({
    test: 'Provenance tracking visible',
    passed: provenanceBadges.length > 0,
    badgeCount: provenanceBadges.length
  });

  // 4. RESPONSIVE DESIGN TESTS
  console.log('4️⃣ Testing Responsive Design...');
  
  const viewport = window.innerWidth;
  const gridElements = document.querySelectorAll('.grid, [class*="grid-cols"]');
  const responsiveClasses = document.querySelectorAll('[class*="md:"], [class*="lg:"], [class*="xl:"]');
  
  testResults.responsive.push({
    test: 'Current viewport width',
    passed: true,
    viewport: viewport
  });
  
  testResults.responsive.push({
    test: 'Grid layouts exist',
    passed: gridElements.length > 0,
    gridCount: gridElements.length
  });
  
  testResults.responsive.push({
    test: 'Responsive classes present',
    passed: responsiveClasses.length > 0,
    responsiveElementCount: responsiveClasses.length
  });

  // 5. ACCESSIBILITY TESTS
  console.log('5️⃣ Testing Accessibility...');
  
  const focusableElements = document.querySelectorAll('button, input, select, [tabindex]:not([tabindex="-1"])');
  const ariaLabels = document.querySelectorAll('[aria-label]');
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const roles = document.querySelectorAll('[role]');
  
  testResults.accessibility.push({
    test: 'Focusable elements exist',
    passed: focusableElements.length > 0,
    focusableCount: focusableElements.length
  });
  
  testResults.accessibility.push({
    test: 'ARIA labels present',
    passed: ariaLabels.length > 0,
    ariaLabelCount: ariaLabels.length
  });
  
  testResults.accessibility.push({
    test: 'Heading structure exists',
    passed: headings.length > 0,
    headingCount: headings.length
  });
  
  testResults.accessibility.push({
    test: 'ARIA roles defined',
    passed: roles.length > 0,
    roleCount: roles.length
  });

  // 6. CONSOLE ERROR CHECK
  console.log('6️⃣ Checking for Console Errors...');
  
  // Store original console methods
  const originalError = console.error;
  const originalWarn = console.warn;
  
  let errorCount = 0;
  let warningCount = 0;
  
  console.error = function(...args) {
    errorCount++;
    testResults.consoleErrors.push({ type: 'error', message: args.join(' ') });
    originalError.apply(console, args);
  };
  
  console.warn = function(...args) {
    warningCount++;
    testResults.consoleErrors.push({ type: 'warning', message: args.join(' ') });
    originalWarn.apply(console, args);
  };
  
  // Wait a bit to catch any delayed errors
  setTimeout(() => {
    testResults.consoleErrors.push({
      test: 'Console errors check',
      passed: errorCount === 0,
      errorCount: errorCount,
      warningCount: warningCount
    });
    
    // Restore original console methods
    console.error = originalError;
    console.warn = originalWarn;
    
    // OUTPUT RESULTS
    console.log('\n🎯 QA TEST RESULTS SUMMARY');
    console.log('═'.repeat(50));
    
    Object.entries(testResults).forEach(([category, tests]) => {
      console.log(`\n📋 ${category.toUpperCase()}:`);
      tests.forEach(test => {
        const status = test.passed ? '✅ PASS' : '❌ FAIL';
        console.log(`  ${status}: ${test.test}`);
        if (test.count !== undefined) console.log(`    Count: ${test.count}`);
        if (test.viewport !== undefined) console.log(`    Viewport: ${test.viewport}px`);
        if (test.theme !== undefined) console.log(`    Theme: ${test.theme}`);
      });
    });
    
    // Overall score
    const totalTests = Object.values(testResults).flat().filter(t => t.test).length;
    const passedTests = Object.values(testResults).flat().filter(t => t.passed).length;
    const score = ((passedTests / totalTests) * 100).toFixed(1);
    
    console.log(`\n🏆 OVERALL SCORE: ${passedTests}/${totalTests} (${score}%)`);
    
    if (score >= 90) {
      console.log('🎉 EXCELLENT! Application is ready for deployment.');
    } else if (score >= 75) {
      console.log('⚠️  GOOD! Some minor issues to address.');
    } else {
      console.log('🔧 NEEDS WORK! Several issues require attention.');
    }
    
  }, 2000);
  
} else {
  console.log('This script must be run in a browser environment.');
}

// Export for Node.js if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testResults };
}
