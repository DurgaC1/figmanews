# Mobile Setup & Troubleshooting

## Quick Start for Mobile

1. **Clear cache and restart**:
   ```bash
   npm run start:clear
   # or
   npm run reset
   ```

2. **For iOS**:
   ```bash
   npm run ios
   ```

3. **For Android**:
   ```bash
   npm run android
   ```

## Common Errors & Solutions

### 1. Reanimated `__reanimatedLoggerConfig` Error
**Status**: Handled gracefully
- The app initializes Reanimated early but continues if it fails
- This is expected in some development environments
- **Solution**: This is non-blocking - the app will still work

### 2. "Missing default export" Warnings
**Status**: False positive
- Both `app/_layout.tsx` and `app/index.tsx` have proper default exports
- These warnings appear during Metro bundler's route scanning
- **Solution**: Safe to ignore - restart Metro to clear

### 3. ExpoSQLiteNext Native Module Error
**Status**: Expected in Expo Go
- SQLite requires native code that isn't available in Expo Go
- The database service gracefully falls back to no-op mode
- **Solution**: For full functionality, create a development build:
  ```bash
  npx expo prebuild
  npx expo run:ios  # or run:android
  ```

## Building for Production

### Development Build (Recommended)
```bash
# Install EAS CLI
npm install -g eas-cli

# Configure
eas build:configure

# Build for iOS
eas build --platform ios --profile development

# Build for Android
eas build --platform android --profile development
```

### Local Development Build
```bash
# Generate native code
npx expo prebuild

# Run on iOS
npx expo run:ios

# Run on Android
npx expo run:android
```

## Testing on Physical Device

1. **Expo Go** (Quick testing):
   - Install Expo Go app from App Store/Play Store
   - Scan QR code from `expo start`
   - Note: Some features (SQLite, some native modules) won't work

2. **Development Build** (Full features):
   - Build using EAS or `expo run:ios/android`
   - Install on device via TestFlight (iOS) or APK (Android)
   - All features work including SQLite, notifications, etc.

## Configuration Files

- `app.json` - Expo configuration (scheme, plugins, etc.)
- `babel.config.js` - Babel plugins (Reanimated, NativeWind)
- `metro.config.js` - Metro bundler config
- `tsconfig.json` - TypeScript config

## Scripts

- `npm start` - Start Expo development server
- `npm run start:clear` - Start with cleared cache
- `npm run ios` - Start and open iOS simulator
- `npm run android` - Start and open Android emulator
- `npm run reset` - Clear all caches and restart

## Notes

- The app works in Expo Go for UI testing
- For full functionality (SQLite, audio, notifications), use a development build
- All errors are handled gracefully - the app continues to work even if some services fail


