# Intro/Welcome Screen Documentation

## Overview
The IntroScreen is the first screen users see when launching NewsGenie. It introduces the app's value proposition and provides authentication options.

## Implementation Details

### Location
- **Screen Component**: `/src/screens/onboarding/IntroScreen.tsx`
- **Navigation**: Configured in `/src/navigation/OnboardingNavigator.tsx`
- **Auth Service**: `/src/services/auth/oauthService.ts`
- **Consent Banner**: `/src/components/ConsentBanner.tsx`

### Features Implemented

#### FR-INTRO-01: Brand Header ✅
- App logo with gradient background
- "NewsGenie" title
- "Stay informed effortlessly" tagline
- Animated particle background (respects reduced-motion accessibility)

#### FR-INTRO-02: Value Prop Cards ✅
Two side-by-side cards displaying:

1. **"See stories from every side"**
   - Multiple source visualization
   - Demonstrates varied perspectives

2. **"Learn faster, your way"**
   - Sample story tile with image
   - Shows control features (summaries, audio, etc.)

#### FR-INTRO-03: Platform-Specific Authentication ✅
- **iOS**: "Continue with Apple" (primary) + Facebook (secondary)
- **Android/Web**: "Continue with Google" (primary) + Facebook (secondary)
- OAuth flow integration with Expo AuthSession
- Mock authentication for development (remove in production)

#### FR-INTRO-04: Legal & Policy ✅
- Privacy Policy, Terms, Data Use links
- Opens in WebBrowser
- Consent banner for personalization (shown after first sign-in)
- Consent state stored in user preferences (`consentPersonalization`)

### Technical Implementation

#### Dependencies
```typescript
- expo-linear-gradient: Gradient backgrounds
- expo-auth-session: OAuth flows
- expo-web-browser: In-app browser for legal links
- @react-navigation/stack: Navigation
- @expo/vector-icons: Icons
```

#### State Management
- User authentication state: Zustand (`useUserStore`)
- Consent tracking: `preferences.consentPersonalization`
- Auth provider tracking: `authProvider` field in User type

#### Animations
- Particle animation system (20 particles)
- Respects `AccessibilityInfo.isReduceMotionEnabled()`
- Smooth entrance/exit animations

#### Platform Detection
- `Platform.OS === 'ios'` → Apple Sign In
- Otherwise → Google Sign In
- Both platforms show Facebook as secondary option

### OAuth Configuration

#### Setup Required
Update OAuth credentials in `/src/services/auth/oauthService.ts`:

```typescript
const OAUTH_CONFIGS = {
  google: {
    clientId: 'YOUR_GOOGLE_CLIENT_ID',
    // ... other config
  },
  apple: {
    clientId: 'YOUR_APPLE_CLIENT_ID',
    // ... other config
  },
  facebook: {
    clientId: 'YOUR_FACEBOOK_APP_ID',
    // ... other config
  },
};
```

#### Redirect URI
Configure in `app.json`:
```json
{
  "expo": {
    "scheme": "newsgenie"
  }
}
```

### Development vs Production

#### Development Mode (Current)
- Uses `oauthService.mockAuthenticate()` for testing
- No real OAuth credentials required
- Simulates successful authentication

#### Production Mode
Replace in `IntroScreen.tsx`:
```typescript
// Development
const result = await oauthService.mockAuthenticate(provider);

// Production
const result = await oauthService.authenticate(provider);
```

### Consent Banner

After first successful sign-in, the ConsentBanner component displays:
- Non-blocking notification
- "We use preferences & usage to personalize your feed. Manage in Settings."
- User can accept or dismiss
- Consent state stored in user preferences

### Testing Checklist

- [ ] Particle animations work on both platforms
- [ ] Reduced motion is respected
- [ ] iOS shows Apple Sign In button
- [ ] Android shows Google Sign In button
- [ ] Both show Facebook button
- [ ] Legal links open in browser
- [ ] Mock authentication completes successfully
- [ ] Consent banner appears after sign-in
- [ ] Consent state persists in storage

### Next Steps

1. **LanguageSelect Screen**: Next onboarding screen after authentication
2. **Real OAuth Integration**: Replace mock with actual OAuth flows
3. **Error Handling**: Add user-friendly error messages
4. **Loading States**: Add loading indicators during authentication
5. **Backend Integration**: Connect to real BFF endpoints

### Known Limitations

1. Mock authentication only (no real OAuth)
2. Legal links use placeholder URLs
3. Navigation to next screen commented out
4. No error alerts implemented yet
5. No loading states during authentication

### API Integration

When integrating with backend:

```typescript
POST /auth/oauth/:provider
Body: { token: string }
Response: { user: User, token: string, refreshToken: string }
```

Supported providers: `google`, `apple`, `facebook`

### Accessibility

- VoiceOver/TalkBack support
- Reduced motion detection
- Touch target sizes meet WCAG guidelines
- Color contrast ratios compliant
- Screen reader labels on all interactive elements

### Performance

- Lazy loading of OAuth service
- Animated particles use native driver
- Efficient re-renders with React.memo considerations
- Platform-specific code splitting
