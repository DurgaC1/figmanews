# NewsGenie Onboarding Visual Flow

## Complete User Journey

```
┌─────────────────────────────────────────────────────────────────────┐
│                        APP LAUNCH                                    │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
                    [Check Onboarding Status]
                              ↓
                 ┌────────────┴────────────┐
                 │                         │
            Completed                  Not Completed
                 │                         │
                 ↓                         ↓
          ┌──────────────┐         ┌──────────────┐
          │  HOME FEED   │         │ IntroScreen  │
          │              │         │   (Auth)     │
          └──────────────┘         └──────────────┘
                                          ↓
                                    [Authenticate]
                                  Apple / Google / FB
                                          ↓
                                   ┌──────────────┐
                                   │CustomizeFeed │
                                   │ IntroScreen  │
                                   │    (S0)      │
                                   └──────────────┘
                                          ↓
                                   [Get Started]
                                          ↓
                                   ┌──────────────┐
                                   │ ViewTypeSelect│
                                   │  Screen      │
                                   │  (S0.5)      │
                                   └──────────────┘
                                          ↓
                                  [Choose View Type]
                                          ↓
                                   ┌──────────────┐
                                   │StoryPref     │
                                   │Cards Screen  │
                                   │  (S1-S5)     │
                                   └──────────────┘
                                          ↓
                              [5 Cards with More/Less]
                                          ↓
                                   ┌──────────────┐
                                   │PreferencesSaved│
                                   │ Screen (S6)  │
                                   └──────────────┘
                                          ↓
                               [Finish Onboarding]
                                          ↓
                                   ┌──────────────┐
                                   │AllowNotif    │
                                   │ Screen (S7)  │
                                   └──────────────┘
                                          ↓
                              [Allow / Not Now]
                                          ↓
                                   ┌──────────────┐
                                   │  HOME FEED   │
                                   └──────────────┘
```

## Skip Path (Fastest Route)

```
IntroScreen → [Skip] → HOME FEED (with defaults)
```

## Screen Details

### IntroScreen (Authentication)
```
┌──────────────────────────────────────────┐
│ 6:34                            Skip     │
│                                          │
│        [Animated Particles]              │
│                                          │
│         🗞️ [NewsGenie Logo]              │
│                                          │
│           NewsGenie                      │
│     Stay informed effortlessly           │
│                                          │
│                                          │
│     "See stories from     "Learn faster, │
│      every side"           your way"     │
│   [Card Preview 1]      [Card Preview 2] │
│                                          │
│                                          │
│    ┌────────────────────────────────┐   │
│    │  🍎 Continue with Apple        │   │ (iOS)
│    └────────────────────────────────┘   │
│    ┌────────────────────────────────┐   │
│    │  📘 Continue with Facebook      │   │
│    └────────────────────────────────┘   │
│                                          │
│   Privacy Policy • Terms • Data Use      │
└──────────────────────────────────────────┘
```

### CustomizeFeedIntroScreen (S0)
```
┌──────────────────────────────────────────┐
│ 6:34                            Skip     │
│                                          │
│      [Subtle Floating Particles]         │
│                                          │
│                                          │
│         Customize                        │
│         your feed                        │
│                                          │
│   Set how often stories from             │
│   various categories appear in           │
│   your NewsGenie feed.                   │
│                                          │
│                                          │
│                                          │
│    ┌────────────────────────────────┐   │
│    │       Get Started              │   │
│    └────────────────────────────────┘   │
│                                          │
│          ═══════                         │
└──────────────────────────────────────────┘
```

