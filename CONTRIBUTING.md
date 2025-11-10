# Contributing to DrinkBot3000

Thank you for your interest in contributing to DrinkBot3000! This document provides guidelines and best practices for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/drinkbot3000.git`
3. Install dependencies: `npm install`
4. Create a new branch: `git checkout -b feature/your-feature-name`

### Prerequisites

- Node.js 18.18.0 or higher (see `.nvmrc`)
- npm 9.x or higher
- A modern code editor (VS Code recommended)

### Recommended VS Code Extensions

- ESLint
- Prettier - Code formatter
- EditorConfig for VS Code

## Development Workflow

### Available Scripts

```bash
# Start development server
npm start

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build for production
npm build

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Check code formatting
npm run format:check

# Format code
npm run format
```

### Local Development

1. Start the development server: `npm start`
2. Open [http://localhost:3000](http://localhost:3000) in your browser
3. Make your changes - the app will hot-reload automatically

## Code Standards

### JavaScript/React Guidelines

1. **Use functional components with hooks** - No class components for new code
2. **Follow React hooks rules** - Use the ESLint plugin to catch violations
3. **Keep components small** - Aim for single responsibility principle
4. **Use meaningful names** - Component names should be descriptive (PascalCase)
5. **Avoid inline functions in JSX** - Define handlers outside render when possible
6. **Use PropTypes** - All props should have PropTypes definitions
7. **Add JSDoc comments** - Document complex functions and components

### Code Style

We use ESLint and Prettier to enforce consistent code style:

- **Indentation**: 2 spaces
- **Quotes**: Single quotes for JS, double quotes for JSX
- **Semicolons**: Always
- **Line length**: Max 100 characters
- **Arrow functions**: Prefer arrow functions for callbacks
- **Const/Let**: Use `const` by default, `let` only when reassignment is needed, never `var`

### File Organization

```
src/
├── components/       # Reusable UI components
├── hooks/           # Custom React hooks (if applicable)
├── utils/           # Utility functions
├── constants/       # Constants and configuration
└── App.js           # Main application component
```

### Component Structure

```jsx
// 1. Imports
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// 2. Constants (if component-specific)
const SOME_CONSTANT = 'value';

// 3. Component definition
/**
 * Component description
 * @param {Object} props - Component props
 * @param {string} props.name - Description of name prop
 */
const MyComponent = ({ name, onAction }) => {
  // 4. State and hooks
  const [state, setState] = useState(null);

  // 5. Effects
  useEffect(() => {
    // Effect logic
  }, []);

  // 6. Event handlers
  const handleClick = () => {
    // Handler logic
  };

  // 7. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

// 8. PropTypes
MyComponent.propTypes = {
  name: PropTypes.string.isRequired,
  onAction: PropTypes.func,
};

// 9. Default props (if needed)
MyComponent.defaultProps = {
  onAction: () => {},
};

// 10. Export
export default MyComponent;
```

## Testing

### Writing Tests

1. **Test file naming**: `ComponentName.test.js`
2. **Test structure**: Use `describe` and `test` blocks
3. **Test coverage**: Aim for >80% coverage
4. **Test behavior, not implementation**: Focus on what users see and do

### Testing Best Practices

```jsx
// Good: Test user-facing behavior
test('displays error message when form is invalid', () => {
  render(<MyForm />);
  const submitButton = screen.getByRole('button', { name: /submit/i });
  fireEvent.click(submitButton);
  expect(screen.getByText(/error/i)).toBeInTheDocument();
});

// Avoid: Testing implementation details
test('sets error state to true', () => {
  // This tests internal state, not user behavior
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- MyComponent.test.js
```

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code refactoring without changing functionality
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks (dependencies, build process, etc.)
- **ci**: CI/CD changes

### Examples

```bash
feat(tracker): add ability to export drink history as CSV

fix(bac-calculation): correct Widmark formula for edge cases

docs(readme): update installation instructions

refactor(app): split App.js into smaller components

test(error-boundary): add tests for error scenarios
```

## Pull Request Process

### Before Submitting

1. **Run all checks locally**:
   ```bash
   npm run lint
   npm run format:check
   npm test
   npm run build
   ```

2. **Update documentation** if needed
3. **Add/update tests** for your changes
4. **Ensure all tests pass**
5. **Keep commits atomic** - one logical change per commit

### PR Title Format

Follow the same convention as commit messages:
```
feat(scope): add new feature
fix(scope): resolve bug
```

### PR Description Template

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
Describe the tests you ran and how to reproduce them

## Screenshots (if applicable)
Add screenshots to demonstrate the changes

## Checklist
- [ ] My code follows the project's code style
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published
```

### Review Process

1. At least one approval is required before merging
2. All CI checks must pass
3. Address all review comments
4. Keep the PR up to date with the base branch

## Additional Resources

- [React Documentation](https://react.dev/)
- [Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)

## Questions?

If you have questions or need help, please:
1. Check existing issues and discussions
2. Open a new issue with the `question` label
3. Reach out to the maintainers

Thank you for contributing to DrinkBot3000! 🤖🍻
