# Package Upgrade Matrix

This document categorizes all outdated packages and provides upgrade guidance for each.

## Core Framework Packages

### React Ecosystem

| Package            | Current | Target | Semver Type | Breaking Changes                                                                                   | Migration Notes                                                                                                           |
| ------------------ | ------- | ------ | ----------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `react`            | 18.3.1  | 19.1.0 | **MAJOR**   | [React 19 Breaking Changes](https://react.dev/blog/2024/04/25/react-19#breaking-changes)           | React 19 removes deprecated APIs, changes event handling, and updates type definitions. Test thoroughly before upgrading. |
| `react-dom`        | 18.3.1  | 19.1.0 | **MAJOR**   | [React DOM 19 Changes](https://react.dev/blog/2024/04/25/react-19#react-dom)                       | Concurrent with React 19 changes. New hydration behavior and SSR improvements.                                            |
| `@types/react`     | 18.3.23 | 19.1.8 | **MAJOR**   | [Type Changes](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react)         | Major type definition updates for React 19. May require code changes for stricter typing.                                 |
| `@types/react-dom` | 18.3.7  | 19.1.6 | **MAJOR**   | [DOM Type Changes](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react-dom) | Updated types for React DOM 19. Review component prop types.                                                              |

### Next.js Framework

| Package | Current | Target | Semver Type | Breaking Changes                                                            | Migration Notes                                                                        |
| ------- | ------- | ------ | ----------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `next`  | 14.2.30 | 15.4.4 | **MAJOR**   | [Next.js 15 Breaking Changes](https://nextjs.org/docs/upgrading/version-15) | App Router changes, Node.js 18+ required, updated caching behavior, API route changes. |

### Styling Framework

| Package       | Current | Target | Semver Type | Breaking Changes                                                | Migration Notes                                                                                                 |
| ------------- | ------- | ------ | ----------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `tailwindcss` | 3.4.17  | 4.1.11 | **MAJOR**   | [Tailwind CSS v4 Changes](https://tailwindcss.com/docs/v4-beta) | Major architectural changes, new CSS engine, configuration format changes. Consider staying on v3 until stable. |

### ESLint Core

| Package  | Current | Target | Semver Type | Breaking Changes                                                                | Migration Notes                                                |
| -------- | ------- | ------ | ----------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `eslint` | 8.57.1  | 9.32.0 | **MAJOR**   | [ESLint 9 Migration Guide](https://eslint.org/docs/latest/use/migrate-to-9.0.0) | Flat config required, Node.js 18+ required, some rule changes. |

## Tooling Packages

### ESLint Ecosystem

| Package                            | Current | Target | Semver Type | Breaking Changes                                                                                  | Migration Notes                                            |
| ---------------------------------- | ------- | ------ | ----------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `@typescript-eslint/eslint-plugin` | 6.21.0  | 8.38.0 | **MAJOR**   | [TypeScript ESLint v8 Changes](https://typescript-eslint.io/blog/announcing-typescript-eslint-v8) | Requires ESLint 9, rule updates, TypeScript 4.8+ required. |
| `@typescript-eslint/parser`        | 6.21.0  | 8.38.0 | **MAJOR**   | [Parser v8 Changes](https://typescript-eslint.io/packages/parser)                                 | Concurrent with plugin changes. Update both together.      |
| `eslint-config-next`               | 14.2.30 | 15.4.4 | **MAJOR**   | [Next.js ESLint Config Changes](https://nextjs.org/docs/app/api-reference/config/eslint)          | Updates for Next.js 15 and ESLint 9 compatibility.         |
| `eslint-config-prettier`           | 9.1.2   | 10.1.8 | **MAJOR**   | [Config Changes](https://github.com/prettier/eslint-config-prettier/blob/main/CHANGELOG.md)       | Updates for ESLint 9 flat config support.                  |

### Testing Framework

| Package                  | Current | Target | Semver Type | Breaking Changes                           | Migration Notes                                                   |
| ------------------------ | ------- | ------ | ----------- | ------------------------------------------ | ----------------------------------------------------------------- |
| `jest`                   | 29.7.0  | 30.0.5 | **MAJOR**   | [Jest 30 Changes](https://jestjs.io/blog/) | Node.js 18+ required, some API changes, performance improvements. |
| `jest-environment-jsdom` | 29.7.0  | 30.0.5 | **MAJOR**   | Concurrent with Jest 30                    | Update alongside Jest core.                                       |

### Prettier Tooling

| Package                       | Current | Target | Semver Type | Breaking Changes                                                                       | Migration Notes                                 |
| ----------------------------- | ------- | ------ | ----------- | -------------------------------------------------------------------------------------- | ----------------------------------------------- |
| `prettier-plugin-tailwindcss` | 0.5.14  | 0.6.14 | **MINOR**   | [Plugin Changes](https://github.com/tailwindlabs/prettier-plugin-tailwindcss/releases) | Minor updates, check Tailwind v4 compatibility. |

## Miscellaneous Utilities

### Development Types

| Package       | Current | Target | Semver Type | Breaking Changes                                                                                | Migration Notes                                                         |
| ------------- | ------- | ------ | ----------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `@types/node` | 20.19.9 | 24.1.0 | **MAJOR**   | [Node Types Changes](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/node) | Node.js 24 type definitions. Review for new API types and deprecations. |

### UI Components

| Package        | Current | Target  | Semver Type | Breaking Changes                                                 | Migration Notes                                                   |
| -------------- | ------- | ------- | ----------- | ---------------------------------------------------------------- | ----------------------------------------------------------------- |
| `lucide-react` | 0.300.0 | 0.526.0 | **MINOR**   | [Release Notes](https://github.com/lucide-icons/lucide/releases) | Icon additions and improvements. Check for any icon name changes. |

## Upgrade Strategy Recommendations

### Phase 1: Low-Risk Updates

1. `lucide-react` - Safe minor update
2. `@types/node` - Update if using Node.js 24 features
3. `prettier-plugin-tailwindcss` - Minor update, low risk

### Phase 2: Coordinated Major Updates

1. **ESLint Ecosystem** - Update together:
   - `eslint` → 9.32.0
   - `@typescript-eslint/eslint-plugin` → 8.38.0
   - `@typescript-eslint/parser` → 8.38.0
   - `eslint-config-next` → 15.4.4
   - `eslint-config-prettier` → 10.1.8

### Phase 3: Framework Updates (High Risk)

1. **React 19 Upgrade**:
   - `react` → 19.1.0
   - `react-dom` → 19.1.0
   - `@types/react` → 19.1.8
   - `@types/react-dom` → 19.1.6

2. **Next.js 15 Upgrade**:
   - `next` → 15.4.4

3. **Testing Framework**:
   - `jest` → 30.0.5
   - `jest-environment-jsdom` → 30.0.5

### Phase 4: Defer Major Architecture Changes

1. **Tailwind CSS v4** - Consider deferring until stable release
   - `tailwindcss` → Stay on 3.x for now

## Pre-Upgrade Checklist

- [ ] Backup current working state
- [ ] Ensure comprehensive test coverage
- [ ] Review breaking changes documentation for each package
- [ ] Test in development environment first
- [ ] Consider updating Node.js to v18+ (required for many packages)
- [ ] Update CI/CD pipeline configurations if needed

## Notes

- Many packages require Node.js 18+ after upgrade
- ESLint 9 requires flat config format - significant configuration changes needed
- React 19 and Next.js 15 are major releases with significant changes
- Consider upgrading in stages rather than all at once
- Tailwind CSS v4 is still in beta - recommend waiting for stable release
