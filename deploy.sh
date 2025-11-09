#!/bin/bash

# DrinkBot3000 - Quick Deploy Script

echo "🤖 DrinkBot3000 - Quick Deploy Script"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org"
    echo ""
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Build the project
echo "🔨 Building production version..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build successful!"
echo ""
echo "======================================"
echo "🎉 Your app is ready to deploy!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Go to https://app.netlify.com/drop"
echo "2. Drag and drop the 'build' folder"
echo "3. Your site will be live in seconds!"
echo ""
echo "Or test locally first:"
echo "  npm start"
echo ""
echo "See DEPLOYMENT.md for more options."
echo ""
