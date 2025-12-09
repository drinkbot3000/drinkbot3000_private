# DrinkBot3000

> A modern, production-ready Blood Alcohol Content (BAC) tracking Progressive Web App

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Deployed on Netlify](https://img.shields.io/badge/Deployed-Netlify-00C7B7.svg)](https://www.netlify.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-orange.svg)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Live Deployment

**Status:** Deployed on Netlify
**Type:** Progressive Web App (PWA)
**Platform:** Web (iOS/Android compatible)

## What is DrinkBot3000?

DrinkBot3000 is a safety-first BAC tracking application that helps users monitor their alcohol consumption responsibly. Built with modern web technologies and deployed as a PWA, it works seamlessly across all devices.

### Key Features

- Real-time BAC tracking with scientific calculations
- Drink logging with preset and custom options
- Safety screens for drug interactions and impairment warnings
- Age verification and geographic restrictions (USA-only)
- Works offline with PWA capabilities
- Privacy-first: all data stored locally
- Complete legal compliance (privacy policy, terms, refund policy)

### Safety First

DrinkBot3000 includes comprehensive safety features:
- 4 mandatory safety screens (opiates, benzodiazepines, sleep, DUI warnings)
- Persistent impairment warnings
- Conservative BAC calculations for user safety
- Educational content about responsible drinking

## Quick Start

### For Users

The app is already deployed and ready to use as a Progressive Web App on Netlify.

### For Developers

```bash
# Clone repository
git clone https://github.com/drinkbot3000/drinkbot3000_private.git
cd drinkbot3000_private

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## Technology Stack

**Frontend**
- React 18.x with modern hooks
- Tailwind CSS for styling
- Lucide React for icons

**State Management**
- React Context API
- useReducer pattern
- localStorage for persistence

**Build & Deploy**
- Create React App
- Netlify (deployed)
- Service Worker for PWA

**Code Quality**
- ESLint + Prettier
- Husky pre-commit hooks
- GitHub Actions CI/CD

## Project Architecture

DrinkBot3000 follows a clean, modular architecture:

```
src/
├── components/       # React UI components
│   ├── common/      # Reusable components (Button, Modal, Card)
│   ├── Tracker/     # BAC tracking interface
│   ├── Calculator/  # BAC calculator
│   └── ...
├── services/        # Business logic (pure functions)
├── hooks/           # Custom React hooks
├── state/           # State management (Context + Reducer)
├── constants/       # App configuration
└── utils/           # Utility functions
```

**Architecture Highlights:**
- Clean separation of concerns (UI / Logic / State)
- Pure functions in service layer (95%+ testable)
- Single Responsibility Principle throughout
- Component composition over complexity

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for complete architecture details.

## Documentation

### Getting Started
- **[Quick Start Guide](docs/QUICK_START.md)** - Get running in 5 minutes
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Deploy your own instance

### Development
- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute
- **[Architecture Guide](docs/ARCHITECTURE.md)** - Technical architecture
- **[Development Guide](docs/DEVELOPMENT.md)** - Development workflow
- **[Modernization Strategy](docs/MODERNIZATION_STRATEGY.md)** - Future roadmap

### Reference
- **[Documentation Index](docs/README.md)** - All documentation
- **[Troubleshooting](docs/TROUBLESHOOTING.md)** - Common issues

## Development Workflow

```bash
# Development
npm start              # Start dev server (localhost:3000)
npm run lint           # Run ESLint
npm run format         # Format with Prettier
npm test               # Run test suite

# Production
npm run build          # Create optimized build
```

## Recent Updates

### December 2024 - Major Refactoring
- Transformed from 2,971-line monolith to modular architecture
- Extracted 18+ focused components
- Created 5 pure service modules
- Achieved 95%+ testable code
- 72% reduction in main App.js file

**[Read Complete Refactoring Report →](docs/archive/REFACTORING_FINAL_REPORT.md)**

### Current Status
- Production ready and deployed on Netlify
- Modern React 18 architecture
- Comprehensive CI/CD pipeline
- Full PWA support
- WCAG accessibility improvements in progress

## Testing

```bash
npm test                    # Run test suite
npm test -- --coverage      # Run with coverage report
```

**Current Coverage:**
- Service layer: Comprehensive unit tests
- Components: In progress
- E2E: Planned (see [Modernization Strategy](docs/MODERNIZATION_STRATEGY.md))

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Development setup
- Coding standards
- PR process
- Testing requirements

## Security

DrinkBot3000 implements multiple security layers:
- Content Security Policy (CSP) headers
- XSS and injection protection
- HTTPS enforced (Netlify)
- No external data storage (privacy-first)
- Regular dependency audits

Report security issues to: drinkbot3000@gmail.com

## License

MIT License - See [LICENSE](LICENSE) file for details.

## Important Disclaimers

### Medical Disclaimer
This app provides BAC estimates for educational purposes only. **Never rely on this app to determine fitness to drive or operate machinery.** Individual metabolism varies significantly. When in doubt, don't drive.

### Safety Commitment
- Never drink and drive
- Know your limits
- Drink water, eat food
- Call a ride service if needed

## Support

- **Documentation:** [docs/README.md](docs/README.md)
- **Issues:** [GitHub Issues](https://github.com/drinkbot3000/drinkbot3000_private/issues)
- **Email:** drinkbot3000@gmail.com

---

**Built with modern best practices and a commitment to user safety.**

**Drink Responsibly. Track Safely. Never Drive Impaired.**
