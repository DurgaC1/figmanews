# NewsGenie Mobile - React Native (Expo)

A mobile-first AI-powered news platform that delivers highly visual, bite-sized, preference-driven news stories in a "TikTok for News" format, built with React Native and Expo for iOS and Android.

## Features

### 📱 Core Functionality
- **TikTok-Style Vertical Swipe**: Immersive full-screen news cards with smooth vertical scrolling
- **AI-Powered Summaries**: Get key points instantly without reading full articles
- **Dual View Modes**: Switch between swipe view and traditional detail view
- **Category Filtering**: Browse news by Politics, Sports, Tech, Entertainment, Business, and more
- **Multi-Language Support**: Read news in 10+ Indian languages including Hindi, Bengali, Tamil, Telugu, etc.

### 🎨 User Experience
- **8-Screen Onboarding Journey**: Welcome → Intro → Preferences → Saved → View Type → Notifications
- **Source Credibility Badges**: Verified, Trusted, and Emerging source indicators
- **Related Discussions**: See engagement metrics for each story
- **Audio Playback**: Listen to news summaries (coming soon)
- **Bookmark & Share**: Save stories and share with friends

### 🎯 Personalization
- **Interest-Based Feed**: Select topics you care about during onboarding
- **Preference Persistence**: Your choices are saved with AsyncStorage
- **Customizable Experience**: Refine preferences anytime

## Tech Stack

- **Framework**: React Native (Expo SDK 51)
- **Language**: TypeScript
- **UI Components**: 
  - Expo Vector Icons (Ionicons)
  - Expo Linear Gradient
  - Expo Blur
- **Storage**: AsyncStorage
- **Gestures**: React Native Gesture Handler
- **Notifications**: Expo Notifications

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- For iOS: Xcode (macOS only)
- For Android: Android Studio

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd newsgenie-mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device/simulator**

   **iOS (macOS only):**
   ```bash
   npx expo start --ios
   ```

   **Android:**
   ```bash
   npx expo start --android
   ```

   **Or use Expo Go app:**
   - Download "Expo Go" from App Store (iOS) or Play Store (Android)
   - Scan the QR code from the terminal

## Project Structure

```
newsgenie-mobile/
├── App.tsx                          # Main entry point
├── app.json                         # Expo configuration
├── package.json                     # Dependencies
├── components/
│   ├── WelcomeScreen.tsx           # Onboarding: Welcome
│   ├── IntroScreen.tsx             # Onboarding: How it works
│   ├── OnboardingPreferences.tsx   # Onboarding: Choose interests
│   ├── PreferencesSaved.tsx        # Onboarding: Confirmation
│   ├── ViewTypePreference.tsx      # Onboarding: Choose view style
│   ├── NotificationsPermission.tsx # Onboarding: Enable notifications
│   ├── NewsCard.tsx                # TikTok-style swipe view
│   ├── NewsDetailView.tsx          # Traditional detail view
│   ├── CategoryFilter.tsx          # Category selection chips
│   ├── LanguageSelector.tsx        # Multi-language selector
│   ├── BottomNav.tsx               # Bottom navigation bar
│   └── ViewTypeToggle.tsx          # View mode toggle button
└── data/
    └── mockNews.tsx                # Mock news data

```

## Key Components

### Onboarding Flow
The app includes a complete 6-screen onboarding journey:
1. **Welcome** - App introduction
2. **Intro** - Feature highlights
3. **Preferences** - Interest selection (8 categories)
4. **Saved** - Confirmation with refine/preview options
5. **View Type** - Choose swipe or detail view
6. **Notifications** - Permission request

### News Feed
- **Swipe View**: FlatList with paginated vertical scrolling
- **Detail View**: ScrollView with full article content
- **Category Filter**: Horizontal scroll with emoji categories
- **Language Selector**: Modal with 10+ Indian languages

### Persistence
User preferences, onboarding status, and view type are saved using AsyncStorage.

## Building for Production

### iOS
1. Configure signing in Xcode
2. Build:
   ```bash
   eas build --platform ios
   ```

### Android
1. Configure signing certificate
2. Build:
   ```bash
   eas build --platform android
   ```

## Customization

### Add More News Categories
Edit `components/OnboardingPreferences.tsx` and `components/CategoryFilter.tsx`:
```typescript
const categories = [
  { id: 'new-category', label: 'New Category', emoji: '📚', color: '#FF6B6B' },
  // ... existing categories
];
```

### Add More Languages
Edit `components/LanguageSelector.tsx`:
```typescript
const languages = [
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  // ... existing languages
];
```

### Integrate Real News API
Replace mock data in `data/mockNews.tsx` with API calls:
```typescript
// Example using fetch
const response = await fetch('https://your-api.com/news');
const newsData = await response.json();
```

## Performance Optimization

- **FlatList**: Uses `getItemLayout` for optimal scrolling
- **Image Caching**: Expo Image handles caching automatically
- **Lazy Loading**: Components load on demand
- **BlurView**: Hardware-accelerated blur effects

## Known Issues & Solutions

### BlurView not working on Android
- Ensure `expo-blur` is properly installed
- Use alternative background for Android if needed

### AsyncStorage warnings
- Normal in development mode
- Ensure proper error handling in production

## Future Enhancements

- [ ] Audio playback for news summaries (Expo AV integration)
- [ ] Real-time notifications for breaking news
- [ ] Social features (comments, discussions)
- [ ] Offline mode with cached articles
- [ ] Dark/Light theme toggle
- [ ] Bookmark synchronization across devices
- [ ] Real API integration (News API, custom backend)
- [ ] Analytics integration (Firebase, Amplitude)

## Support

For issues, questions, or contributions:
- Create an issue in the repository
- Contact the development team

## License

Copyright © 2025 NewsGenie. All rights reserved.

---

Built with ❤️ using React Native + Expo
