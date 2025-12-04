# Development Guide

Complete guide for developing and contributing to DrinkBot3000.

## Development Setup

### Prerequisites

- **Node.js:** 18+ (recommended: 22)
- **npm:** Latest version
- **Git:** Latest version
- **Editor:** VS Code recommended

### Initial Setup

```bash
# Clone repository
git clone https://github.com/drinkbot3000/drinkbot3000_private.git
cd drinkbot3000_private

# Install dependencies
npm install

# Start development server
npm start
```

The app opens at `http://localhost:3000` with hot reload enabled.

## Development Workflow

### Daily Development

```bash
# Start dev server
npm start

# In separate terminal - run tests in watch mode
npm test

# Lint code
npm run lint

# Format code
npm run format
```

### Code Quality Tools

**ESLint** - Catch bugs and enforce code style
```bash
npm run lint          # Check for issues
npm run lint:fix      # Auto-fix issues
```

**Prettier** - Format code consistently
```bash
npm run format        # Format all files
npm run format:check  # Check formatting
```

**Husky** - Pre-commit hooks
- Automatically runs on `git commit`
- Lints and formats staged files
- Prevents commits with issues

### Making Changes

1. **Create feature branch**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make changes**
   - Edit files in `src/`
   - See changes instantly in browser
   - Write/update tests

3. **Test changes**
   ```bash
   npm test              # Run tests
   npm run lint          # Check code quality
   npm run build         # Verify build works
   ```

4. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   # Husky runs automatically
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/my-feature
   # Create PR on GitHub
   ```

## Project Structure

```
drinkbot3000_private/
├── src/
│   ├── components/          # React components
│   │   ├── common/         # Reusable UI (Button, Modal, Card)
│   │   ├── Tracker/        # BAC tracking interface
│   │   ├── Calculator/     # BAC calculator
│   │   ├── SafetyScreens/  # Safety warnings
│   │   └── ...
│   ├── services/           # Business logic (pure functions)
│   │   ├── bacCalculation.service.js
│   │   ├── validation.service.js
│   │   ├── storage.service.js
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   │   ├── useBACCalculation.js
│   │   ├── useLocalStorage.js
│   │   └── ...
│   ├── state/              # State management
│   │   ├── trackerReducer.js
│   │   └── TrackerContext.js
│   ├── constants/          # Configuration
│   ├── utils/              # Utility functions
│   └── types/              # Type definitions (JSDoc)
├── public/                 # Static assets
│   ├── index.html
│   ├── privacy.html
│   ├── terms.html
│   └── ...
├── docs/                   # Documentation
├── .github/                # GitHub Actions workflows
└── tests/                  # Test files

```

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed architecture documentation.

## Architecture Principles

### 1. Separation of Concerns

**Components** - UI only, no business logic
```javascript
// Good
function BACDisplay({ bac, status }) {
  return <div>{bac.toFixed(3)}%</div>;
}

// Bad - logic in component
function BACDisplay({ drinks, weight }) {
  const bac = calculateBAC(drinks, weight); // ❌
  return <div>{bac.toFixed(3)}%</div>;
}
```

**Services** - Pure functions, no UI
```javascript
// Good - pure function in service
export const calculateBAC = ({ drinks, weight, gender }) => {
  // calculations
  return bac;
};

// Bad - service accessing DOM
export const calculateBAC = ({ drinks }) => {
  const weight = document.getElementById('weight').value; // ❌
  return bac;
};
```

### 2. Single Responsibility Principle

Each file/function has ONE purpose:
- `BACDisplay.jsx` - Display BAC only
- `calculateBAC()` - Calculate BAC only
- `validateWeight()` - Validate weight only

### 3. Pure Functions

Services should be pure (same input = same output):
```javascript
// Good - pure
export const calculateBAC = ({ drinks, weight }) => {
  // No side effects, testable
  return drinks * 0.05 / weight;
};