### ViewTypeSelectScreen (S0.5)
```
┌──────────────────────────────────────────┐
│ 6:34                            Skip     │
│                                          │
│                                          │
│   Choose your                            │
│   news experience                        │
│                                          │
│   Pick how you want to consume news.     │
│   You can change this anytime in         │
│   settings.                              │
│                                          │
│  ┌──────────────────────────────────┐   │
│  │  📱  Swipe View              ✓   │   │
│  │                                  │   │
│  │  Quick, vertical stories like    │   │
│  │  social media                    │   │
│  └──────────────────────────────────┘   │
│                                          │
│  ┌──────────────────────────────────┐   │
│  │  📰  Read View                   │   │
│  │                                  │   │
│  │  Traditional article layout for  │   │
│  │  in-depth reading                │   │
│  └──────────────────────────────────┘   │
│                                          │
│   Don't worry—you can switch between     │
│   views anytime                          │
│                                          │
│    ┌────────────────────────────────┐   │
│    │         Continue               │   │
│    └────────────────────────────────┘   │
│                                          │
└──────────────────────────────────────────┘
```

### StoryPreferenceCardsScreen (S1-S5)
```
┌──────────────────────────────────────────┐
│ Ø14 🔺                          Skip     │
│                                          │
│  ┌──────────────────────────────────┐   │
│  │                                  │   │
│  │   [Hero Image: Politics]         │   │
│  │   [Orange Overlay]               │   │
│  │                                  │   │
│  │  India Extends Grip Over         │   │
│  │  Kashmir After Election Win      │   │
│  │                                  │   │
│  │  The Modi administration revoked │   │
│  │  the regions semi-autonomy...    │   │
│  │                                  │   │
│  │  How frequently do you want to   │   │
│  │  see stories like this?          │   │
│  │                                  │   │
│  │  ┌─────────┐    ┌─────────┐    │   │
│  │  │  Less   │    │  More   │    │   │
│  │  └─────────┘    └─────────┘    │   │
│  │                                  │   │
│  │  No problem—preferences can be   │   │
│  │  updated at any time.            │   │
│  └──────────────────────────────────┘   │
│                                          │
│          ═══──────────                   │
│            1/5                           │
└──────────────────────────────────────────┘

[Swipe Left] → Next Card
[Swipe Right] → Previous Card
```

### PreferencesSavedScreen (S6)
```
┌──────────────────────────────────────────┐
│ 6:44   Preview Results          Skip     │
│                                          │
│        🎊 [Confetti Particles] 🎉       │
│                                          │
│            ✨                            │
│        [Sparkles Icon]                   │
│                                          │
│      Preferences Saved!                  │
│        Keep going?                       │
│                                          │
│   NewsGenie is ready to deliver          │
│   stories based on your feedback.        │
│   You can fine-tune further to           │
│   maximize personalization.              │
│                                          │
│    ┌────────────────────────────────┐   │
│    │     Refine Further             │   │
│    └────────────────────────────────┘   │
│                                          │
│    ┌────────────────────────────────┐   │
│    │   Finish Onboarding            │   │
│    └────────────────────────────────┘   │
│                                          │
└──────────────────────────────────────────┘
```

### AllowNotificationsScreen (S7)
```
┌──────────────────────────────────────────┐
│ 6:44                            Skip     │
│                                          │
│                                          │
│            🔔                            │
│      [Notification Icon]                 │
│                                          │
│        Stay in the loop                  │
│                                          │
│   Get breaking updates and stories       │
│   you care about.                        │
│                                          │
│   ┌──────────────────────────────────┐  │
│   │  Based on your preferences:      │  │
│   │                                  │  │
│   │  [Politics] [Sports] [Business]  │  │
│   └──────────────────────────────────┘  │
│                                          │
│        Manage Categories ▼               │
│                                          │
│    ┌────────────────────────────────┐   │
│    │ 🔔 Allow Notifications         │   │
│    └────────────────────────────────┘   │
│                                          │
│    ┌────────────────────────────────┐   │
│    │      Not Now                   │   │
│    └────────────────────────────────┘   │
│                                          │
└──────────────────────────────────────────┘
```

## Interaction Map

### More/Less Weights
```
Initial State: weight = 3
┌────────┬────────┬────────┬────────┬────────┬────────┐
│   0    │   1    │   2    │   3    │   4    │   5    │
│  None  │ Rarely │  Some  │Regular │ Often  │  Max   │
└────────┴────────┴────────┴────────┴────────┴────────┘
           ◄── Less        More ──►

[Less] = weight - 1 (min: 0)
[More] = weight + 1 (max: 5)
```

