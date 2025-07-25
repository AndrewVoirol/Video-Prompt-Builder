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
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/AndrewVoirol/Video-Prompt-Builder.git
cd Video-Prompt-Builder

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks
- `npm test` - Run tests

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and development process.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue or contact the maintainers.