// Bad - impure
let totalBac = 0;
export const calculateBAC = ({ drinks, weight }) => {
  totalBac += drinks * 0.05 / weight; // ❌ Side effect
  return totalBac;
};
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- BACCalculation.service.test.js
```

### Writing Tests

**Service Tests** (Priority)
```javascript
// src/services/__tests__/bacCalculation.service.test.js
import { calculateBAC } from '../bacCalculation.service';

describe('calculateBAC', () => {
  it('calculates correct BAC for male', () => {
    const result = calculateBAC({
      gender: 'male',
      weight: 180,
      drinks: [{ standardDrinks: 2 }],
      startTime: Date.now()
    });

    expect(result).toBeCloseTo(0.042, 2);
  });
});
```

**Component Tests**
```javascript
// src/components/__tests__/BACDisplay.test.jsx
import { render, screen } from '@testing-library/react';
import { BACDisplay } from '../BACDisplay';

describe('BACDisplay', () => {
  it('displays BAC correctly', () => {
    render(<BACDisplay bac={0.045} />);
    expect(screen.getByText('0.045%')).toBeInTheDocument();
  });
});
```

### Test Coverage Goals

| Layer | Target |
|-------|--------|
| Services | 90%+ |
| Hooks | 85%+ |
| Components | 80%+ |
| Overall | 85%+ |

**Current Status:**
- Services: ✅ Well tested
- Components: 🚧 In progress
- E2E: 📋 Planned

## CI/CD Pipeline

### GitHub Actions Workflows

The project uses 7 automated workflows:

#### 1. PR Checks (`.github/workflows/pr-checks.yml`)
**Runs on:** Every pull request

**What it does:**
- Installs dependencies with caching
- Runs ESLint
- Runs test suite with coverage
- Builds application
- Runs security audit
- Uploads build artifacts

**Purpose:** Ensure no broken code is merged

#### 2. CI Pipeline (`.github/workflows/ci.yml`)
**Runs on:** Push to `main` branch

**What it does:**
- Full test suite with coverage
- Production build
- Lighthouse performance audit
- Coverage reports
- Performance metrics

**Purpose:** Maintain quality of main branch

#### 3. Deploy (`.github/workflows/deploy.yml`)
**Runs on:** Push to `main` (or manual trigger)

**What it does:**
- Builds production application
- Deploys to Netlify
- Posts deployment status
- Comments on commits with URLs

**Purpose:** Automatic deployment to production

#### 4-7. Additional Workflows
- Daily security scans
- Dependency updates (Dependabot)
- Performance monitoring
- Bundle size tracking

### Working with CI/CD

**For Contributors:**

1. **Create PR** - CI checks run automatically
2. **Check status** - View results in PR
3. **Fix issues** - Push updates to branch
4. **Merge** - Auto-deploy happens on merge to main

**Viewing Results:**
- Go to repository on GitHub
- Click "Actions" tab
- View workflow runs and logs

### CI/CD Configuration

**Required Secrets** (for deployment):
```
NETLIFY_AUTH_TOKEN - Netlify authentication
NETLIFY_SITE_ID    - Site identifier
```

Add in: Repository Settings > Secrets and variables > Actions

### Local CI Simulation

Run the same checks locally before pushing:

```bash
# Install dependencies
npm ci

# Lint
npm run lint

# Test with coverage
npm test -- --coverage

# Build
npm run build

# Security audit
npm audit

# All checks
npm run lint && npm test && npm run build
```

## Debugging

### React DevTools

Install browser extension:
- [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

Use to:
- Inspect component tree
- View props and state
- Profile performance

### Browser DevTools

**Console** - View logs and errors
```javascript
console.log('Debug info:', value);
console.error('Error:', error);
```

**Network** - Monitor API calls
- Check geolocation API
- Check Stripe requests
- Monitor service worker

**Application** - Inspect storage
- localStorage data
- Service worker status
- Cache contents

### Common Issues

**Hot reload not working**
```bash
# Restart dev server
# Check no syntax errors
# Check browser console
```

**Tests failing**
```bash
# Clear cache
npm test -- --clearCache

# Update snapshots
npm test -- -u
```

**Build errors**
```bash
# Clear build directory
rm -rf build

# Reinstall dependencies
rm -rf node_modules
npm install

