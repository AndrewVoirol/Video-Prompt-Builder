# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.0] - 2025-01-26

### 🚀 Major Upgrade: React 19 & Next.js 15 Modernization

This release represents a comprehensive modernization of the Video Prompt Builder, upgrading from React 18/Next.js 14 to React 19/Next.js 15 with significant architectural improvements and modern development patterns.

### Added

#### New React 19 Features
- **Server Actions**: Added server-side form handling with `'use server'` directive
  - `savePromptAction` - Server-side prompt saving with validation
  - `generatePromptAction` - Server-side prompt generation
  - `deletePromptAction` - Server-side prompt deletion
  - `exportPromptsAction` - Bulk export functionality
- **React 19 Hooks Implementation**:
  - `useOptimistic` - Instant UI feedback for form submissions
  - `useActionState` - Server action state management
  - Enhanced `useTransition` for concurrent features
- **Server Components**: Added server-only components for improved performance
  - `StaticBadge` - Server component for displaying badges
  - `ProvenanceBadge` - Server component for data source information

#### Enhanced Development Experience
- **Turbopack Integration**: Enabled for development builds (`next dev --turbo`)
- **Comprehensive Test Suite**: Added Jest 30 with React Testing Library
- **Enhanced TypeScript Configuration**: Strict mode options enabled
  - `exactOptionalPropertyTypes: true`
  - `noUncheckedIndexedAccess: true`
- **ESLint 9 Flat Config**: Modern linting configuration
- **Prettier Integration**: Code formatting with TailwindCSS plugin

#### New Scripts and Tooling
- `pnpm build:static` - Static export build
- `pnpm build:export` - Combined build and export
- `pnpm format` / `pnpm format:check` - Code formatting
- `pnpm test:coverage` - Test coverage reports

### Changed

#### Framework Upgrades
- **React**: 18.3.1 → 19.1.0 (Major)
- **React DOM**: 18.3.1 → 19.1.0 (Major)
- **Next.js**: 14.2.30 → 15.4.4 (Major)
- **TailwindCSS**: 3.4.17 → 4.1.11 (Major)

#### Development Dependencies
- **ESLint**: 8.57.1 → 9.32.0 (Major - Flat Config)
- **TypeScript ESLint Plugin**: 6.21.0 → 8.38.0 (Major)
- **TypeScript ESLint Parser**: 6.21.0 → 8.38.0 (Major)
- **Jest**: 29.7.0 → 30.0.5 (Major)
- **@types/node**: 20.19.9 → 24.1.0 (Major)
- **@types/react**: 18.3.23 → 19.1.8 (Major)
- **@types/react-dom**: 18.3.7 → 19.1.6 (Major)

#### Core Dependencies
- **Lucide React**: 0.300.0 → 0.526.0 (Minor)
- **Prettier Plugin TailwindCSS**: 0.5.14 → 0.6.14 (Minor)

#### System Requirements
- **Node.js**: Minimum version increased from 18+ to 20.11.0+
- **Package Manager**: Continued pnpm support with enhanced scripts

#### Component Architecture
- **Theme Provider**: Optimized for React 19 concurrent features
- **Form Components**: Enhanced with `useOptimistic` and `useActionState`
- **Error Boundaries**: Updated for React 19 compatibility
- **Accessibility**: Maintained WCAG 2.1 AA compliance with new patterns

### Fixed

#### TailwindCSS v4 Compatibility
- Fixed invalid utility classes (`border-border`, `bg-background`)
- Updated CSS variables usage in `app/globals.css`
- Replaced custom utilities with standard TailwindCSS classes
- Enhanced component styling for v4 compatibility

#### ESLint Configuration
- Migrated from legacy `.eslintrc.*` to flat config format (`eslint.config.js`)
- Fixed rule conflicts with ESLint 9
- Updated TypeScript ESLint integration

#### Build and Development
- Fixed build failures with updated dependencies
- Resolved TypeScript strict mode errors
- Enhanced development server performance with Turbopack
- Fixed test configuration for Jest 30

### Performance Improvements

#### Bundle Size Reduction
- Server components reduce client-side JavaScript
- Server actions eliminate API route overhead
- Enhanced tree-shaking with React 19
- Optimized theme provider implementation

#### User Experience
- Optimistic updates provide instant feedback
- Better loading states with enhanced `useTransition`
- Improved error handling with server actions
- Faster development builds with Turbopack

#### Developer Experience
- Type-safe server actions
- Better development tooling
- Simplified state management patterns
- Enhanced error messages and debugging

### Documentation

#### Added Documentation
- **UPGRADE-2025.md**: Comprehensive migration guide
- **REACT_19_MODERNIZATION.md**: Detailed modernization documentation
- **upgrade-matrix.md**: Package upgrade matrix and strategy
- Enhanced **README.md** with updated badges and information
- **API Documentation**: Comprehensive component and hook documentation

#### Updated Documentation
- README badges reflect new versions
- Installation and setup instructions updated for Node.js 20.11.0+
- Development workflow documentation enhanced
- Contributing guidelines updated for new tooling

### Migration Notes

#### Breaking Changes
- **Node.js 20.11.0+** required (previously 18+)
- **React 19** breaking changes addressed:
  - Updated component interfaces
  - Changed form submission patterns
  - Enhanced concurrent features
- **Next.js 15** changes:
  - App Router behavioral updates
  - Caching mechanism changes
  - Build process modifications
- **ESLint 9** requires flat config format
- **TailwindCSS v4** architectural changes

#### Compatibility
- Maintained backward compatibility where possible
- Gradual migration approach for testing
- Fallback patterns for unsupported features

### Testing

#### Enhanced Test Coverage
- React 19 server actions testing
- Optimistic updates verification
- Concurrent features behavior testing
- Cross-browser compatibility checks
- Accessibility testing with updated patterns

#### Test Infrastructure
- Jest 30 with enhanced performance
- React Testing Library updated for React 19
- Coverage reporting improvements
- Watch mode enhancements

### Security

#### Updated Dependencies
- All dependencies updated to latest secure versions
- Removed deprecated packages
- Enhanced security with server actions
- Improved type safety with stricter TypeScript

## [1.0.0] - 2024-12-XX

### Added
- Initial release of Video Prompt Builder
- React 18 and Next.js 14 foundation
- TailwindCSS styling system
- Accessibility features (WCAG 2.1 AA)
- Theme system with multiple themes
- Responsive design for all devices
- Component library with reusable UI components
- Developer tools and utilities
- Prompt library with curated examples
- Plugin-based architecture

### Features
- Interactive prompt builder interface
- Real-time preview functionality
- Export and import capabilities
- Theme customization
- Keyboard navigation support
- Screen reader compatibility
- Mobile-first responsive design

---

## Version History Legend

- 🚀 **Major Release**: Significant features and breaking changes
- ✨ **Minor Release**: New features, backward compatible
- 🐛 **Patch Release**: Bug fixes and minor improvements
- 📚 **Documentation**: Documentation updates
- 🔧 **Development**: Development experience improvements
- 🔒 **Security**: Security updates and fixes

---

For detailed migration instructions, see [UPGRADE-2025.md](UPGRADE-2025.md).

For React 19 specific changes, see [REACT_19_MODERNIZATION.md](REACT_19_MODERNIZATION.md).
