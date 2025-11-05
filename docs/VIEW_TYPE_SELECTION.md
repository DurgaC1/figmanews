# ViewTypeSelectScreen - Implementation Guide

## Overview

The ViewTypeSelectScreen (S0.5) allows users to choose their preferred news consumption format during onboarding. This screen is inserted between the CustomizeFeedIntro (S0) and StoryPreferenceCards (S1-S5).

---

## Screen Details

**File**: `/src/screens/onboarding/ViewTypeSelectScreen.tsx`

**Position in Flow**: 
```
CustomizeFeedIntro (S0) → ViewTypeSelect (S0.5) → StoryPreferenceCards (S1-S5)
```

---

## View Type Options

### 1. Swipe View (TikTok Style)
- **Icon**: 📱 phone-portrait
- **Title**: "Swipe View"
- **Subtitle**: "Quick, vertical stories like social media"
- **Color**: Blue (#3B82F6)
- **Default**: Yes
- **Features**:
  - Vertical scrolling
  - Full-screen story cards
  - Quick consumption
  - Swipe gestures
  - Auto-playing audio (optional)

### 2. Read View (Newspaper Style)
- **Icon**: 📰 newspaper
- **Title**: "Read View"
- **Subtitle**: "Traditional article layout for in-depth reading"
- **Color**: Green (#10B981)
- **Default**: No
- **Features**:
  - Traditional article layout
  - Hero image + headline
  - Full article text
  - Related stories
  - Source citations

---

## UI Components

### Layout Structure
```
┌──────────────────────────────────────────┐
│ Time                            Skip     │  ← Top Bar
│                                          │
│   Choose your                            │  ← Title
│   news experience                        │
│                                          │
│   Pick how you want to consume news.     │  ← Subtitle
│   You can change this anytime.           │
│                                          │
│  ┌──────────────────────────────────┐   │
│  │  📱  Swipe View              ✓   │   │  ← Option Card 1
│  │  Quick, vertical stories...      │   │
│  └──────────────────────────────────┘   │
│                                          │
│  ┌──────────────────────────────────┐   │
│  │  📰  Read View                   │   │  ← Option Card 2
│  │  Traditional article layout...   │   │
│  └──────────────────────────────────┘   │
│                                          │
│   Don't worry—you can switch anytime     │  ← Helper Text
│                                          │
│    ┌────────────────────────────────┐   │
│    │         Continue               │   │  ← CTA Button
│    └────────────────────────────────┘   │
└──────────────────────────────────────────┘
```

### Top Bar
- **Time Display**: Top-left, white, 17pt font
- **Skip Button**: Top-right, white text, tappable
- **Background**: Transparent, over main content
- **Safe Area**: Respects notch/status bar

### Title Section
- **Title**: "Choose your news experience"
  - Font size: 42pt
  - Font weight: 700 (bold)
  - Color: White (#FFFFFF)
  - Line height: 50pt
  - Multi-line support
- **Subtitle**: "Pick how you want to consume news..."
  - Font size: 17pt
  - Color: White with 70% opacity
  - Line height: 24pt

### Option Cards
- **Layout**: Horizontal (icon + content + checkmark)
- **Background**: Dark (#1A1A1A)
- **Border**: 2px, changes based on selection
  - Unselected: White with 10% opacity
  - Selected: Color-coded (blue or green)
- **Padding**: 20px all sides
- **Border Radius**: 16px
- **Gap**: 16px between cards

#### Icon Container
- **Size**: 64x64px
- **Border Radius**: 32px (circular)
- **Background**: Color with 20% opacity
- **Icon Size**: 32pt
- **Icon Color**: 
  - Selected: Full color (blue/green)
  - Unselected: White with 60% opacity

#### Content Area
- **Title**: 20pt, bold, white
- **Subtitle**: 15pt, white with 60% opacity, 20pt line height

#### Checkmark Badge
- **Visibility**: Only when selected
- **Size**: 24x24px
- **Border Radius**: 12px (circular)
- **Background**: Color-coded (blue/green)
- **Icon**: Checkmark, 16pt, white
- **Position**: Top-right of card content

### Helper Text
- **Text**: "Don't worry—you can switch between views anytime"
- **Font size**: 14pt
- **Color**: White with 50% opacity
- **Style**: Italic
- **Alignment**: Center

### Continue Button
- **Background**: White (#FFFFFF)
- **Text**: "Continue"
  - Font size: 18pt
  - Font weight: 600
  - Color: Black (#000000)
- **Padding**: 18px vertical
- **Border Radius**: 12px
- **Full width**: Minus 20px horizontal padding
- **Bottom spacing**: Safe area + 20px

---

## Interactions

### Card Selection
```typescript
handleSelectType(type: 'tiktok' | 'newspaper', index: number) {
  1. Update selectedType state
  2. Trigger haptic feedback (Medium impact)
  3. Animate card scale (0.95 → 1.0)
  4. Update checkmark visibility
  5. Update border color
}
```

**Animation Sequence**:
1. Scale down to 0.95 (100ms)
2. Scale back to 1.0 (100ms)
3. Total duration: 200ms
4. Uses native driver for performance

**Haptic Feedback**:
- Type: `ImpactFeedbackStyle.Medium`
- Timing: On tap start
- Platform: iOS and Android

### Continue Button
```typescript
handleContinue() {
  1. Save viewType to preferences
  2. Trigger light haptic feedback
  3. Navigate to StoryPreferenceCards
}
```

**State Save**:
```typescript
await updatePreferences({ viewType: selectedType });
```

### Skip Button
```typescript
handleSkip() {
  1. Save default viewType ('tiktok')
  2. Navigate to StoryPreferenceCards
}
```

---

## State Management

### Local State
```typescript
const [selectedType, setSelectedType] = useState<ViewType>('tiktok');
```

### Global State (Zustand)
```typescript
// Saved to useUserStore
preferences: {
  viewType: 'tiktok' | 'newspaper',
  // ... other preferences
}
```

### Persistence
- **Storage**: AsyncStorage (via useUserStore)
- **Key**: `@newsgenie:preferences`
- **Sync**: Immediate local save
- **Backend**: Synced with other preferences on finalization

---

## Styling Details

### Colors
```typescript
const COLORS = {
  background: '#000000',      // Screen background
  cardBg: '#1A1A1A',          // Card background
  textPrimary: '#FFFFFF',     // Title text
  textSecondary: 'rgba(255, 255, 255, 0.7)', // Subtitle
  textHelper: 'rgba(255, 255, 255, 0.5)',    // Helper text
  borderUnselected: 'rgba(255, 255, 255, 0.1)',
  
  // Option specific
  tiktokColor: '#3B82F6',     // Swipe View
  newspaperColor: '#10B981',  // Read View
};
```

### Typography
```typescript
const TYPOGRAPHY = {
  title: {
    fontSize: 42,
    fontWeight: '700',
    lineHeight: 50,
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 24,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  optionSubtitle: {
    fontSize: 15,
    lineHeight: 20,
  },
  helper: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  button: {
    fontSize: 18,
    fontWeight: '600',
  },
};
```

---

## Navigation Flow

### Entry Points
1. **From CustomizeFeedIntro**: User taps "Get Started"
2. **Direct (development)**: For testing purposes

### Exit Points
1. **Continue**: Navigates to `StoryPreferenceCards` with saved viewType
2. **Skip**: Navigates to `StoryPreferenceCards` with default viewType (tiktok)

### Navigation Props
```typescript
type ViewTypeSelectScreenProps = {
  navigation: StackNavigationProp<OnboardingStackParamList, 'ViewTypeSelect'>;
};
```

---

## Accessibility

### Screen Reader Support
- All touchable elements have accessible labels
- Option cards announce: "[Type] View. [Subtitle]. Button. [Selected state]"
- Continue button announces: "Continue. Button"
- Skip button announces: "Skip. Button"

### Keyboard Navigation (Future)
- Tab order: Skip → Option 1 → Option 2 → Continue
- Enter/Space: Select/activate
- Arrow keys: Move between options

### Reduced Motion
- If user has reduced motion enabled:
  - Scale animations are disabled
  - Instant state changes
  - Haptics remain (different sense)

---

## Analytics Tracking

### Events to Track
```typescript
// When screen loads
analytics.track('view_type_screen_viewed');

// When user selects an option
analytics.track('view_type_selected', {
  type: 'tiktok' | 'newspaper',
  timestamp: Date.now(),
});

// When user continues
analytics.track('view_type_confirmed', {
  type: selectedType,
  timeSpent: Date.now() - screenLoadTime,
});

// When user skips
analytics.track('view_type_skipped', {
  defaultSet: 'tiktok',
});
```

---

## Testing Checklist

### Visual Tests
- [ ] Title and subtitle render correctly
- [ ] Both option cards display with proper icons
- [ ] Selected card shows colored border
- [ ] Checkmark appears on selected card
- [ ] Helper text is visible and italic
- [ ] Continue button is white with black text
- [ ] Time displays in top-left
- [ ] Skip button is in top-right

### Interaction Tests
- [ ] Tapping option card selects it
- [ ] Only one option can be selected at a time
- [ ] Scale animation plays on selection
- [ ] Haptic feedback triggers on tap
- [ ] Continue button saves preference
- [ ] Continue navigates to next screen
- [ ] Skip button uses default preference
- [ ] Skip button navigates to next screen

### State Tests
- [ ] Default selection is "Swipe View"
- [ ] Selection persists during screen lifetime
- [ ] Preference saves to useUserStore
- [ ] Preference persists in AsyncStorage
- [ ] Can retrieve saved preference later

### Edge Cases
- [ ] Rapid tapping doesn't break selection
- [ ] Double-tap Continue doesn't duplicate navigation
- [ ] Works on small screens (iPhone SE)
- [ ] Works on large screens (iPad)
- [ ] Works on notched devices
- [ ] Safe area insets respected

---

## Implementation Notes

### Performance
- Uses `useNativeDriver: true` for animations
- Animated.Value refs prevent re-renders
- Memoized animation sequences
- No heavy computations in render

### Code Quality
- Full TypeScript typing
- Proper error handling
- Clean component structure
- Reusable styles
- Well-documented functions

### Future Enhancements
1. **Preview Mode**: Show short demo of each view type
2. **Comparison**: Side-by-side comparison view
3. **Recommendation**: Smart default based on user behavior
4. **A/B Testing**: Test different copy/layouts
5. **Localization**: Multi-language support

---

## Related Files

### Updated Files
- `/src/navigation/OnboardingNavigator.tsx` - Added ViewTypeSelect screen
- `/src/screens/onboarding/CustomizeFeedIntroScreen.tsx` - Updated navigation
- `/docs/ONBOARDING_FLOW.md` - Updated flow documentation
- `/docs/ONBOARDING_VISUAL_FLOW.md` - Added visual diagram
- `/docs/IMPLEMENTATION_SUMMARY.md` - Updated summary

### Dependencies
- `react-native-reanimated` - For scale animations
- `expo-haptics` - For haptic feedback
- `@react-navigation/stack` - For navigation
- `zustand` - For state management

---

## Design Rationale

### Why Two Options?
- Accommodates different user preferences
- TikTok-style appeals to younger, mobile-first users
- Newspaper-style appeals to traditional news consumers
- Flexibility increases user satisfaction

### Why Show This Early?
- Sets expectations for the app experience
- Reduces cognitive load later
- Allows customization before content preferences
- Quick decision (2 options only)

### Why Allow Changes Later?
- Reduces pressure to make "perfect" choice
- Users can experiment with both modes
- Settings provide escape hatch
- Increases feature discovery

---

**Created**: November 1, 2025  
**Version**: 1.0.0  
**Status**: ✅ Implemented and Documented
