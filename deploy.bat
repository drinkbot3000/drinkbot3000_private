@echo off
REM DrinkBot3000 - Quick Deploy Script for Windows

echo.
echo ======================================
echo 🤖 DrinkBot3000 - Quick Deploy Script
echo ======================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed!
    echo Please install Node.js from https://nodejs.org
    echo.
    pause
    exit /b 1
)

node --version
echo ✅ Node.js found
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed
echo.

REM Build the project
echo 🔨 Building production version...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)

echo ✅ Build successful!
echo.
echo ======================================
echo 🎉 Your app is ready to deploy!
echo ======================================
echo.
echo Next steps:
echo 1. Go to https://app.netlify.com/drop
echo 2. Drag and drop the 'build' folder
echo 3. Your site will be live in seconds!
echo.
echo Or test locally first:
echo   npm start
echo.
echo See DEPLOYMENT.md for more options.
echo.
pause
