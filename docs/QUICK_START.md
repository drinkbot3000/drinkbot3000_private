# Quick Start Guide

Get DrinkBot3000 running locally in 5 minutes.

## Prerequisites

- Node.js 18+ ([download](https://nodejs.org))
- npm (comes with Node.js)
- Git

## Installation

```bash
# Clone the repository
git clone https://github.com/drinkbot3000/drinkbot3000_private.git
cd drinkbot3000_private

# Install dependencies
npm install

# Start development server
npm start
```

The app will open automatically at `http://localhost:3000`

## What's Next?

### Development
- Edit files in `src/` - changes hot-reload automatically
- Run `npm run lint` to check code quality
- Run `npm test` to run tests

### Building for Production
```bash
npm run build
```
Creates optimized build in `build/` directory

### Deployment
See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment options to:
- Netlify (currently deployed)
- Vercel
- Other hosting platforms

## Project Structure

```
drinkbot3000_private/
├── src/              # Source code
│   ├── components/   # React components
│   ├── services/     # Business logic
│   ├── hooks/        # Custom hooks
│   └── state/        # State management
├── public/           # Static assets
├── docs/             # Documentation
└── build/            # Production build (generated)
```

## Common Commands

```bash
npm start              # Start dev server
npm run build          # Build for production
npm test               # Run tests
npm run lint           # Lint code
npm run format         # Format code
```

## Troubleshooting

### Port 3000 already in use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or specify different port
PORT=3001 npm start
```

### Dependencies won't install
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build fails
```bash
# Check Node version (need 18+)
node --version

# Update Node if needed
# Visit https://nodejs.org
```

## Next Steps

- Read [ARCHITECTURE.md](ARCHITECTURE.md) to understand the codebase
- Read [CONTRIBUTING.md](../CONTRIBUTING.md) to contribute
- Read [DEPLOYMENT.md](DEPLOYMENT.md) to deploy your own instance

## Support

- Documentation: [docs/README.md](README.md)
- Issues: [GitHub Issues](https://github.com/drinkbot3000/drinkbot3000_private/issues)
- Email: drinkbot3000@gmail.com
