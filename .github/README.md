# CI/CD Configuration

This directory contains GitHub Actions workflows for the Video Prompt Builder project.

## Workflows

### 1. CI/CD Pipeline (`ci.yml`)

Main continuous integration and deployment workflow that runs on every push and pull request to the `main` branch.

**Features:**
- ✅ **Node.js 20.x** - Updated to use the latest LTS version
- ✅ **pnpm store caching** - Efficient dependency caching using pnpm store path
- ✅ **Quality gates** - Lint, type-check, and test jobs must pass before deployment
- ✅ **Build verification** - Ensures `next build` works correctly
- ✅ **Artifact handling** - Build artifacts are uploaded and reused in deployment

**Jobs:**
1. **lint** - Runs ESLint with zero warnings policy
2. **type-check** - Validates TypeScript compilation
3. **test** - Runs Jest tests with coverage reporting
4. **build** - Builds the Next.js application (depends on quality gates)
5. **deploy** - Deploys to production (only on main branch pushes)

### 2. Static Export Deployment (`deploy-static.yml`)

Alternative workflow for deploying static exports to GitHub Pages.

**Features:**
- ✅ **Static export support** - Uses `next build && next export` workflow
- ✅ **GitHub Pages deployment** - Automatic deployment to GitHub Pages
- ✅ **Same quality gates** - Maintains lint/type-check/test requirements
- ✅ **Manual trigger** - Can be triggered manually via workflow_dispatch

## Configuration Files

### `next.config.static.js`
Special Next.js configuration for static export builds:
- Enables `output: 'export'`
- Sets `images.unoptimized: true` for static compatibility
- Adds `trailingSlash: true` for better static hosting

### Package.json Scripts
Added convenience scripts:
- `build:static` - Builds using static export configuration
- `export` - Runs Next.js export command
- `build:export` - Combined build and export for static sites

## Requirements Compliance

✅ **Node version 20.x** - All workflows use `node-version: '20.x'`  
✅ **pnpm store caching** - Implemented via `pnpm store path` and GitHub Actions cache  
✅ **Build commands work** - Both `next build` and `next build && next export` supported  
✅ **Quality gates** - Lint, type-check, and test jobs block deployment  

## Usage

### Regular Deployment (SSR/SSG)
Pushes to `main` branch automatically trigger the CI/CD pipeline (`ci.yml`).

### Static Export Deployment
For static hosting (GitHub Pages), use the `deploy-static.yml` workflow:
1. Enable GitHub Pages in repository settings
2. Push to `main` branch or manually trigger the workflow
3. The site will be available at your GitHub Pages URL

### Local Development
```bash
# Regular development
pnpm dev

# Test the build process
pnpm run build
pnpm start

# Test static export
pnpm run build:export
# Static files will be in ./out directory
```

## Customization

### Deployment Targets
The main CI/CD workflow (`ci.yml`) includes a placeholder deployment step. Replace the deploy job with your specific deployment commands:

- **Vercel**: `npx vercel --prod --token ${{ secrets.VERCEL_TOKEN }}`
- **Netlify**: Use `netlify-cli` or Netlify's GitHub integration
- **AWS/Azure/GCP**: Add appropriate deployment steps

### Environment Variables
Add required secrets in GitHub repository settings:
- Deployment tokens
- API keys
- Environment-specific configuration

## Troubleshooting

### Build Failures
1. Check Node.js version compatibility
2. Verify all dependencies are in `package.json`
3. Ensure TypeScript compilation passes locally

### Static Export Issues
1. Verify no server-side features are used
2. Check image optimization settings
3. Ensure all paths are relative or use `basePath`

### Cache Issues
1. Clear pnpm cache: delete cache keys in GitHub Actions
2. Update lock file: `pnpm install --frozen-lockfile=false`
