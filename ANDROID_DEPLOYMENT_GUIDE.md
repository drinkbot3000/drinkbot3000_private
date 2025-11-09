# 📱 Android Deployment & WebView Configuration Guide

## 🎯 Complete Setup Instructions

This guide will help you properly configure your Android app with the latest WebView settings and ensure all assets are accessible.

---

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ Node.js installed (v16 or higher)
- ✅ Android Studio installed
- ✅ Java JDK 11 or higher
- ✅ Android SDK installed via Android Studio

---

## 🚀 Step 1: Initialize Capacitor

```bash
# Navigate to your project directory
cd /path/to/drinkbot3000

# Install dependencies
npm install

# Build your React app
npm run build

# Initialize Capacitor (if not already done)
npx cap init DrinkBot3000 com.drinkbot.app --web-dir=build

# Add Android platform
npx cap add android

# Sync assets
npx cap sync android
```

---

## ⚙️ Step 2: Configure AndroidX WebKit

### Update build.gradle (Module: app)

Open `android/app/build.gradle` and add/update these dependencies:

```gradle
dependencies {
    // Capacitor Core
    implementation project(':capacitor-android')
    
    // AndroidX WebKit - LATEST VERSION
    implementation 'androidx.webkit:webkit:1.8.0'
    
    // AndroidX Core
    implementation 'androidx.core:core-ktx:1.12.0'
    implementation 'androidx.appcompat:appcompat:1.6.1'
    
    // Material Design
    implementation 'com.google.android.material:material:1.10.0'
    
    // ConstraintLayout
    implementation 'androidx.constraintlayout:constraintlayout:2.1.4'
    
    // Splash Screen
    implementation 'androidx.core:core-splashscreen:1.0.1'
}
```

### Update build.gradle (Project level)

Open `android/build.gradle` and ensure you have:

```gradle
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.1.2'
        classpath 'com.google.gms:google-services:4.4.0'
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
        maven { url 'https://jitpack.io' }
    }
}
```

---

## 🔧 Step 3: Configure MainActivity

### Update MainActivity.java

Open `android/app/src/main/java/com/drinkbot/app/MainActivity.java`:

```java
package com.drinkbot.app;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import androidx.webkit.WebSettingsCompat;
import androidx.webkit.WebViewFeature;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Configure WebView settings
        configureWebView();
    }
    
    private void configureWebView() {
        WebView webView = getBridge().getWebView();
        WebSettings settings = webView.getSettings();
        
        // Enable JavaScript (required for React)
        settings.setJavaScriptEnabled(true);
        
        // Enable DOM Storage (required for localStorage)
        settings.setDomStorageEnabled(true);
        
        // Enable Database Storage
        settings.setDatabaseEnabled(true);
        
        // Allow file access
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        
        // Enable mixed content mode (HTTPS + HTTP)
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        
        // Cache settings for better performance
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setAppCacheEnabled(true);
        
        // Zoom settings
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        
        // Text settings
        settings.setTextZoom(100);
        settings.setDefaultTextEncodingName("utf-8");
        
        // Hardware acceleration
        webView.setLayerType(WebView.LAYER_TYPE_HARDWARE, null);
        
        // Enable safe browsing (if available)
        if (WebViewFeature.isFeatureSupported(WebViewFeature.SAFE_BROWSING_ENABLE)) {
            WebSettingsCompat.setSafeBrowsingEnabled(settings, true);
        }
        
        // Force dark mode support (if available)
        if (WebViewFeature.isFeatureSupported(WebViewFeature.FORCE_DARK)) {
            WebSettingsCompat.setForceDark(settings, WebSettingsCompat.FORCE_DARK_AUTO);
        }
        
        // Geolocation (optional - only if you need it)
        settings.setGeolocationEnabled(false);
        
        // Media playback
        settings.setMediaPlaybackRequiresUserGesture(false);
    }
}
```

---

## 📱 Step 4: Configure AndroidManifest.xml

