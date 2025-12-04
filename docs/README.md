# DrinkBot3000 Documentation

Complete documentation index for DrinkBot3000.

## Quick Navigation

| I want to... | Read this |
|--------------|-----------|
| Get started quickly | [QUICK_START.md](QUICK_START.md) |
| Deploy the app | [DEPLOYMENT.md](DEPLOYMENT.md) |
| Contribute code | [../CONTRIBUTING.md](../CONTRIBUTING.md) |
| Understand the architecture | [ARCHITECTURE.md](ARCHITECTURE.md) |
| Set up development | [DEVELOPMENT.md](DEVELOPMENT.md) |
| Fix an issue | [TROUBLESHOOTING.md](TROUBLESHOOTING.md) |
| See future plans | [MODERNIZATION_STRATEGY.md](MODERNIZATION_STRATEGY.md) |

## Documentation Structure

### Getting Started

**[QUICK_START.md](QUICK_START.md)** - 5-minute guide
- Installation
- Running locally
- Basic commands
- Next steps

**[DEPLOYMENT.md](DEPLOYMENT.md)** - Complete deployment guide
- Netlify deployment (current platform)
- Alternative platforms (Vercel, GitHub Pages, etc.)
- Custom domain setup
- CI/CD configuration
- Post-deployment checklist
- Monitoring and maintenance

### Development

**[DEVELOPMENT.md](DEVELOPMENT.md)** - Development guide
- Development setup and workflow
- Project structure
- Architecture principles
- Testing strategy
- CI/CD pipeline
- Code style guide
- Debugging tips
- Performance best practices

**[../CONTRIBUTING.md](../CONTRIBUTING.md)** - Contribution guide
- How to contribute
- Code of conduct
- Branch naming
- Commit messages
- Pull request process
- Code review guidelines

**[ARCHITECTURE.md](ARCHITECTURE.md)** - Technical architecture
- System design
- Component hierarchy
- State management
- Data flow
- Service layer
- File organization

### Reference

**[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues and solutions
- Development issues
- Deployment problems
- Runtime errors
- Performance issues
- Browser compatibility
- CI/CD failures

**[MODERNIZATION_STRATEGY.md](MODERNIZATION_STRATEGY.md)** - Future roadmap
- TypeScript migration plan
- Testing improvements
- Performance optimization
- State management modernization
- Build tooling upgrades
- Security enhancements
- Accessibility goals

### Historical

**[archive/](archive/)** - Archived documentation
- [REFACTORING_FINAL_REPORT.md](archive/REFACTORING_FINAL_REPORT.md) - Complete refactoring report
- [REFACTORING_PROGRESS.md](archive/REFACTORING_PROGRESS.md) - Phase tracking
- [SESSION_SUMMARY_2025-12-03.md](archive/SESSION_SUMMARY_2025-12-03.md) - Development session notes

## Project Status

### Current Status (December 2024)

**Production:**
- Deployed on Netlify
- Progressive Web App (PWA)
- Production-ready

**Code Quality:**
- Modern React 18 architecture
- 95%+ testable code
- Comprehensive service layer
- ESLint + Prettier + Husky

**Testing:**
- Service layer: Well tested
- Components: In progress
- E2E: Planned

**CI/CD:**
- 7 GitHub Actions workflows
- Automated PR checks
- Automatic deployment
- Performance monitoring

## Key Features

### Application Features
- Real-time BAC tracking
- Drink logging (preset + custom)
- Safety screens (4 mandatory warnings)
- Age verification
- Geographic restrictions (USA-only)
- Offline support (PWA)
- Privacy-first (local storage only)

### Technical Features
- React 18 with hooks
- Context API + useReducer
- Tailwind CSS styling
- Service Worker for PWA
- Responsive design
- Security headers (CSP, XSS protection)

## Technology Stack

**Frontend:**
- React 18.x
- Tailwind CSS
- Lucide React icons

**State Management:**
- React Context API
- useReducer pattern
- localStorage persistence

**Build & Deploy:**
- Create React App
- Netlify (current)
- GitHub Actions CI/CD

**Code Quality:**
- ESLint
- Prettier
- Husky pre-commit hooks
- GitHub Actions workflows

## Recent Updates

### December 2024
- Major architectural refactoring (72% reduction in main file)
- Extracted 18+ focused components
- Created 5 pure service modules
- Documentation consolidation and modernization
- CI/CD pipeline implementation

See [archive/REFACTORING_FINAL_REPORT.md](archive/REFACTORING_FINAL_REPORT.md) for complete details.

## Getting Help

### Self-Service
1. Search this documentation
2. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
3. Search [GitHub Issues](https://github.com/drinkbot3000/drinkbot3000_private/issues)

### Ask for Help
- **New Issue:** [Create GitHub Issue](https://github.com/drinkbot3000/drinkbot3000_private/issues/new)
- **Email:** drinkbot3000@gmail.com
- **Response Time:** Within 48 hours

### What to Include
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, browser)
- Error messages and stack traces
- Screenshots (if applicable)

## Contributing

We welcome contributions! See [CONTRIBUTING.md](../CONTRIBUTING.md) for:
- Development setup
- Coding standards
- Testing requirements
- Pull request process

## Documentation Philosophy

This documentation follows these principles:

1. **Progressive Disclosure** - Start simple, link to details
2. **Task-Oriented** - Organized by what you want to do
3. **Keep it DRY** - No redundant information
4. **Stay Current** - Updated with code changes
5. **Accessible** - Clear language, good structure

## Documentation Maintenance

### When to Update

Update documentation when:
- Adding new features
- Changing architecture
- Modifying deployment process
- Fixing bugs that others might encounter
- Improving workflows

### How to Update

1. Edit relevant markdown file
2. Update links if files moved
3. Update this index if structure changed
4. Test all links
5. Submit PR with changes

## Quick Reference

### Common Commands

```bash
# Development
npm start              # Start dev server
npm test               # Run tests
npm run lint           # Check code quality
npm run format         # Format code

# Build
npm run build          # Create production build

# Deploy (automatic on push to main)
git push origin main
```

### Project Structure

```
drinkbot3000_private/
├── src/               # Source code
│   ├── components/    # React components
│   ├── services/      # Business logic
│   ├── hooks/         # Custom hooks
│   ├── state/         # State management
│   ├── constants/     # Configuration
│   └── utils/         # Utilities
├── public/            # Static assets
├── docs/              # Documentation (you are here)
├── .github/           # GitHub Actions
└── build/             # Production build (generated)
```

### Important Files

- `README.md` - Main project readme
- `CONTRIBUTING.md` - How to contribute
- `package.json` - Dependencies and scripts
- `netlify.toml` - Deployment configuration
- `.eslintrc.js` - Linting rules
- `.prettierrc` - Code formatting rules

## External Resources

### React
- [React Documentation](https://react.dev)
- [React Hooks](https://react.dev/reference/react)
- [React Testing Library](https://testing-library.com/react)

### Deployment
- [Netlify Documentation](https://docs.netlify.com)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions](https://docs.github.com/en/actions)

### Tools
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev)
- [ESLint](https://eslint.org/docs)
- [Prettier](https://prettier.io/docs)

## License

MIT License - See [LICENSE](../LICENSE) file for details.

---

**Need something specific?**

Use the navigation table at the top or browse the files listed in each section.

**Can't find what you're looking for?**

[Create an issue](https://github.com/drinkbot3000/drinkbot3000_private/issues/new) and we'll add it to the docs!
