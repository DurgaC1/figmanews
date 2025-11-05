# NewsGenie Onboarding & Personalization Flow

## Complete Flow Overview

```
Intro (Auth) → CustomizeFeedIntro (S0) → ViewTypeSelect (S0.5) → StoryPreferenceCards (S1-S5) → PreferencesSaved (S6) → AllowNotifications (S7) → Home Feed
```

## Screen Implementations

### 1. IntroScreen (Authentication)
**File**: `/src/screens/onboarding/IntroScreen.tsx`

**Purpose**: OAuth authentication with platform-specific providers

**Features**:
- ✅ Platform-specific primary CTA (Apple for iOS, Google for Android)
- ✅ Facebook secondary CTA
- ✅ Animated particle background
- ✅ Legal footer links
- ✅ Mock authentication for development

**Navigation**:
- After successful auth → `CustomizeFeedIntro`
- Skip → Home Feed (skips entire onboarding)

---

### 2. CustomizeFeedIntroScreen (S0)
**File**: `/src/screens/onboarding/CustomizeFeedIntroScreen.tsx`

**Purpose**: Introduce feed customization to user

**UI Components**:
- Title: "Customize your feed"
- Subtitle: "Set how often stories from various categories appear in your NewsGenie feed."
- Get Started button (white, bottom)
- Skip button (top-right)
- Time display (top-left)
- Subtle particle animations (respects reduced-motion)

**Interactions**:
- Get Started → `ViewTypeSelect` (S0.5)
- Skip → Home Feed, sets `onboarding_status="skipped"`

**State Management**:
- No state persisted at this screen
- Skip action marks onboarding as completed with default preferences

---

### 2.5. ViewTypeSelectScreen (S0.5)
**File**: `/src/screens/onboarding/ViewTypeSelectScreen.tsx`

**Purpose**: Let user choose their preferred news consumption format

**UI Components**:
- Title: "Choose your news experience"
- Subtitle: "Pick how you want to consume news. You can change this anytime in settings."
- Two view type options:
  - **Swipe View (TikTok)**: Quick, vertical stories like social media
  - **Read View (Newspaper)**: Traditional article layout for in-depth reading
- Each option shows:
  - Icon (phone-portrait or newspaper)
  - Title and subtitle
  - Checkmark when selected
  - Color-coded (blue for TikTok, green for Newspaper)
- Continue button (white, bottom)
- Skip button (top-right)
- Time display (top-left)

**Interactions**:
- Tap option card → Select view type with scale animation + haptic feedback
- Continue → Save preference and navigate to `StoryPreferenceCards` (S1)
- Skip → Save default (TikTok) and navigate to `StoryPreferenceCards`

**State Management**:
- Saves `viewType` ('tiktok' | 'newspaper') to preferences
- Persisted locally to AsyncStorage
- Can be changed later in Settings

