# Contributing to DrinkBot3000

Thank you for your interest in contributing to DrinkBot3000! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Architecture](#project-architecture)
- [Coding Standards](#coding-standards)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)

## Code of Conduct

This project is committed to providing a welcoming and inclusive environment. We expect all contributors to:

- Be respectful and considerate
- Welcome newcomers and help them get started
- Focus on what's best for the community and the project
- Show empathy towards other community members

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Git
- A code editor (VS Code recommended)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/drinkbot3000_private.git
   cd drinkbot3000_private
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/drinkbot3000/drinkbot3000_private.git
   ```

## Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   ```
   The app will open at http://localhost:3000

3. **Run tests (when available):**
   ```bash
   npm test
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## Project Architecture

DrinkBot3000 follows modern React best practices with a clear separation of concerns:

```
src/
├── components/          # React components
│   ├── common/         # Reusable UI components (Button, Modal, Card)
│   ├── AgeVerification/
│   ├── SafetyScreens/
│   ├── Tracker/        # Main tracking UI with sub-components
│   ├── Calculator/
│   └── Modals/         # Modal dialogs
├── services/           # Business logic (pure functions)
│   ├── bacCalculation.service.js
│   ├── validation.service.js
│   ├── storage.service.js
│   └── receipt.service.js
├── hooks/              # Custom React hooks
│   ├── useLocalStorage.js
│   ├── useBACCalculation.js
│   └── useRobotMessage.js
├── state/              # State management
│   ├── trackerReducer.js
│   └── TrackerContext.js
├── constants/          # App constants and configuration
├── utils/              # Utility functions
└── types/              # JSDoc type definitions
```

### Key Principles

1. **Single Responsibility:** Each file has one clear purpose
2. **Separation of Concerns:** UI, logic, and state are separated
3. **Pure Functions:** Services contain side-effect-free functions
4. **Component Composition:** Small components compose into larger ones
5. **Props Down, Events Up:** Unidirectional data flow

For more details, see [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md).

## Coding Standards

### JavaScript/React

- Follow the existing code style
- Use functional components with hooks (no class components)
- Use meaningful variable and function names
- Keep functions small and focused
- Add JSDoc comments for public functions

### Component Guidelines

**Good Component:**
```javascript
/**
 * Displays the current BAC percentage with color-coded status
 * @param {Object} props
 * @param {number} props.bac - Current BAC percentage
 * @param {boolean} props.hasBeenImpaired - Whether user has ever been impaired
 */
export function BACDisplay({ bac, hasBeenImpaired }) {
  const status = getBACStatus(bac);

  return (
    <div className={`bac-display ${status.colorClass}`}>
      <div className="bac-value">{bac.toFixed(3)}%</div>
      <div className="bac-status">{status.message}</div>
    </div>
  );
}
```

### Service Guidelines

**Good Service Function:**
```javascript
/**
 * Calculate Blood Alcohol Content
 * @param {Object} params
 * @param {string} params.gender - 'male' or 'female'
 * @param {number} params.weight - Weight in pounds
 * @param {Array} params.drinks - Array of drink objects
 * @returns {number} BAC percentage
 */
export const calculateBAC = ({ gender, weight, drinks }) => {
  // Pure function - no side effects
  // Same inputs = same outputs
  // Easy to test

  // Implementation...
  return bac;
};
```

### File Naming

- Components: `PascalCase.js` (e.g., `BACDisplay.js`)
- Services: `camelCase.service.js` (e.g., `bacCalculation.service.js`)
- Hooks: `camelCase.js` with `use` prefix (e.g., `useLocalStorage.js`)
- Utils: `camelCase.js` (e.g., `formatters.js`)
- Constants: `camelCase.js` or `index.js`

### State Management

- Use `useReducer` for complex state logic
- Use Context API for global state
- Keep state as local as possible
- Avoid prop drilling with Context

## Making Changes

### Branch Naming

Create a descriptive branch name:
- `feature/add-xyz` - New features
- `fix/bug-description` - Bug fixes
- `refactor/improve-xyz` - Code refactoring
- `docs/update-readme` - Documentation updates
- `test/add-xyz-tests` - Adding tests

### Commit Messages

Write clear, descriptive commit messages:

```
Add BAC calculation history feature

- Create DrinkHistory component
- Add history storage service
- Update reducer with history actions
- Add tests for history functionality

Closes #123
```

**Format:**
- First line: Brief summary (50 chars or less)
- Blank line
- Detailed description with bullet points
- Reference issue numbers

### Before Committing

1. **Test your changes:**
   ```bash
   npm start  # Manual testing
   npm test   # Run test suite (when available)
   npm run build  # Ensure it builds
   ```

2. **Review your changes:**
   ```bash
   git diff
   ```

3. **Stage and commit:**
   ```bash
   git add .
   git commit -m "Your descriptive message"
   ```

## Testing

### Writing Tests

We aim for 80%+ code coverage. Tests should be:

**Service Tests (Priority 1):**
```javascript
// bacCalculation.service.test.js
describe('calculateBAC', () => {
  it('should calculate correct BAC for male', () => {
    const result = calculateBAC({
      gender: 'male',
      weight: 180,
      drinks: [{ standardDrinks: 2, timestamp: Date.now() }],
      startTime: Date.now()
    });

    expect(result).toBeCloseTo(0.042, 2);
  });
});
```

**Component Tests:**
```javascript
// BACDisplay.test.jsx
import { render, screen } from '@testing-library/react';
import { BACDisplay } from './BACDisplay';

describe('BACDisplay', () => {
  it('should display BAC correctly', () => {
    render(<BACDisplay bac={0.045} hasBeenImpaired={false} />);
    expect(screen.getByText('0.045%')).toBeInTheDocument();
  });
});
```

### Test Coverage Goals

| Layer | Target Coverage |
|-------|----------------|
| Services | 90%+ |
| Hooks | 85%+ |
| Components | 80%+ |
| Utils | 90%+ |

## Submitting Changes

### Pull Request Process

1. **Update your branch:**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Push to your fork:**
   ```bash
   git push origin your-branch-name
   ```

3. **Create Pull Request:**
   - Go to GitHub and create a PR from your branch
   - Fill out the PR template
   - Link any related issues
   - Request review

### PR Guidelines

**Good PR Description:**
```markdown
## Summary
Brief description of what this PR does

## Changes
- Added BAC history tracking
- Created DrinkHistory component
- Updated storage service to persist history

## Testing
- [ ] Tested manually in browser
- [ ] Added unit tests for new functions
- [ ] All existing tests pass
- [ ] Tested on mobile viewport

## Screenshots (if applicable)
[Add screenshots of UI changes]

## Related Issues
Closes #123
```

### PR Checklist

Before submitting, ensure:

- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] New code has tests (when applicable)
- [ ] Documentation is updated
- [ ] Commit messages are clear
- [ ] No console.log statements left in code
- [ ] No commented-out code
- [ ] Branch is up to date with main

### Code Review

- Be open to feedback
- Respond to review comments promptly
- Make requested changes in new commits
- Mark conversations as resolved when addressed

## Development Workflow

### Typical Feature Development

1. **Create branch:**
   ```bash
   git checkout -b feature/my-new-feature
   ```

2. **Develop feature:**
   - Write code
   - Test locally
   - Commit changes

3. **Write tests:**
   - Add unit tests for services
   - Add component tests
   - Ensure coverage

4. **Update documentation:**
   - Update README if needed
   - Add JSDoc comments
   - Update PROJECT_STRUCTURE.md if architecture changes

5. **Create PR:**
   - Push to your fork
   - Create pull request
   - Wait for review

6. **Address feedback:**
   - Make requested changes
   - Push additional commits
   - Re-request review

7. **Merge:**
   - PR approved and merged
   - Delete branch

## Questions?

- Open an issue for bugs or feature requests
- Start a discussion for questions
- Email: drinkbot3000@gmail.com

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to DrinkBot3000! Your efforts help make the app better and safer for everyone. 🤖🚗
