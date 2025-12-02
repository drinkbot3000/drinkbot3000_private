# CI/CD Pipeline Documentation

This directory contains GitHub Actions workflows for automated testing, building, and deployment.

## Workflows

### 1. PR Checks (`pr-checks.yml`)

Runs automatically on all pull requests to the `main` branch.

**Jobs:**
- **Lint, Test, and Build**: Runs linting, tests with coverage, and builds the application
- **Build Verification**: Verifies the build completes successfully and checks output
- **Security Audit**: Runs npm audit to check for known vulnerabilities

**Triggers:**
- Pull requests to `main` branch

### 2. CI (`ci.yml`)

Runs on every push to the `main` branch.

**Jobs:**
- **Build and Test**: Runs full test suite with coverage and builds the application
- **Lighthouse Check**: Runs Lighthouse performance audit on the built application

**Triggers:**
- Push to `main` branch
- Manual workflow dispatch

### 3. Deploy (`deploy.yml`)

Deploys the application to Netlify.

**Jobs:**
- **Deploy to Netlify**: Builds and deploys the application

**Triggers:**
- Push to `main` branch
- Manual workflow dispatch

## Setup Instructions

### Required Secrets

To enable automatic deployment to Netlify, you need to configure the following secrets in your GitHub repository:

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Add the following secrets:

#### `NETLIFY_AUTH_TOKEN`
- Get this from Netlify: User Settings → Applications → Personal Access Tokens
- Create a new token with full access

#### `NETLIFY_SITE_ID`
- Get this from your Netlify site: Site Settings → General → Site details → Site ID

### Adding Secrets

```bash
# Navigate to your repository settings
Settings → Secrets and variables → Actions → New repository secret

# Add each secret:
Name: NETLIFY_AUTH_TOKEN
Value: <your-netlify-auth-token>

Name: NETLIFY_SITE_ID
Value: <your-netlify-site-id>
```

## Workflow Features

### Caching
- Node modules are cached to speed up builds
- Cache is automatically invalidated when `package-lock.json` changes

### Artifacts
- Build artifacts are uploaded and retained for 7-30 days
- Coverage reports are generated and uploaded
- Lighthouse reports are saved for performance tracking

### Security
- Automated dependency vulnerability scanning
- Production dependencies are audited on every PR

### Performance
- Lighthouse audits run on main branch commits
- Performance metrics are tracked over time

## Status Badges

Add these badges to your README.md to show workflow status:

```markdown
![PR Checks](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/PR%20Checks/badge.svg)
![CI](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/CI/badge.svg)
![Deploy](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/Deploy/badge.svg)
```

Replace `YOUR_USERNAME` and `YOUR_REPO` with your actual GitHub username and repository name.

## Manual Workflow Triggers

You can manually trigger the CI and Deploy workflows:

1. Go to the **Actions** tab in your GitHub repository
2. Select the workflow you want to run
3. Click **Run workflow**
4. Select the branch and click **Run workflow**

## Troubleshooting

### Build Failures

If builds fail, check:
1. Node version compatibility (workflows use Node 22)
2. Dependency conflicts (using `--legacy-peer-deps` flag)
3. Environment variables required by the build

### Test Failures

- Tests run with `--passWithNoTests` flag to allow PRs without tests
- Coverage reports are generated even if some tests fail
- Add tests to `src/**/*.test.{js,jsx,ts,tsx}` or `src/**/*.spec.{js,jsx,ts,tsx}`

### Deployment Failures

Common issues:
1. Missing Netlify secrets
2. Incorrect site ID
3. Build output directory mismatch (should be `build/`)

### Security Audit Failures

- Moderate and high severity vulnerabilities will cause warnings
- Review `npm audit` output and update dependencies
- Use `npm audit fix` to automatically fix vulnerabilities when possible

## Best Practices

1. **Always test locally before pushing**
   ```bash
   npm test
   npm run build
   ```

2. **Keep dependencies updated**
   ```bash
   npm outdated
   npm update
   ```

3. **Monitor workflow runs**
   - Check the Actions tab regularly
   - Review failed workflows promptly
   - Address security vulnerabilities

4. **Use meaningful commit messages**
   - Deployment messages include commit messages
   - Clear messages help track what was deployed

## Extending the Pipeline

### Adding New Workflows

1. Create a new `.yml` file in `.github/workflows/`
2. Define triggers, jobs, and steps
3. Use existing workflows as templates
4. Test with `workflow_dispatch` trigger first

### Adding Environment Variables

For sensitive variables:
1. Add as repository secrets (Settings → Secrets)
2. Reference in workflow: `${{ secrets.SECRET_NAME }}`

For non-sensitive variables:
1. Add in workflow file under `env:`
2. Or add to repository variables (Settings → Variables)

### Custom Build Scripts

Modify `package.json` scripts and update workflow steps accordingly.

## Support

For issues with:
- **GitHub Actions**: Check GitHub Actions documentation
- **Netlify Deployment**: Check Netlify documentation
- **Build Issues**: Review build logs in Actions tab
