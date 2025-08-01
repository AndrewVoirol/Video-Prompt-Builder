# Video-Prompt-Builder

[![Next.js](https://img.shields.io/badge/Next.js-15.4.4-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.11-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20.11.0+-green?logo=node.js)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A fully responsive, accessible Next.js and TypeScript video prompt builder for AI video models.

## Overview

Video-Prompt-Builder is a modern web application that provides an intuitive interface for creating and managing prompts for AI video generation models. Built with Next.js 15, React 19, and TailwindCSS 4, it offers a seamless user experience with customizable themes and accessibility features.

## Screenshots

### Light Theme

![Light Theme](public/screenshots/light-theme.png)
_The application in light mode with clean, modern styling_

### Dark Theme

![Dark Theme](public/screenshots/dark-theme.png)
_Dark mode provides comfortable viewing in low-light environments_

### Cyberpunk Theme

![Cyberpunk Theme](public/screenshots/cyberpunk-theme.png)
_Vibrant neon colors for a futuristic aesthetic_

### Kodama Grove Theme

![Kodama Grove Theme](public/screenshots/kodama-grove-theme.png)
_Nature-inspired green theme for a calming experience_

_Note: Screenshots should be placed in the `public/screenshots/` directory. To take screenshots, run `pnpm dev` and navigate to `http://localhost:3000`, then switch between themes and capture the interface._

## Features

- 🎥 **Prompt Builder**: Interactive interface for crafting video prompts
- 🎨 **Theme System**: Multiple built-in themes with customization options, including light, dark, system, cyberpunk, and kodama grove themes.
- 📱 **Responsive Design**: Works seamlessly across all device sizes
- ♿ **Accessibility**: WCAG 2.1 AA compliant with full keyboard navigation
- 🛠️ **Developer Tools**: Comprehensive utilities and helpers
- 📚 **Prompt Library**: Curated collection of effective prompts
- 🔧 **Extensible**: Plugin-based architecture for easy customization

## Theme System Documentation

### Overview

The application features a sophisticated dual-axis theme system that supports both theme selection (color schemes) and dark/light mode toggling. This system is built on CSS custom properties (variables) and provides seamless theme switching with smooth transitions.

### Architecture

#### 1. **Theme Provider (`app/providers.tsx`)**
- Manages theme state using React Context
- Handles both color scheme selection and dark mode toggling
- Persists user preferences to localStorage
- Applies theme attributes to the document root:
  - `data-theme`: Sets the color scheme (e.g., "monogeist", "cyberpunk")
  - `class`: Adds "dark" class for dark mode

#### 2. **CSS Variables (`app/globals.css`)**
- Defines theme tokens using CSS custom properties
- Each theme has light and dark mode variants
- Variables are scoped under `:root[data-theme="theme-name"]` and `.dark` selectors
- Includes comprehensive design tokens:
  - **Colors**: Background, foreground, card, popover, muted, accent colors
  - **Typography**: Font families, sizes, weights, line heights
  - **Shadows**: Multiple elevation levels (xs to 2xl)
  - **Borders**: Border colors, radius scales
  - **Surfaces**: Specialized surface colors for different UI contexts

#### 3. **Theme Configuration (`lib/constants.ts`)**
```typescript
export const THEMES = [
  { id: "tweakcn", name: "Primary", icon: "🎨" },
  { id: "monogeist", name: "MonoGeist", icon: "⚡" },
  { id: "cyberpunk", name: "Cyberpunk", icon: "🌆" },
  { id: "kodama-grove", name: "Kodama Grove", icon: "🌿" }
];
```

### Available Themes

1. **Primary (tweakcn)** 🎨
   - Clean, modern design system
   - Optimized for readability
   - Professional color palette

2. **MonoGeist** ⚡
   - Monospace typography throughout
   - High contrast design
   - Developer-focused aesthetic
   - Sharp corners (0 border radius)

3. **Cyberpunk** 🌆
   - Neon color palette
   - Vibrant pink and cyan accents
   - Futuristic visual style
   - High visual impact

4. **Kodama Grove** 🌿
   - Nature-inspired green palette
   - Calming, organic feel
   - Soft, earthy tones
   - Rounded corners

### How to Use Themes in Components

#### Basic Usage
```tsx
// Components automatically inherit theme variables
<div className="bg-background text-foreground">
  <Card className="bg-card border-border shadow-md">
    Content
  </Card>
</div>
```

#### Using CSS Variables Directly
```tsx
// For custom surface colors
<div className="bg-[var(--surface-elevated)] shadow-lg">
  Elevated content
</div>

// For theme-specific styling
<button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Action
</button>
```

#### Overlay Components
Use the shared overlay helper for consistent styling:
```tsx
import { overlayStyles } from '@/lib/overlay';

// In your component
<PopoverContent className={overlayStyles.popover()}>
  Content
</PopoverContent>
```

### Adding a New Theme

1. **Define the theme in CSS** (`app/globals.css`):
```css
:root[data-theme="your-theme"] {
  /* Light mode colors */
  --background: 0 0% 100%;
  --foreground: 0 0% 0%;
  /* ... all other variables */
}

:root[data-theme="your-theme"].dark {
  /* Dark mode colors */
  --background: 0 0% 9%;
  --foreground: 0 0% 95%;
  /* ... all other variables */
}
```

2. **Add theme configuration** (`lib/constants.ts`):
```typescript
export const THEMES = [
  // ... existing themes
  { id: "your-theme", name: "Your Theme", icon: "🎯" }
];
```

3. **Test your theme** at `/theme-test`:
- Navigate to the theme test page
- Select your new theme
- Toggle dark/light modes
- Verify all components render correctly

### Theme Variables Reference

#### Core Colors
- `--background`: Main background color
- `--foreground`: Main text color
- `--card`: Card background color
- `--card-foreground`: Card text color
- `--popover`: Popover background
- `--popover-foreground`: Popover text
- `--primary`: Primary brand color
- `--primary-foreground`: Text on primary
- `--secondary`: Secondary brand color
- `--muted`: Muted backgrounds
- `--accent`: Accent color for highlights
- `--destructive`: Error/danger color

#### Surface Colors
- `--surface-base`: Base surface
- `--surface-card`: Card surfaces
- `--surface-panel`: Panel backgrounds
- `--surface-overlay`: Modal overlays
- `--surface-popover`: Popover backgrounds
- `--surface-elevated`: Elevated surfaces
- `--surface-tooltip`: Tooltip backgrounds

#### Typography
- `--font-family-sans`: Sans-serif font stack
- `--font-family-mono`: Monospace font stack
- `--font-size-*`: Font size scale (xs to 2xl)
- `--font-weight-*`: Font weight scale
- `--line-height-*`: Line height scale

#### Effects
- `--shadow-*`: Shadow elevation scale (xs to 2xl)
- `--radius-*`: Border radius scale (sm to 2xl)
- `--ring`: Focus ring color
- `--ring-offset`: Ring offset for focus states

### Dark Mode Implementation

1. **Automatic OS Detection**: Respects system preferences
2. **Manual Toggle**: Users can override with theme selector
3. **Smooth Transitions**: CSS transitions for theme changes
4. **Persistent State**: Preferences saved to localStorage

### Best Practices

1. **Always use theme variables** instead of hard-coded colors
2. **Test in all themes** before committing changes
3. **Use semantic color names** (e.g., `bg-card` not `bg-white`)
4. **Leverage the overlay helper** for consistent elevated surfaces
5. **Respect dark mode** by testing both light and dark variants
6. **Use proper contrast ratios** for accessibility

### Theme Testing

A comprehensive theme testing page is available at `/theme-test` that showcases:
- All UI components in different states
- Theme switching functionality
- Dark/light mode toggling
- Color palette display
- Typography samples
- Interactive component demos

### Troubleshooting

**Theme not applying?**
- Check that ThemeProvider wraps your app
- Verify CSS variables are loaded
- Clear localStorage and refresh

**Colors look wrong?**
- Ensure you're using HSL format in CSS variables
- Check for typos in variable names
- Verify dark mode class is applied correctly

**Component styling issues?**
- Use theme variables instead of Tailwind colors
- Check for hard-coded color values
- Test in all themes to identify issues

## Tech Stack

- **Framework**: Next.js 15 with enhanced App Router
- **Language**: TypeScript 5.8.3
- **UI Library**: React 19 with Server Components
- **Styling**: TailwindCSS 4.1.11
- **UI Components**: Custom component library with Radix UI primitives
- **State Management**: React hooks, context, and Server Actions
- **Build Tool**: Turbopack (development) / Webpack (production)
- **Testing**: Jest 30 + React Testing Library
- **Deployment**: Vercel (recommended)

## Project Structure

```
video-prompt-builder/
├── app/                    # Next.js app directory
├── components/             # Reusable UI components
├── lib/                   # Core utilities and configurations
├── tools/                 # Development and build tools
├── prompts/              # Prompt templates and examples
├── themes/               # Theme configurations and assets
├── public/               # Static assets
├── docs/                 # Documentation
└── tests/                # Test files
```

## Getting Started

### Prerequisites

- **Node.js 20.11.0+** (required for React 19 and Next.js 15)
- **pnpm** (recommended package manager)
- **Git** (for version control)

### Quick Start with pnpm

```bash
# Clone the repository
git clone https://github.com/AndrewVoirol/Video-Prompt-Builder.git
cd Video-Prompt-Builder

# Install dependencies with pnpm
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

All scripts are optimized for pnpm:

### Development

- `pnpm dev` - Start development server with Turbopack and hot reload
- `pnpm build` - Build application for production with Next.js 15
- `pnpm build:static` - Build static export version
- `pnpm build:export` - Build and export static files
- `pnpm start` - Start production server

### Code Quality

- `pnpm lint` - Run ESLint 9 with flat config for code quality
- `pnpm lint:fix` - Run ESLint and auto-fix issues
- `pnpm type-check` - Run TypeScript type checking
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting

### Testing

#### Unit Tests
- `pnpm test` - Run Jest 30 test suite
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Run tests with coverage report

#### E2E Theme Tests
- `pnpm test:e2e` - Run automated theme switching tests
- **View Results**: Open `tests/e2e/screenshots/viewer.html` in your browser
- **Kill Processes**: Run `./scripts/kill-test-processes.sh` if tests get stuck

The E2E tests automatically:
- Launch a headless browser via Puppeteer MCP
- Test all three themes (MonoGeist, Kodama Grove, Cyberpunk)  
- Verify both light and dark mode for each theme
- Capture before/after screenshots for visual regression
- Verify DOM state and proper theme application
- Generate 12 screenshots total (3 themes × 2 modes × 2 states)

### Warp MCP Tools Configuration and Usage

1. **Install development dependencies**:
   ```bash
   pnpm i
   ```

2. **Add MCP server to Warp**:
   Add the MCP server using the configuration located at `docs/warp-mcp-config.json`
   Follow the instructions in [Warp MCP Documentation](https://docs.warp.dev/knowledge-and-collaboration/mcp) to configure your MCP server.

3. **Run automated tests**:
   ```bash
   pnpm test:e2e
   ```
   - Screenshots are saved under `tests/e2e/screenshots/`
   - Console logs are streamed to terminal

4. **Cleanup**: Press `Ctrl-C` anytime to tear everything down

### Utilities

- `pnpm clean` - Clean build artifacts and dependencies
- `pnpm export` - Export static Next.js build

### Development Workflow

```bash
# Install dependencies
pnpm install

# Run comprehensive checks
pnpm type-check    # TypeScript type checking
pnpm lint          # ESLint 9 with flat config
pnpm format:check  # Prettier formatting check

# Start development server with Turbopack
pnpm dev

# Run tests
pnpm test          # Jest 30 test suite
pnpm test:coverage # With coverage report

# Build for production
pnpm build

# Preview production build locally
pnpm start
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and development process.

### Development Setup

1. **Prerequisites**: Ensure Node.js 20.11.0+ is installed
2. Fork the repository
3. Clone your fork: `git clone https://github.com/YOUR_USERNAME/Video-Prompt-Builder.git`
4. Install dependencies: `pnpm install`
5. Create a feature branch: `git checkout -b feature/amazing-feature`
6. Make your changes and test: `pnpm dev`
7. Run comprehensive checks:
   ```bash
   pnpm type-check    # TypeScript checking
   pnpm lint          # ESLint 9 linting
   pnpm test          # Jest 30 tests
   pnpm format:check  # Code formatting
   ```
8. Commit your changes: `git commit -m 'feat: Add amazing feature'`
9. Push to your branch: `git push origin feature/amazing-feature`
10. Open a Pull Request

### Migration Notes

- See [UPGRADE-2025.md](UPGRADE-2025.md) for breaking changes and migration guide
- Project uses React 19 and Next.js 15 - review documentation for new patterns
- ESLint 9 uses flat config format - legacy configs not supported

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue or contact the maintainers.
