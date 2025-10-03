# Mindsphere Mobile App

A WebView wrapper for the Mindsphere web application, built with Expo.

## Purpose

This mobile app wraps your existing Mindsphere website in a native WebView, providing:
- Native app experience for your web app
- Android APK for sideloading and testing
- Android AAB for Play Store distribution
- Proper navigation and error handling

## Prerequisites

- Node.js LTS (≥ 18.x)
- npm or yarn
- Expo CLI (via npx)
- Android device or emulator for testing

## Environment Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your website URL:
   ```
   EXPO_PUBLIC_APP_URL=https://your-website.com/
   EXPO_PUBLIC_ENV=production
   ```

**Important**: The URL must be HTTPS and accessible from mobile devices.

## Development

### Run Locally

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Scan QR code with Expo Go app on Android
# Or press 'a' for Android emulator
```

### Testing

See [docs/webview-test.md](./docs/webview-test.md) for comprehensive testing checklist.

## Building for Production

### Prerequisites

1. **Login to EAS**:
   ```bash
   npx eas login
   ```

2. **Configure EAS**:
   ```bash
   npx eas build:configure
   ```

### Build Commands

#### Android APK (Preview/Testing)
```bash
npx eas build -p android --profile preview
```
- Creates debuggable APK for internal testing
- Download and install on Android devices
- Good for testing and sharing with team

#### Android AAB (Production/Play Store)
```bash
npx eas build -p android --profile production
```
- Creates release AAB for Play Store
- Optimized and signed for production
- Upload to Google Play Console

### Credentials Management

**Android Keystore**: 
- First build: Choose "Let EAS handle credentials" 
- EAS will auto-generate and store keystore securely
- Manage later with: `npx eas credentials`

**Access Token (for CI)**:
- Get from: [expo.dev → Account → Settings → Access Tokens](https://expo.dev/accounts/settings/access-tokens)
- Store as `EXPO_TOKEN` in your CI environment
- Use for automated builds

## App Configuration

- **Name**: Mindsphere
- **Package**: com.mindsphere.app
- **Scheme**: mindsphere://
- **Permissions**: Internet, Camera, Storage (for file uploads)

## Features

- ✅ WebView wrapper for existing website
- ✅ Native navigation (back button handling)
- ✅ Pull-to-refresh
- ✅ External link handling
- ✅ File upload support
- ✅ JavaScript error forwarding
- ✅ Offline error handling
- ✅ Structured logging
- ✅ Android APK/AAB builds

## Limitations

- WebView wrapper (not native mobile app)
- Push notifications require additional setup
- Deep offline functionality needs extra work
- Background tasks need separate configuration
- Performance depends on website optimization

## Troubleshooting

### Configuration Errors
- Ensure `.env` has valid HTTPS URL
- Check `EXPO_PUBLIC_APP_URL` is set correctly
- Verify website is accessible from mobile

### Build Issues
- Run `npx eas login` first
- Check EAS build logs for specific errors
- Ensure Android keystore is configured

### WebView Issues
- Test website in mobile browser first
- Check network connectivity
- Review error logs for specific issues

## Next Steps

- Reply "NEXT" for optional iOS setup
- Reply "NEXT" for Play Store asset checklist
- Customize app icon and splash screen
- Add push notifications (if needed)
- Implement deep linking
