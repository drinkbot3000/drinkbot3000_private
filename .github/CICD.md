# CI/CD Documentation

This document describes the continuous integration and deployment setup for DrinkBot3000.

## Overview

Our CI/CD pipeline includes:
- ✅ Node.js version validation
- 🔒 Security scanning
- 📦 Bundle size monitoring
- 🎯 Performance budgets
- 🧪 Automated testing

## Workflows

### 1. CI Workflow (`.github/workflows/ci.yml`)

Main continuous integration workflow that runs on every push and pull request.

**Jobs:**
- **nvmrc-validation**: Validates that the Node.js version matches `.nvmrc`
- **build-and-test**: Builds the application and runs tests

**Triggers:**
- Push to `main` branch
- Push to `claude/**` branches
- Pull requests to `main`

### 2. Security Checks (`.github/workflows/security.yml`)

Scans dependencies for known vulnerabilities.

**Jobs:**
- **dependency-scan**: Runs `npm audit` and fails on high/critical vulnerabilities
- **dependency-review**: Reviews dependency changes in PRs

**Triggers:**
- Push to `main` branch
- Push to `claude/**` branches
- Pull requests to `main`
- Daily at 9:00 AM UTC (scheduled)

**Failure Conditions:**
- Any critical vulnerabilities found
- Any high vulnerabilities found

### 3. Bundle Size Check (`.github/workflows/bundle-size.yml`)

Monitors bundle sizes and ensures they stay within acceptable limits.

**Jobs:**
- **bundle-size**: Analyzes build output and reports bundle sizes

**Triggers:**
- Push to `main` branch
- Pull requests to `main`

**Limits:**
- Main bundle: 500KB
- Comments on PRs with bundle size report

### 4. Performance Budget Check (`.github/workflows/performance.yml`)

Enforces performance budgets for various resource types.

**Jobs:**
- **performance-budget**: Checks all bundles against defined budgets

**Triggers:**
- Push to `main` branch
- Pull requests to `main`

**Budget Limits (configurable in `performance-budget.json`):**
- Main Bundle: 500KB
- Chunk Bundle: 250KB
- CSS Bundle: 100KB
- Total Size: 1000KB

## Performance Budget Configuration

The `performance-budget.json` file defines:

### Resource Size Budgets
- Scripts: 500KB
- Total: 1000KB
- Stylesheets: 100KB
- Images: 300KB
- Fonts: 150KB

### Resource Count Budgets
- Scripts: 10 files
- Stylesheets: 5 files
- Images: 20 files

### Performance Thresholds
- **FCP** (First Contentful Paint): 1800ms
- **LCP** (Largest Contentful Paint): 2500ms
- **TBT** (Total Blocking Time): 300ms
- **CLS** (Cumulative Layout Shift): 0.1
- **SI** (Speed Index): 3400ms

## Node.js Version Management

The project uses `.nvmrc` to specify the required Node.js version (currently v22).

**Best Practices:**
1. Always use the Node version specified in `.nvmrc`
2. CI will automatically validate the version
3. Local development should use `nvm use` or similar tools

## Local Development

### Running Security Checks Locally

```bash
# Run npm audit
npm audit

# Fix auto-fixable vulnerabilities
npm audit fix

# View detailed audit report
npm audit --json
```

### Checking Bundle Size Locally

```bash
# Build the application
npm run build

# Check bundle sizes
du -h build/static/js/*.js | sort -rh
du -h build/static/css/*.css | sort -rh

# Total build size
du -sh build/
```

### Checking Performance Budget Locally

```bash
# Install required tools
npm install -g webpack-bundle-analyzer

# Build and analyze
npm run build

# Check against budget (requires build)
node -e "
const budget = require('./performance-budget.json');
console.log('Performance Budget:');
console.log(JSON.stringify(budget.limits, null, 2));
"
```

## Maintenance

### Updating Performance Budgets

Edit `performance-budget.json` to adjust limits:

```json
{
  "limits": {
    "mainBundle": 500,
    "chunkBundle": 250,
    "cssBundle": 100,
    "totalSize": 1000
  }
}
```

### Updating Security Scan Schedule

Edit `.github/workflows/security.yml`:

```yaml
schedule:
  # Run daily at 9:00 AM UTC
  - cron: '0 9 * * *'
```

## Troubleshooting

### CI Fails on Node Version

**Problem**: CI fails with Node version mismatch

**Solution**: Ensure `.nvmrc` contains the correct version number (just the major version, e.g., `22`)

### Security Scan Fails

**Problem**: High or critical vulnerabilities found

**Solution**:
1. Review `npm audit` output
2. Run `npm audit fix` to auto-fix
3. For manual fixes, update affected packages
4. If no fix available, consider alternatives or accept risk

### Bundle Size Too Large

**Problem**: Bundle exceeds size limits

**Solutions**:
1. **Code splitting**: Use dynamic imports for large features
2. **Tree shaking**: Ensure unused code is eliminated
3. **Lazy loading**: Load components on demand
4. **Dependency analysis**: Remove unused dependencies
5. **Optimization**: Enable production optimizations

### Performance Budget Exceeded

**Problem**: Build exceeds performance budget

**Solutions**:
1. Optimize images (use WebP, compress)
2. Use code splitting
3. Lazy load non-critical resources
4. Minimize and compress CSS/JS
5. Review and remove unused dependencies

## Artifacts

All workflows generate artifacts that are retained for 7-30 days:

- **build-output**: Production build files (7 days)
- **security-audit-results**: Vulnerability scan results (30 days)
- **bundle-size-report**: Bundle analysis report (30 days)
- **performance-report**: Performance budget report (30 days)

Access artifacts from the Actions tab in GitHub.

## Best Practices

1. **Always run locally first**: Test changes locally before pushing
2. **Review CI failures immediately**: Don't let broken builds linger
3. **Monitor bundle sizes**: Keep an eye on bundle growth over time
4. **Keep dependencies updated**: Regularly update to patch vulnerabilities
5. **Respect performance budgets**: They exist to ensure good UX
6. **Review security alerts**: Address vulnerabilities promptly

## Future Enhancements

Potential additions to consider:
- Lighthouse CI for automated performance testing
- Visual regression testing
- E2E testing with Playwright/Cypress
- Automated dependency updates (Dependabot/Renovate)
- Code coverage reporting
- Deployment automation