**Design**:
- Dark background (#000000)
- Cards with subtle borders, selected card gets colored border
- Icon containers with color-tinted backgrounds
- Smooth scale animations on selection
- Helper text: "Don't worry—you can switch between views anytime"

**Navigation**:
- Continue/Skip → `StoryPreferenceCards` (S1)

---

### 3. StoryPreferenceCardsScreen (S1-S5)
**File**: `/src/screens/onboarding/StoryPreferenceCardsScreen.tsx`

**Purpose**: Collect user preferences through 5 story cards

**Categories Covered**:
1. Politics (orange tint)
2. Sports (green tint)
3. Business (blue tint)
4. Entertainment (pink tint)
5. Technology (purple tint)

**UI Components per Card**:
- Hero image with category-colored overlay
- Headline and subtitle
- Prompt text (changes on first card vs. subsequent)
- Less/More buttons (blue, side-by-side)
- Helper text: "No problem—preferences can be updated at any time."
- Progress indicator (1/5 ... 5/5)
- Skip button (top-right)

**Interactions**:
- **More**: Increments category weight (+1, max 5)
- **Less**: Decrements category weight (-1, min 0)
- **Swipe Left/Right**: Navigate between cards
- **Skip**: Mark card as "skipped" and advance
- **No Interaction**: Marks as "view_only" when advancing

**Weight System**:
```typescript
interface CategoryWeight {
  category: Category;
  weight: number; // 0-5 scale
  normalized?: number; // 0-1 normalized score
  interaction?: 'more' | 'less' | 'view_only' | 'skipped';
}
```

**State Management**:
- Category weights stored in component state during flow
- Normalized on completion (max weight = 1.0)
- Persisted to Zustand store on navigation to S6
- Saved locally to AsyncStorage
- Synced to backend when finalized

**Gesture Support**:
- Uses `react-native-reanimated` for smooth swipe animations
- `PanGestureHandler` for swipe detection
- Threshold: 30% of screen width
- Haptic feedback on button press

**Navigation**:
- After card 5 → `PreferencesSaved` (S6)
- Skip on last card → `PreferencesSaved` (S6)

---

### 4. PreferencesSavedScreen (S6)
**File**: `/src/screens/onboarding/PreferencesSavedScreen.tsx`

**Purpose**: Celebrate completion and offer additional options

**UI Components**:
- Confetti animation (30 particles, auto-plays on mount)
- Celebration icon (sparkles, gold)
- Title: "Preferences Saved! Keep going?"
- Subtitle: Explains personalization is ready
- Refine Further button (dark, secondary)
- Finish Onboarding button (white, primary)
- Preview Results link (top bar, next to time)
- Skip button (top-right)

**Animations**:
- Confetti particles animate outward from center
- Celebration icon scales in with spring animation
- Haptic success feedback on mount

**Interactions**:
- **Refine Further**: Show 2-3 additional category cards (TODO: implement)
- **Preview Results**: Open temporary feed preview modal (TODO: implement)
- **Finish Onboarding**: Save preferences and continue to S7
- **Skip**: Same as Finish Onboarding

**State Management**:
- Sets `preferencesFinalized=true`
- Triggers backend sync: `POST /v1/users/{id}/preferences:finalize`
- Updates onboarding stage: `preferences_completed`
- If offline, queues sync for background retry

**Backend Payload**:
```typescript
{
  categoryWeights: CategoryWeight[],
  notificationsEnabled: boolean,
  preferencesFinalized: true
}
```

**Navigation**:
- Finish/Skip → `AllowNotifications` (S7)

---

### 5. AllowNotificationsScreen (S7)
**File**: `/src/screens/onboarding/AllowNotificationsScreen.tsx`

**Purpose**: Request push notification permission

**UI Components**:
- Large notification icon (blue, centered)
- Title: "Stay in the loop"
- Subtitle: "Get breaking updates and stories you care about."
- Category preview (shows high-priority categories)
- Manage Categories expandable section
- Allow Notifications button (blue gradient, primary)
- Not Now button (outlined, secondary)
- Skip button (top-right)

**Category Subscription Logic**:
- Auto-subscribe to categories with `normalized ≥ 0.6`
- Shows preview of categories user will receive notifications for
- Can expand to see explanation

**Interactions**:
- **Allow Notifications**: 
  - Request system permission (iOS/Android)
  - Get push token (APNs/FCM)
  - Register device: `POST /v1/users/{id}/devices:register`
  - Subscribe to notification topics
  - Set `notificationsEnabled=true`
  - Complete onboarding
- **Not Now/Skip**: 
  - Set `notificationsEnabled=false`
  - Show toast: "You can enable notifications anytime in Settings"
  - Complete onboarding
- **Manage Categories**: Toggle expandable info sheet

**Permission Flow**:
```typescript
// iOS
UNUserNotificationCenter.requestAuthorization()

// Android (13+)
POST_NOTIFICATIONS runtime permission

// Get Token
Notifications.getExpoPushTokenAsync()

// Register
POST /v1/users/{userId}/devices:register
Body: {
  token: string,
  platform: 'ios' | 'android',
  categories: ['politics', 'sports', ...]
}
```

**State Management**:
- Updates `notificationsEnabled` in preferences
- Stores device token (for backend)
- Sets `onboarding_status="completed"`
- If token registration fails, retry queued silently (doesn't block navigation)

**Navigation**:
- After completion → Home Feed (via RootNavigator)
- Target: <400ms load time

---

## State Persistence & Resume

### Local Storage (AsyncStorage)
```typescript
{
  "@newsgenie:preferences": {
    categoryWeights: CategoryWeight[],
    preferencesFinalized: boolean,
    notificationsEnabled: boolean,
    ...
  },
  "@newsgenie:onboarding": {
    completed: boolean,
    status: 'in_progress' | 'preferences_completed' | 'completed',
    currentStep: number,
    currentCardIndex?: number, // For S1-S5
  }
}
```

### Resume Logic
If app is backgrounded/terminated during onboarding:
1. On reopen, check `onboarding.status`
2. If `in_progress`, navigate to last `currentStep`
3. If `preferences_completed`, resume at S7 (AllowNotifications)
4. If `completed`, go to Home Feed

### Backend Sync Strategy
1. **Immediate**: Save locally on every action
2. **Opportunistic**: Sync to backend when online
3. **Queued**: If offline, queue for background retry
4. **Finalized**: Full sync on `preferencesFinalized=true`

---

## Skip Behavior by Screen

| Screen | Skip Action | Result |
|--------|-------------|--------|
| IntroScreen (Auth) | Skip | Go to Home Feed with defaults, `onboarding_status="skipped"` |
| CustomizeFeedIntro (S0) | Skip | Same as Auth skip |
| StoryPreferenceCards (S1-S4) | Skip | Advance to next card, mark current as "skipped" |
| StoryPreferenceCards (S5) | Skip | Go to PreferencesSaved (S6) |
| PreferencesSaved (S6) | Skip | Go to AllowNotifications (S7) |
| AllowNotifications (S7) | Skip | Complete onboarding, go to Home Feed |

---

## Color Scheme

**Primary Colors**:
- Background: `#0A0A1F` (dark blue-black)
- Accent: `#3B82F6` (blue)
- Text: `#FFFFFF` (white)
- Overlay: Category-specific with 40% opacity

**Category Colors**:
- Politics: `rgba(194, 110, 40, 0.4)` (orange)
- Sports: `rgba(76, 175, 80, 0.4)` (green)
- Business: `rgba(33, 150, 243, 0.4)` (blue)
- Entertainment: `rgba(233, 30, 99, 0.4)` (pink)
- Technology: `rgba(103, 58, 183, 0.4)` (purple)

---

## API Endpoints

### Finalize Preferences
```http
POST /v1/users/{userId}/preferences:finalize
Content-Type: application/json

{
  "categoryWeights": [
    {
      "category": "politics",
      "weight": 4,
      "normalized": 0.8,
      "interaction": "more"
    },
    ...
  ],
  "notificationsEnabled": true,
  "preferencesFinalized": true
}

Response: {
  "success": true,
  "message": "Preferences saved successfully"
}
```

### Register Device
```http
POST /v1/users/{userId}/devices:register
Content-Type: application/json

{
  "token": "ExponentPushToken[...]",
  "platform": "ios",
  "categories": ["politics", "sports"]
}

Response: {
  "success": true,
  "deviceId": "device-uuid"
}
```

---

## Testing Checklist

### S0 - CustomizeFeedIntro
- [ ] Particle animations render
- [ ] Reduced motion is respected
- [ ] Get Started navigates to S1
- [ ] Skip completes onboarding
- [ ] Time displays correctly

### S1-S5 - StoryPreferenceCards
- [ ] All 5 cards render with correct data
- [ ] More button increments weight
- [ ] Less button decrements weight
- [ ] Weight doesn't go below 0 or above 5
- [ ] Swipe left advances card
- [ ] Swipe right goes to previous card
- [ ] Skip advances to next card
- [ ] Progress indicator updates
- [ ] Haptic feedback on button press
- [ ] View-only marked when no interaction
- [ ] After card 5, navigates to S6

### S6 - PreferencesSaved
- [ ] Confetti animation plays
- [ ] Haptic success feedback
- [ ] Refine Further button (placeholder)
- [ ] Preview Results button (placeholder)
- [ ] Finish Onboarding navigates to S7
- [ ] Skip navigates to S7
- [ ] Preferences saved to store
- [ ] preferencesFinalized=true

### S7 - AllowNotifications
- [ ] iOS shows system permission prompt
- [ ] Android shows system permission prompt
- [ ] Token obtained successfully
- [ ] High-priority categories displayed
- [ ] Manage Categories expands/collapses
- [ ] Allow Notifications completes onboarding
- [ ] Not Now completes onboarding
- [ ] Toast shown on deny/skip
- [ ] Navigation to Home Feed <400ms

---

## Known Limitations

1. **Refine Further**: Not implemented (placeholder button)
2. **Preview Results**: Not implemented (placeholder button)
3. **Backend Sync**: Mock endpoints (requires real API)
4. **Background Retry**: Queue exists but no worker implemented
5. **Resume**: Partially implemented (needs testing)
6. **Analytics**: Not tracking onboarding events yet

---

## Future Enhancements

1. Add 2-3 more refinement cards (Health, Science, Lifestyle)
2. Implement feed preview modal with real stories
3. Add analytics tracking for each interaction
4. Implement background sync worker
5. Add A/B testing for onboarding variants
6. Localize all text for multi-language support
7. Add skip confirmation dialog
8. Implement progress save to backend
9. Add onboarding completion analytics
10. Create onboarding replay feature (Settings)

---

**Last Updated**: 2025-11-01  
**Version**: 1.0.0  
**Status**: ✅ Complete and Ready for Testing
