# NewsGenie Mobile - Quick Setup Guide

## Installation Steps

### 1. Install Node.js
Download and install from [nodejs.org](https://nodejs.org/) (v18 or higher)

### 2. Install Expo CLI
```bash
npm install -g expo-cli
```

### 3. Install Dependencies
```bash
cd newsgenie-mobile
npm install
```

### 4. Start Development Server
```bash
npx expo start
```

## Running the App

### Option 1: Using Expo Go (Easiest)
1. Install "Expo Go" from:
   - **iOS**: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - **Android**: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Open Expo Go app
3. Scan QR code from terminal

### Option 2: iOS Simulator (macOS only)
```bash
npx expo start --ios
```
*Requires Xcode installed*

### Option 3: Android Emulator
```bash
npx expo start --android
```
*Requires Android Studio with emulator configured*

## Project Structure Overview

```
├── App.tsx                    # Main app entry point
├── components/
│   ├── Onboarding Screens    # Welcome, Intro, Preferences, etc.
│   ├── NewsCard.tsx          # TikTok-style swipe view
│   ├── NewsDetailView.tsx    # Detail article view
│   └── Navigation            # Bottom nav, filters, etc.
└── data/
    └── mockNews.tsx          # Sample news data
```

## Key Features to Test

### Onboarding Flow
1. **Welcome Screen** - Tap "Get Started" or "Skip"
2. **Intro Screen** - Learn features
3. **Preferences** - Select interest categories
4. **Saved** - Confirm or refine
5. **View Type** - Choose swipe or detail view
6. **Notifications** - Allow or skip

### News Feed
- **Swipe vertically** through news cards
- **Tap "Read Full Story"** to view details
- **Use category filter** at top
- **Change language** (top right)
- **Toggle view type** (top right icon)

### Actions
- **Bookmark** - Save articles (right side buttons)
- **Share** - Share articles
- **Audio** - Play summary (placeholder)
- **Bottom Nav** - Switch between sections

## Common Issues

### Port Already in Use
```bash
# Kill existing Metro bundler
npx expo start -c
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npx expo start -c
```

### iOS Build Failed
- Ensure Xcode is installed and updated
- Run: `sudo xcode-select --switch /Applications/Xcode.app`

### Android Build Failed
- Ensure Android Studio is installed
- Verify emulator is running: `adb devices`

## Next Steps

1. **Test onboarding flow** - Complete all 6 screens
2. **Try swipe view** - Vertical scroll through news
3. **Switch to detail view** - Tap toggle button
4. **Filter categories** - Test category chips
5. **Change language** - Open language selector

## Customization

### Change App Colors
Edit colors in component files:
- Primary blue: `#2563EB`
- Success green: `#10B981`
- Accent colors in category badges

### Add Real News Data
Replace `data/mockNews.tsx` with API integration:
```typescript
// Example
const fetchNews = async () => {
  const response = await fetch('YOUR_API_URL');
  return await response.json();
};
```

### Modify Categories
Edit `components/OnboardingPreferences.tsx`:
```typescript
const categories = [
  { id: 'yourCategory', label: 'Label', emoji: '🎯' },
];
```

## Building for Production

### Create Expo Account
```bash
npx expo login
```

### Build for iOS
```bash
eas build --platform ios
```

### Build for Android
```bash
eas build --platform android
```

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Expo Vector Icons](https://icons.expo.fyi/)

## Need Help?

- Check the main README.md for detailed documentation
- Review component files for inline comments
- Test with Expo Go first before simulator/emulator

---

Happy Coding! 🚀
