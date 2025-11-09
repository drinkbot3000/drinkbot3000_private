#!/bin/bash

# ================================================
# DrinkBot3000 Production Build Script
# ================================================
# This script automates the production build process
# for both web and mobile platforms

set -e  # Exit on error

echo "🤖 DrinkBot3000 Production Build Script"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "ℹ️  $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

print_success "Node.js is installed: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_success "npm is installed: $(npm --version)"
echo ""

# Clean previous builds
print_info "Cleaning previous builds..."
rm -rf build/
rm -rf android/app/build/
rm -rf ios/App/build/
print_success "Cleaned previous builds"
echo ""

# Install dependencies
print_info "Installing dependencies..."
npm install
print_success "Dependencies installed"
echo ""

# Run production build
print_info "Building React app for production..."
npm run build

if [ ! -d "build" ]; then
    print_error "Build failed! build/ directory not found."
    exit 1
fi

print_success "React app built successfully"
echo ""

# Optimize build
print_info "Optimizing build..."

# Check build size
BUILD_SIZE=$(du -sh build/ | cut -f1)
print_info "Build size: $BUILD_SIZE"

# Count files
FILE_COUNT=$(find build/ -type f | wc -l)
print_info "Total files: $FILE_COUNT"

# Verify critical files exist
CRITICAL_FILES=("build/index.html" "build/manifest.json" "build/static")

for file in "${CRITICAL_FILES[@]}"; do
    if [ -e "$file" ]; then
        print_success "Found: $file"
    else
        print_warning "Missing: $file"
    fi
done

echo ""

# Ask user what platform to build for
echo "📱 Select platform to build:"
echo "1) Web only"
echo "2) Android only"
echo "3) iOS only"
echo "4) Both Android and iOS"
echo "5) All platforms (Web + Android + iOS)"
echo ""
read -p "Enter your choice (1-5): " platform_choice

case $platform_choice in
    1)
        print_info "Building for web only..."
        print_success "Web build complete! Check the build/ directory"
        ;;
    2)
        print_info "Building for Android..."
        
        # Check if Capacitor is initialized
        if [ ! -f "capacitor.config.json" ]; then
            print_error "Capacitor not initialized. Run: npx cap init"
            exit 1
        fi
        
        # Sync to Android
        print_info "Syncing to Android..."
        npx cap sync android
        print_success "Synced to Android"
        
        # Open Android Studio
        print_info "Opening Android Studio..."
        npx cap open android
        
        print_success "Android project ready!"
        print_info "Build your APK/AAB in Android Studio: Build -> Generate Signed Bundle/APK"
        ;;
    3)
        print_info "Building for iOS..."
        
        # Check if on macOS
        if [[ "$OSTYPE" != "darwin"* ]]; then
            print_error "iOS builds require macOS. You're on: $OSTYPE"
            exit 1
        fi
        
        # Check if Capacitor is initialized
        if [ ! -f "capacitor.config.json" ]; then
            print_error "Capacitor not initialized. Run: npx cap init"
            exit 1
        fi
        
        # Sync to iOS
        print_info "Syncing to iOS..."
        npx cap sync ios
        print_success "Synced to iOS"
        
        # Open Xcode
        print_info "Opening Xcode..."
        npx cap open ios
        
        print_success "iOS project ready!"
        print_info "Build your IPA in Xcode: Product -> Archive"
        ;;
    4)
        print_info "Building for Android and iOS..."
        
        # Android
        if [ -f "capacitor.config.json" ]; then
            print_info "Syncing to Android..."
            npx cap sync android
            print_success "Synced to Android"
        else
            print_warning "Capacitor not initialized for Android"
        fi
        
        # iOS
        if [[ "$OSTYPE" == "darwin"* ]]; then
            print_info "Syncing to iOS..."
            npx cap sync ios
            print_success "Synced to iOS"
        else
            print_warning "iOS builds require macOS (skipping)"
        fi
        
        print_success "Mobile platforms ready!"
        print_info "Next steps:"
        print_info "  - Android: npx cap open android"
        print_info "  - iOS: npx cap open ios"
        ;;
    5)
        print_info "Building for all platforms..."
        
        # Web is already built
        print_success "Web: ✓"
        
        # Android
        if [ -f "capacitor.config.json" ]; then
            print_info "Syncing to Android..."
            npx cap sync android
            print_success "Android: ✓"
        else
            print_warning "Android: Capacitor not initialized"
        fi
        
        # iOS
        if [[ "$OSTYPE" == "darwin"* ]]; then
            print_info "Syncing to iOS..."
            npx cap sync ios
            print_success "iOS: ✓"
        else
            print_warning "iOS: Requires macOS (skipped)"
        fi
        
        print_success "All platforms ready!"
        ;;
    *)
        print_error "Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "================================================"
echo "🎉 Build Complete!"
echo "================================================"
echo ""

# Display next steps
print_info "Next steps:"
echo ""

case $platform_choice in
    1)
        echo "📦 Web Build:"
        echo "   - Upload build/ folder to your hosting provider"
        echo "   - Or serve locally: npx serve -s build"
        ;;
    2)
        echo "📱 Android:"
        echo "   1. Open Android Studio (should already be open)"
        echo "   2. Build -> Generate Signed Bundle/APK"
        echo "   3. Choose Android App Bundle (AAB) for Play Store"
        echo "   4. Sign with your release keystore"
        echo "   5. Upload to Play Console"
        ;;
    3)
        echo "🍎 iOS:"
        echo "   1. Open Xcode (should already be open)"
        echo "   2. Select 'Any iOS Device' as target"
        echo "   3. Product -> Archive"
        echo "   4. Distribute App -> App Store Connect"
        echo "   5. Upload to App Store Connect"
        ;;
    4|5)
        echo "📱 Android:"
        echo "   - Run: npx cap open android"
        echo "   - Build -> Generate Signed Bundle/APK"
        echo ""
        echo "🍎 iOS:"
        echo "   - Run: npx cap open ios"
        echo "   - Product -> Archive"
        echo ""
        echo "📦 Web:"
        echo "   - Upload build/ folder to hosting"
        ;;
esac

echo ""
echo "📚 Documentation:"
echo "   - Android Guide: ANDROID_DEPLOYMENT_GUIDE.md"
echo "   - Remaining Tasks: REMAINING_TASKS.md"
echo "   - Icon Guide: ICON_INTEGRATION_GUIDE.md"
echo ""

print_success "Good luck with your deployment! 🚀🤖"