Open `android/app/src/main/AndroidManifest.xml` and ensure it has:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.drinkbot.app">

    <!-- Internet permission (required) -->
    <uses-permission android:name="android.permission.INTERNET" />
    
    <!-- Network state (for checking connectivity) -->
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    
    <!-- Wake lock (to prevent sleep during use) -->
    <uses-permission android:name="android.permission.WAKE_LOCK" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme"
        android:usesCleartextTraffic="true"
        android:hardwareAccelerated="true"
        android:largeHeap="true">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTask"
            android:theme="@style/AppTheme.NoActionBarLaunch"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
            android:windowSoftInputMode="adjustResize">
            
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
            
            <!-- Deep linking (optional) -->
            <intent-filter android:autoVerify="true">
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="https"
                      android:host="drinkbot3000.app" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

---

## 🎨 Step 5: Verify Assets Integration

### Check App Icons

Ensure all icon files are in the correct mipmap folders:

```
android/app/src/main/res/
├── mipmap-mdpi/
│   └── ic_launcher.png (48x48)
├── mipmap-hdpi/
│   └── ic_launcher.png (72x72)
├── mipmap-xhdpi/
│   └── ic_launcher.png (96x96)
├── mipmap-xxhdpi/
│   └── ic_launcher.png (144x144)
└── mipmap-xxxhdpi/
    └── ic_launcher.png (192x192)
```

### Copy Icons Command

```bash
# From your project root
cp public/48.png android/app/src/main/res/mipmap-mdpi/ic_launcher.png
cp public/72.png android/app/src/main/res/mipmap-hdpi/ic_launcher.png
cp public/96.png android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
cp public/144.png android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
cp public/192.png android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png
```

### Check Splash Screen

Ensure splash screen is configured in `android/app/src/main/res/values/styles.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="AppTheme" parent="Theme.AppCompat.Light.DarkActionBar">
        <item name="colorPrimary">@color/colorPrimary</item>
        <item name="colorPrimaryDark">@color/colorPrimaryDark</item>
        <item name="colorAccent">@color/colorAccent</item>
    </style>

    <style name="AppTheme.NoActionBarLaunch" parent="AppTheme">
        <item name="android:background">@drawable/splash</item>
        <item name="android:windowNoTitle">true</item>
        <item name="android:windowActionBar">false</item>
        <item name="android:windowFullscreen">true</item>
        <item name="android:windowContentOverlay">@null</item>
    </style>
</resources>
```

---

## 🛠️ Step 6: Configure Gradle Properties

Create/update `android/gradle.properties`:

```properties
# Android Build Settings
android.useAndroidX=true
android.enableJetifier=true

# Build Performance
org.gradle.jvmargs=-Xmx4096m -XX:MaxPermSize=512m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8
org.gradle.daemon=true
org.gradle.parallel=true
org.gradle.configureondemand=true
org.gradle.caching=true

# Kotlin
kotlin.code.style=official

# AndroidX Migration
android.useAndroidX=true
android.enableJetifier=true
```

---

## 🏗️ Step 7: Build and Test

### Build Debug APK

```bash
# Sync Capacitor
npx cap sync android

# Open in Android Studio
npx cap open android

# In Android Studio:
# 1. Let Gradle sync complete
# 2. Build -> Make Project (Ctrl+F9 / Cmd+F9)
# 3. Run -> Run 'app' (Shift+F10 / Ctrl+R)
```

### Build Release APK

```bash
# In Android Studio:
# 1. Build -> Generate Signed Bundle / APK
# 2. Choose APK
# 3. Create new keystore or use existing
# 4. Build release APK

# Or via command line:
cd android
./gradlew assembleRelease

# APK will be at:
# android/app/build/outputs/apk/release/app-release.apk
```

---

## 🧪 Step 8: Testing Checklist

Test your app thoroughly on both emulator and physical devices:

### Functional Tests:
- [ ] App launches without crashes
- [ ] All screens load correctly
- [ ] Age verification works
- [ ] Safety screens display properly
- [ ] BAC calculations are correct
- [ ] Drink tracking works
- [ ] History saves and loads
- [ ] localStorage persists data
- [ ] Buttons respond to touch
- [ ] No white screens or blank pages

### UI/UX Tests:
- [ ] Icons display correctly
- [ ] Text is readable (not too small)
- [ ] Touch targets are 44x44px minimum
- [ ] No zoom on input focus
- [ ] Smooth scrolling
- [ ] Proper safe area insets (notched devices)
- [ ] No overflow issues
- [ ] Responsive on different screen sizes

