# Video-Prompt-Builder
A fully responsive, accessible Next.js and TypeScript video prompt builder for AI video models.

## Overview
Video-Prompt-Builder is a modern web application that provides an intuitive interface for creating and managing prompts for AI video generation models. Built with Next.js 14, TypeScript, and Tailwind CSS, it offers a seamless user experience with customizable themes and accessibility features.

## Features
- 🎥 **Prompt Builder**: Interactive interface for crafting video prompts
- 🎨 **Theme System**: Multiple built-in themes with customization options
- 📱 **Responsive Design**: Works seamlessly across all device sizes
- ♿ **Accessibility**: WCAG 2.1 AA compliant with full keyboard navigation
- 🛠️ **Developer Tools**: Comprehensive utilities and helpers
- 📚 **Prompt Library**: Curated collection of effective prompts
- 🔧 **Extensible**: Plugin-based architecture for easy customization

## Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library
- **State Management**: React hooks and context
- **Build Tool**: Turbopack
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
- Node.js 18+ 
- pnpm (recommended package manager)

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

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build application for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint for code quality
- `pnpm lint:fix` - Run ESLint and auto-fix issues
- `pnpm type-check` - Run TypeScript type checking
- `pnpm test` - Run test suite
- `pnpm test:watch` - Run tests in watch mode
- `pnpm clean` - Clean build artifacts and dependencies

### Development Workflow

```bash
# Install dependencies
pnpm install

# Run type checking and linting
pnpm type-check
pnpm lint

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build locally
pnpm start
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and development process.

### Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/Video-Prompt-Builder.git`
3. Install dependencies: `pnpm install`
4. Create a feature branch: `git checkout -b feature/amazing-feature`
5. Make your changes and test: `pnpm dev`
6. Run quality checks: `pnpm lint && pnpm type-check`
7. Commit your changes: `git commit -m 'feat: Add amazing feature'`
8. Push to your branch: `git push origin feature/amazing-feature`
9. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue or contact the maintainers.