# Try build again
npm run build
```

## Code Style Guide

### File Naming

- **Components:** `PascalCase.jsx` (e.g., `BACDisplay.jsx`)
- **Services:** `camelCase.service.js` (e.g., `bacCalculation.service.js`)
- **Hooks:** `camelCase.js` with `use` prefix (e.g., `useBACCalculation.js`)
- **Tests:** `*.test.js` or `*.test.jsx`

### Code Conventions

**Components:**
```javascript
// Use functional components with hooks
export function BACDisplay({ bac, status }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bac-display">
      <span>{bac.toFixed(3)}%</span>
    </div>
  );
}
```

**Services:**
```javascript
// Export named functions with JSDoc
/**
 * Calculate Blood Alcohol Content
 * @param {Object} params
 * @param {number} params.weight - Weight in pounds
 * @param {Array} params.drinks - Array of drinks
 * @returns {number} BAC percentage
 */
export const calculateBAC = ({ weight, drinks }) => {
  // Pure function logic
  return bac;
};
```

**State Management:**
```javascript
// Use useReducer for complex state
const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_DRINK':
      return { ...state, drinks: [...state.drinks, action.payload] };
    default:
      return state;
  }
};
```

### Documentation

**JSDoc Comments** for public functions:
```javascript
/**
 * Validates user weight input
 * @param {string|number} weight - Weight to validate
 * @returns {Object} Validation result with isValid and error
 */
export const validateWeight = (weight) => {
  // ...
};
```

**Component Comments:**
```javascript
/**
 * Displays current BAC with color-coded status
 * @component
 */
export function BACDisplay() {
  // ...
}
```

## Performance

### Best Practices

**Memoization:**
```javascript
// Memoize expensive calculations
const expensiveValue = useMemo(() =>
  calculateExpensiveValue(data),
  [data]
);

// Memoize callbacks
const handleClick = useCallback(() => {
  doSomething();
}, []);
```

**Code Splitting:**
```javascript
// Lazy load components
const Calculator = lazy(() => import('./Calculator'));

<Suspense fallback={<Loading />}>
  <Calculator />
</Suspense>
```

**Avoid Re-renders:**
```javascript
// Use React.memo for expensive components
export const ExpensiveComponent = React.memo(({ data }) => {
  // ...
});
```

### Monitoring Performance

```bash
# Lighthouse audit
npm run build
npx serve build
# Open Chrome DevTools > Lighthouse
```

**Check:**
- Performance score
- Bundle size
- Load times
- Core Web Vitals

## Environment Variables

### Development

Create `.env.local`:
```bash
REACT_APP_ENV=development
REACT_APP_API_URL=http://localhost:3000
```

### Production

Set in deployment platform:
```bash
REACT_APP_ENV=production
REACT_APP_API_URL=https://api.drinkbot3000.com
```

**Access in code:**
```javascript
const apiUrl = process.env.REACT_APP_API_URL;
```

## Useful Resources

### Documentation
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev)

### Tools
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools)
- [ESLint](https://eslint.org)
- [Prettier](https://prettier.io)

### Testing
- [Jest](https://jestjs.io)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Getting Help

### Before Asking

1. Check documentation
2. Search existing issues
3. Check troubleshooting guide

### How to Ask

Create a GitHub issue with:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Environment (OS, Node version, browser)
- Error messages and stack traces

## Next Steps

- Read [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines
- Read [ARCHITECTURE.md](ARCHITECTURE.md) for deep dive into codebase
- Read [MODERNIZATION_STRATEGY.md](MODERNIZATION_STRATEGY.md) for future plans
- Join development discussions on GitHub

## Modernization Roadmap

See [MODERNIZATION_STRATEGY.md](MODERNIZATION_STRATEGY.md) for planned improvements:

- TypeScript migration (100% coverage)
- Enhanced testing (E2E, integration)
- Performance optimization (40% bundle reduction)
- Modern state management (Zustand)
- Build tooling upgrade (Vite)
- Observability (Sentry, analytics)
- Enhanced security
- Accessibility (WCAG 2.1 AA)

---

**Happy coding! Build responsibly.**