### Performance Tests:
- [ ] App loads in < 3 seconds
- [ ] Smooth 60fps animations
- [ ] No memory leaks
- [ ] Battery usage is reasonable
- [ ] Network requests work (if any)

### Device Tests:
Test on multiple devices:
- [ ] Small phone (5" screen)
- [ ] Medium phone (6" screen)
- [ ] Large phone (6.5"+ screen)
- [ ] Tablet (optional)
- [ ] Old Android (API 24+)
- [ ] New Android (API 33+)

---

## 🐛 Troubleshooting Common Issues

### Issue: White Screen on Launch
**Solution:**
```bash
# Clear build and rebuild
cd android
./gradlew clean
npx cap sync android
```

### Issue: Assets Not Loading
**Solution:**
- Check that `npm run build` was executed
- Verify build folder exists and has content
- Run `npx cap sync android` again
- Check server.allowNavigation in capacitor.config.json

### Issue: localStorage Not Working
**Solution:**
- Ensure `setDomStorageEnabled(true)` in MainActivity
- Check WebView isn't in incognito mode
- Verify app has storage permissions

### Issue: Icons Not Showing
**Solution:**
```bash
# Regenerate icons
npx capacitor-assets generate --android

# Or manually copy:
cp public/*.png android/app/src/main/res/mipmap-*/
```

### Issue: WebView Crashes
**Solution:**
- Update AndroidX WebKit to latest version
- Enable hardware acceleration
- Increase heap size in gradle.properties
- Check for JavaScript errors in Logcat

### Issue: Keyboard Covers Input
**Solution:**
- Set `android:windowSoftInputMode="adjustResize"` in manifest
- Or use `adjustPan` if that doesn't work

---

## 📊 Check WebView Version

You can check the installed WebView version programmatically:

```java
import android.webkit.WebView;

String webViewVersion = new WebView(this).getSettings().getUserAgentString();
Log.d("WebView", "Version: " + webViewVersion);
```

Or via ADB:
```bash
adb shell pm list packages | grep webview
adb shell dumpsys package com.google.android.webview | grep versionName
```

---

## 🔍 Debugging Tools

### View Logs in Real-Time:
```bash
# All logs
adb logcat

# Filter by app
adb logcat | grep com.drinkbot.app

# Filter by tag
adb logcat | grep WebView
```

### Chrome DevTools:
1. Open Chrome on desktop
2. Navigate to `chrome://inspect`
3. Connect Android device via USB
4. Enable USB debugging on device
5. Click "Inspect" on your app's WebView

---

## ✅ Final Checklist

Before submitting to Play Store:

- [ ] All icons in place (48, 72, 96, 144, 192, 512)
- [ ] AndroidManifest.xml properly configured
- [ ] MainActivity.java has WebView configuration
- [ ] build.gradle has AndroidX WebKit 1.8.0+
- [ ] Tested on 3+ devices/emulators
- [ ] No crashes in production build
- [ ] All features work correctly
- [ ] Privacy policy URL in Play Console
- [ ] Terms of service URL in Play Console
- [ ] Screenshots ready (2-8 images)
- [ ] App description written
- [ ] Content rating completed
- [ ] Pricing set (free)

---

## 🚀 Deploy to Play Store

Once everything is working:

1. **Generate Signed APK:**
   - Build -> Generate Signed Bundle / APK
   - Choose Android App Bundle (AAB) for Play Store
   - Sign with your release keystore

2. **Upload to Play Console:**
   - Go to https://play.google.com/console
   - Create new app
   - Upload AAB file
   - Fill in all required information
   - Submit for review

3. **Review Time:**
   - Typically 1-3 days
   - Monitor for any rejection reasons
   - Address feedback and resubmit if needed

---

## 📚 Additional Resources

- [Capacitor Android Docs](https://capacitorjs.com/docs/android)
- [Android WebView Docs](https://developer.android.com/reference/android/webkit/WebView)
- [AndroidX WebKit](https://developer.android.com/jetpack/androidx/releases/webkit)
- [Play Store Guidelines](https://play.google.com/about/developer-content-policy/)

---

## 💬 Need Help?

If you encounter issues:
1. Check Logcat for error messages
2. Google the specific error
3. Check Stack Overflow
4. Review Capacitor documentation
5. Ask in Capacitor Community Discord

---

**You're ready to deploy! Good luck! 🚀🤖**
