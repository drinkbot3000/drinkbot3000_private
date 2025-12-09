# CI/CD Pipeline Setup

## Overview

This project now includes a comprehensive CI/CD pipeline using GitHub Actions that provides:

✅ Automated testing on pull requests
✅ Automated build verification
✅ Security vulnerability scanning
✅ Automated deployment to Netlify
✅ Performance monitoring with Lighthouse

## Workflows Created

### 1. PR Checks (`.github/workflows/pr-checks.yml`)

**Runs on:** All pull requests to `main`

**What it does:**
- Installs dependencies with caching
- Runs linter checks
- Executes test suite with coverage
- Builds the application
- Verifies build output
- Runs security audit on dependencies
- Uploads build artifacts

**This ensures:** No broken code is merged into main

### 2. CI (`.github/workflows/ci.yml`)

**Runs on:** Push to `main` branch

**What it does:**
- Runs full test suite with coverage
- Builds production application
- Uploads coverage reports
- Runs Lighthouse performance audit
- Saves performance metrics

**This ensures:** Main branch is always in a deployable state

### 3. Deploy (`.github/workflows/deploy.yml`)

**Runs on:** Push to `main` branch (can also be triggered manually)

**What it does:**
- Builds production application
- Deploys to Netlify
- Posts deployment status
- Comments on commits with deployment URL

**This ensures:** Every merge to main is automatically deployed

## Quick Start

### For Development

1. Create a feature branch
2. Make your changes
3. Push to GitHub
4. Open a pull request
5. **CI will automatically run** - check the PR for status
6. Once approved and merged, **automatic deployment happens**

### First-Time Setup (One Time Only)

To enable automatic deployment, configure these GitHub secrets:

1. **Get Netlify Auth Token:**
   - Go to Netlify → User Settings → Applications → New Access Token
   - Copy the token

2. **Get Netlify Site ID:**
   - Go to your Netlify site → Site Settings → Site information
   - Copy the API ID

3. **Add to GitHub:**
   - Go to your repo → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Add `NETLIFY_AUTH_TOKEN` with your token
   - Add `NETLIFY_SITE_ID` with your site ID

## What Each Workflow Tests

### PR Checks
```
✓ Dependencies install successfully
✓ Code builds without errors
✓ Tests pass (with coverage)
✓ No high-severity security vulnerabilities
✓ Build output is valid
```

### CI Pipeline
```
✓ All tests pass on main branch
✓ Coverage reports generated
✓ Production build succeeds
✓ Performance meets standards (Lighthouse)
```

### Deployment
```
✓ Production build created
✓ Deployed to Netlify
✓ Site is accessible
```

## Workflow Status

Check workflow status in the **Actions** tab of your GitHub repository.

### Adding Status Badges

Add these to your `README.md` to show build status:

```markdown
![PR Checks](https://github.com/YOUR_USERNAME/drinkbot3000/workflows/PR%20Checks/badge.svg)
![CI](https://github.com/YOUR_USERNAME/drinkbot3000/workflows/CI/badge.svg)
![Deploy](https://github.com/YOUR_USERNAME/drinkbot3000/workflows/Deploy/badge.svg)
```

## Benefits

### For Developers
- ✅ Catch bugs before merge
- ✅ Automated testing saves time
- ✅ No manual deployment steps
- ✅ Consistent build environment

### For Code Quality
- ✅ All PRs are tested
- ✅ Code coverage tracking
- ✅ Security vulnerability detection
- ✅ Performance monitoring

### For Deployment
- ✅ Every merge auto-deploys
- ✅ No manual publish steps
- ✅ Deployment history tracked
- ✅ Easy rollback if needed

## Troubleshooting

### Workflow Fails

1. Check the Actions tab for error details
2. Review the specific job that failed
3. Common issues:
   - Missing dependencies: Run `npm install`
   - Build errors: Fix locally first with `npm run build`
   - Test failures: Fix tests locally with `npm test`

### Deployment Fails

1. Verify Netlify secrets are configured correctly
2. Check Netlify dashboard for deployment logs
3. Ensure `netlify.toml` configuration is correct

### Tests Fail

Currently configured with `--passWithNoTests` to allow PRs without tests. To add tests:

```bash
# Create test file
src/components/YourComponent.test.js

# Run tests locally
npm test
```

## Manual Workflow Triggers

You can manually run workflows:

1. Go to **Actions** tab
2. Select workflow (CI or Deploy)
3. Click **Run workflow**
4. Choose branch
5. Click **Run workflow** button

## Performance Monitoring

Lighthouse runs automatically on main branch commits:

- Reports saved as artifacts
- View in Actions → CI workflow → Artifacts
- Download `lighthouse-report.json` for details

## Security Scanning

Security audit runs on every PR:

- Checks for known vulnerabilities
- Runs against production dependencies
- Warnings don't block PRs but should be addressed

## Next Steps

1. ✅ CI/CD pipeline is set up
2. ⚠️ Configure Netlify secrets for auto-deployment
3. 📝 Consider adding tests to improve coverage
4. 📊 Monitor workflow runs in Actions tab
5. 🔒 Review and fix any security vulnerabilities

## Additional Resources

- **GitHub Actions Docs**: https://docs.github.com/en/actions
- **Netlify Deploy Docs**: https://docs.netlify.com/
- **Workflow Details**: See `.github/workflows/README.md`

---

**Status**: ✅ CI/CD Pipeline Configured and Ready

All workflows are configured and will run automatically on the next PR or push to main.
