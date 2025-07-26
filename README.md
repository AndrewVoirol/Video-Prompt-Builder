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

## Features
- 🎥 **Prompt Builder**: Interactive interface for crafting video prompts
- 🎨 **Theme System**: Multiple built-in themes with customization options
- 📱 **Responsive Design**: Works seamlessly across all device sizes
- ♿ **Accessibility**: WCAG 2.1 AA compliant with full keyboard navigation
- 🛠️ **Developer Tools**: Comprehensive utilities and helpers
- 📚 **Prompt Library**: Curated collection of effective prompts
- 🔧 **Extensible**: Plugin-based architecture for easy customization

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
- `pnpm test` - Run Jest 30 test suite
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Run tests with coverage report

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