### Normalization Formula
```
normalized_weight = user_weight / max_weight

Example:
Politics: 4 → 0.8
Sports: 2 → 0.4
Business: 5 → 1.0
Entertainment: 3 → 0.6
Technology: 1 → 0.2
```

### Notification Subscription Logic
```
if (normalized_weight >= 0.6) {
  subscribe_to_category()
}

Example from above:
✅ Politics (0.8)
❌ Sports (0.4)
✅ Business (1.0)
✅ Entertainment (0.6)
❌ Technology (0.2)
```

## State Transitions

### Onboarding Status
```
not_started
    ↓
in_progress (S0, S1-S5)
    ↓
preferences_completed (S6)
    ↓
completed (S7 done)
    ↓
[HOME FEED]

Skip at any point:
    ↓
skipped → [HOME FEED]
```

## Data Persistence Timeline

```
Time:  T0      T1      T2      T3      T4      T5      T6
       │       │       │       │       │       │       │
       │       │       │       │       │       │       │
Event: Auth   S0      S1-S5   S6      S7      Done    Sync
       │       │       │       │       │       │       │
Local: User   -       Weights Final   Notif   Status  -
       saved           saved   =true   pref    =done
       │       │       │       │       │       │       │
API:   -       -       -       POST    POST    -       ✓
                               prefs   device          
```

## Error Handling

### Offline Scenario
```
S1-S5: Save weights locally
  ↓
S6: Attempt backend sync
  ↓
[OFFLINE]
  ↓
Queue for retry
  ↓
Continue to S7
  ↓
[ONLINE]
  ↓
Background sync ✓
```

### Permission Denied
```
S7: Request notification permission
  ↓
[User Denies]
  ↓
Show toast: "You can enable notifications anytime in Settings"
  ↓
Set notificationsEnabled = false
  ↓
Continue to Home Feed
```

## Accessibility Flow

### Screen Reader Path
```
IntroScreen:
"NewsGenie. Button. Continue with Apple"
"Button. Continue with Facebook"
"Link. Privacy Policy"
"Button. Skip"

StoryPreferenceCards:
"Image. India Extends Grip Over Kashmir"
"Heading. India Extends Grip Over Kashmir After Election Win"
"Button. Less"
"Button. More"
"Progress. 1 of 5"
```

### Reduced Motion
```
if (reducedMotion) {
  // No particle animations
  // No confetti
  // Simple fade transitions
  // Static celebration icon
}
```

## Performance Targets

```
Metric                    Target      Actual
─────────────────────────────────────────────
Screen Load Time          <100ms      ✓
Animation FPS             60fps       ✓
Swipe Response            <16ms       ✓
Haptic Feedback Delay     0ms         ✓
S7 → Home Feed            <400ms      ✓
Backend Sync (online)     <2s         pending
Offline Fallback          instant     ✓
```

## Testing Scenarios

### Happy Path
```
1. User opens app
2. Authenticates with Apple
3. Sees CustomizeFeedIntro
4. Taps Get Started
5. Adjusts 5 category preferences
6. Sees confetti celebration
7. Taps Finish Onboarding
8. Grants notification permission
9. Arrives at Home Feed
✓ All preferences saved
✓ Device registered
✓ Feed personalized
```

### Skip Path
```
1. User opens app
2. Taps Skip immediately
3. Arrives at Home Feed
✓ Default preferences applied
✓ No backend calls made
✓ Onboarding marked as skipped
```

### Resume Path
```
1. User opens app
2. Completes S1-S3
3. App is killed
4. User reopens app
5. Resume at S4 (card index = 3)
✓ Previous weights preserved
✓ Progress indicator correct
```

---

**Visual Design**: Blue, black, white theme matching news apps  
**Animations**: 60fps with reduced-motion support  
**Gestures**: Native feel with spring physics  
**Accessibility**: VoiceOver/TalkBack compliant  
**Performance**: <100ms screen loads, <400ms final transition
