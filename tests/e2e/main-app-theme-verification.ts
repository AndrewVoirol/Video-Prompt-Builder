import puppeteer from 'puppeteer';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __dirname = process.cwd();

interface TestResult {
  theme: string;
  mode: 'light' | 'dark';
  screenshot: string;
  success: boolean;
  error?: string;
}

async function captureMainAppScreenshots(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  const themes = ['mono', 'kodama-grove', 'cyber-punk'];
  const modes: ('light' | 'dark')[] = ['light', 'dark'];
  
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-web-security',
      '--font-render-hinting=none',
      '--disable-features=TranslateUI',
      '--disable-ipc-flooding-protection',
    ]
  });

  try {
    const page = await browser.newPage();
    
    // Set viewport for consistent screenshots
    await page.setViewport({ 
      width: 1440, 
      height: 900,
      deviceScaleFactor: 1
    });

    console.log('🚀 Testing main application at http://localhost:3000');
    
    // Navigate to main application
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });

    // Wait for the app to fully load
    await page.waitForSelector('[data-theme]', { timeout: 10000 });

    for (const theme of themes) {
      for (const mode of modes) {
        const testName = `${theme}-${mode}`;
        console.log(`📸 Capturing ${testName}...`);

        try {
          // Set theme via data attribute
          await page.evaluate(({ theme, mode }) => {
            document.documentElement.setAttribute('data-theme', theme);
            if (mode === 'dark') {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          }, { theme, mode });

          // Wait for theme transition to complete
          await new Promise(resolve => setTimeout(resolve, 200));

          // Ensure all elements are loaded
          await page.waitForFunction(() => {
            const computedStyle = window.getComputedStyle(document.documentElement);
            const bgColor = computedStyle.getPropertyValue('--background');
            return bgColor && bgColor.trim() !== '';
          });

          // Ensure screenshots directory exists
          const screenshotsDir = join(__dirname, 'tests', 'e2e', 'screenshots');
          if (!existsSync(screenshotsDir)) {
            mkdirSync(screenshotsDir, { recursive: true });
          }

          // Take screenshot
          const screenshotPath = join(screenshotsDir, `main-app-${testName}.png`);
          await page.screenshot({
            path: screenshotPath as `${string}.png`,
            fullPage: true
          });

          results.push({
            theme,
            mode,
            screenshot: `main-app-${testName}.png`,
            success: true
          });

          console.log(`✅ ${testName} captured successfully`);

        } catch (error) {
          console.error(`❌ Failed to capture ${testName}:`, error);
          results.push({
            theme,
            mode,
            screenshot: '',
            success: false,
            error: error instanceof Error ? error.message : String(error)
          });
        }
      }
    }

  } finally {
    await browser.close();
  }

  return results;
}

async function generateReport(results: TestResult[]) {
  const reportPath = join(__dirname, 'tests', 'e2e', 'screenshots', 'MAIN_APP_TEST_REPORT.md');
  const timestamp = new Date().toISOString();
  
  const report = `# Main Application Theme Verification Report

**Generated:** ${timestamp}  
**Test Objective:** Verify Mono theme implementation against tweakcn standards  
**Application URL:** http://localhost:3000

## 🎯 Test Results Summary

| Theme | Light Mode | Dark Mode | Status |
|-------|------------|-----------|---------|
${results.reduce((acc, result, index) => {
  if (index % 2 === 0) {
    const lightResult = result;
    const darkResult = results[index + 1];
    const lightStatus = lightResult.success ? '✅' : '❌';
    const darkStatus = darkResult?.success ? '✅' : '❌';
    return acc + `| **${lightResult.theme}** | ${lightStatus} | ${darkStatus} | ${lightResult.success && darkResult?.success ? 'Pass' : 'Fail'} |\n`;
  }
  return acc;
}, '')}

## 📸 Screenshots Generated

${results.map(result => 
  result.success 
    ? `- **${result.theme} (${result.mode}):** \`${result.screenshot}\``
    : `- **${result.theme} (${result.mode}):** ❌ Failed - ${result.error}`
).join('\n')}

## 🔍 Next Steps

1. **Visual Comparison:** Use the HTML viewer to compare against tweakcn reference
2. **Pixel Analysis:** Check for consistency in:
   - Typography (Geist Mono font loading)
   - Colors (OKLCH values)
   - Spacing (4px baseline grid)
   - Borders (0rem radius for Mono theme)
   - Shadows (disabled/transparent)
3. **Manual QA:** Test on Safari/Chrome for cross-browser compatibility

## 🚨 Focus Areas for Mono Theme

- **Sharp edges:** All components should have 0rem border-radius
- **Flat design:** No shadows or minimal border-like shadows
- **Monospace typography:** Geist Mono everywhere
- **Achromatic colors:** Only grays (OKLCH with 0 chroma)
- **Consistent spacing:** 4px baseline grid alignment

---
*Report generated by main-app-theme-verification.ts*
`;

  // Write report to file
  const fs = await import('fs/promises');
  await fs.writeFile(reportPath, report, 'utf-8');
  console.log(`📋 Report saved to: ${reportPath}`);
}

// Main execution
if (require.main === module) {
  captureMainAppScreenshots()
    .then(results => {
      console.log(`\n🎉 Test completed! Captured ${results.filter(r => r.success).length}/${results.length} screenshots`);
      return generateReport(results);
    })
    .catch(error => {
      console.error('❌ Test failed:', error);
      process.exit(1);
    });
}

export { captureMainAppScreenshots, generateReport };
