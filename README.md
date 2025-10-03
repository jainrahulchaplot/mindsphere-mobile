# MindSphere Mobile

> React Native mobile app for MindSphere mental wellness platform

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Expo CLI
- iOS Simulator or Android Emulator
- Physical device for testing

### Installation
```bash
npm install
```

### Development
```bash
npm start          # Start Expo development server
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
npm run web        # Run as web app
```

## 📁 Project Structure

```
src/
├── components/     # Reusable components
├── lib/           # Utility libraries
├── App.tsx        # Main app component
└── index.ts       # Entry point
```

## 📱 Features

### WebView Integration
- Embedded web app
- Native device features
- Seamless user experience
- Offline capabilities

### Native Features
- Push notifications
- Device sensors
- Camera access
- File system access

### Cross-Platform
- iOS and Android support
- Consistent UI/UX
- Platform-specific optimizations
- Single codebase

## 🔧 Configuration

### App Configuration
- **App Name**: MindSphere
- **Bundle ID**: com.mindsphere.app
- **Version**: 1.0.0
- **Platform**: iOS, Android, Web

### Environment Variables
```env
# Backend API
EXPO_PUBLIC_API_URL=https://your-backend-url.com

# Supabase
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# LiveKit
EXPO_PUBLIC_LIVEKIT_URL=your_livekit_url
```

## 🎨 UI Components

### WebView Shell
- `WebViewShell` - Main web view component
- Custom navigation
- Loading states
- Error handling

### Native Components
- Status bar management
- Safe area handling
- Platform-specific styling
- Accessibility features

## 🧪 Testing

```bash
# Run tests
npm test

# Test on device
npm run test:device

# E2E testing
npm run test:e2e
```

## 🚀 Deployment

### Expo Application Services (EAS)
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Build for production
eas build --platform all

# Submit to app stores
eas submit --platform all
```

### Development Builds
```bash
# Create development build
eas build --profile development

# Install on device
eas build:run
```

## 📱 Platform Support

### iOS
- **Minimum Version**: iOS 13.0
- **Target Version**: iOS 17.0
- **Devices**: iPhone, iPad
- **Features**: Face ID, Touch ID, Siri

### Android
- **Minimum Version**: Android 8.0 (API 26)
- **Target Version**: Android 14 (API 34)
- **Devices**: Phone, Tablet
- **Features**: Fingerprint, Biometric, Google Assistant

### Web
- **Browsers**: Chrome, Safari, Firefox, Edge
- **Features**: PWA support, Offline mode
- **Responsive**: Mobile and desktop

## 🔧 Development

### Adding Native Features
1. Install required packages
2. Configure permissions
3. Implement platform-specific code
4. Test on both platforms

### WebView Integration
1. Configure web view settings
2. Handle navigation events
3. Implement communication bridge
4. Test web app integration

### Styling
- Use Expo's styling system
- Platform-specific styles
- Responsive design
- Dark mode support

### Error Handling
- No fallback data - fail fast with clear errors
- Comprehensive error logging with correlation IDs
- Service-specific error tracking
- Environment-aware logging levels

### Git Workflow
```bash
# Make changes
git add .
git commit -m "feat: add offline mode support"
git push origin feature/offline-mode
```

## 📊 Performance

### Optimization
- Lazy loading
- Image optimization
- Bundle size optimization
- Memory management

### Monitoring
- Performance metrics
- Crash reporting
- User analytics
- Error tracking

## 🐛 Troubleshooting

### Common Issues
1. **Build Errors**: Check Expo CLI version
2. **Device Issues**: Verify device compatibility
3. **WebView Issues**: Check web app connectivity
4. **Performance**: Monitor memory usage

### Debug Mode
```bash
# Enable debug logging
EXPO_DEBUG=true npm start
```

## 📚 Dependencies

### Core
- `expo` - Expo SDK
- `react-native` - React Native framework
- `react-native-web` - Web support

### WebView
- `react-native-webview` - WebView component
- `@react-native-async-storage/async-storage` - Storage

### Navigation
- `@react-navigation/native` - Navigation
- `@react-navigation/stack` - Stack navigator

### Utilities
- `expo-constants` - App constants
- `expo-status-bar` - Status bar management

## 🔒 Security

### App Security
- Code obfuscation
- API key protection
- Secure storage
- Certificate pinning

### Privacy
- Data encryption
- User consent
- GDPR compliance
- Data minimization

## 📄 License

MIT License - see [LICENSE](../../LICENSE) for details.