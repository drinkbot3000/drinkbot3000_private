# Contributing to DrinkBot3000

Thank you for your interest in contributing to DrinkBot3000! This document provides guidelines and best practices for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Quality Standards](#code-quality-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

This project is built with the goal of promoting responsible drinking and safety. All contributions should align with this mission.

## Getting Started

### Prerequisites

- Node.js 18.x or higher (we recommend using nvm)
- npm 9.x or higher
- Git

### Initial Setup

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/drinkbot3000_private.git
   cd drinkbot3000_private
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Git hooks:**
   ```bash
   npm run prepare
   ```
   This installs Husky hooks that will automatically lint and format your code before commits.

4. **Start the development server:**
   ```bash
   npm start
   ```

## Development Workflow

### Creating a Feature Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### Branch Naming Conventions

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks

## Code Quality Standards

### Linting and Formatting

We use ESLint and Prettier to maintain code quality and consistency.

**Before committing, run:**

```bash
# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

**Pre-commit hooks automatically run** lint-staged, which:
- Runs ESLint with auto-fix on staged `.js` and `.jsx` files
- Runs Prettier on staged files
- Only processes files you're committing (fast!)

### Code Style Guidelines

1. **Use modern JavaScript features** (ES6+)
2. **Prefer functional components** and hooks over class components
3. **Use meaningful variable names** that describe their purpose
4. **Add comments** for complex logic
5. **Keep functions small** and focused on a single responsibility
6. **Use PropTypes** or TypeScript for type checking (if applicable)

### Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## Commit Guidelines

### Commit Message Format

We follow the Conventional Commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks, dependency updates

**Examples:**

```bash
# Good commit messages
git commit -m "feat(tracker): add ability to delete individual drinks"
git commit -m "fix(calculator): correct BAC calculation for edge case"
git commit -m "docs(readme): update installation instructions"

# Bad commit messages (avoid these!)
git commit -m "fixed stuff"
git commit -m "updates"
git commit -m "Add files via upload"
```

### Why Good Commit Messages Matter

1. **Clarity**: Team members understand what changed and why
2. **History**: Easy to track down when bugs were introduced
3. **Releases**: Automated changelog generation
4. **Debugging**: Easier to use git bisect and git blame

### Atomic Commits

- **One logical change per commit**
- Group related changes together
- Don't mix formatting changes with feature changes
- Test your code before committing

## Pull Request Process

### Before Submitting a PR

1. **Ensure all tests pass:**
   ```bash
   npm test
   ```

2. **Ensure code is linted and formatted:**
   ```bash
   npm run lint:fix
   npm run format
   ```

3. **Build succeeds:**
   ```bash
   npm run build
   ```

4. **Update documentation** if needed

### Creating a Pull Request

1. **Push your branch to GitHub:**
   ```bash
   git push -u origin feature/your-feature-name
   ```

2. **Create a PR** with a clear title and description:
   - Describe what changes you made
   - Explain why you made them
   - Reference any related issues
   - Add screenshots for UI changes

3. **PR Template:**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   - [ ] Tests pass locally
   - [ ] Added new tests (if applicable)
   - [ ] Manual testing completed

   ## Screenshots (if applicable)
   Add screenshots here

   ## Related Issues
   Closes #123
   ```

### PR Review Process

- PRs require at least one approval before merging
- Address all review comments
- Keep PRs focused and reasonably sized
- Be responsive to feedback

## Project Structure

```
drinkbot3000_private/
├── .github/
│   └── workflows/      # GitHub Actions CI/CD
├── .husky/             # Git hooks
├── public/             # Static assets
├── src/
│   ├── App.js          # Main application component
│   ├── index.js        # Application entry point
│   └── ...
├── .editorconfig       # Editor configuration
├── .eslintrc.json      # ESLint configuration
├── .prettierrc         # Prettier configuration
├── .nvmrc              # Node version
└── package.json        # Dependencies and scripts
```

## Questions or Issues?

- Create an issue on GitHub
- Check existing issues first to avoid duplicates
- Provide as much context as possible

Thank you for contributing to DrinkBot3000!
