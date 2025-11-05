# NewsGenie Architecture Overview

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Onboarding  │  │  Feed Screen │  │ Detail View  │         │
│  │   Screens    │  │ (TikTok-UX)  │  │ (Newspaper)  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                      NAVIGATION LAYER                           │
│         React Navigation (Stack + Bottom Tabs)                  │
│  ┌────────────────────┐         ┌────────────────────┐         │
│  │ OnboardingNavigator│         │   MainNavigator    │         │
│  │    (Stack Nav)     │    →    │  (Bottom Tabs)     │         │
│  └────────────────────┘         └────────────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                        STATE LAYER                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ TanStack     │  │   Zustand    │  │   React      │         │
│  │   Query      │  │    Stores    │  │   Context    │         │
│  │ (Server)     │  │  (Client)    │  │  (UI State)  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                       SERVICE LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   API        │  │    Audio     │  │    Auth      │         │
│  │  Client      │  │   Manager    │  │   Service    │         │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤         │
│  │   Storage    │  │  Analytics   │  │ Notifications│         │
│  │  Service     │  │   Service    │  │   Service    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                      PERSISTENCE LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   SQLite     │  │ AsyncStorage │  │ File System  │         │
│  │  (Stories,   │  │   (Prefs,    │  │   (Audio,    │         │
│  │  Bookmarks)  │  │   Tokens)    │  │   Images)    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND (BFF)                            │
│                     /v1/mobile/feed                             │
│                    /v1/mobile/events                            │
└─────────────────────────────────────────────────────────────────┘
```

## 📁 Folder Structure

```
src/
├── components/               # Reusable UI components
│   ├── ConsentBanner.tsx
│   └── [other shared components]
│
├── screens/                  # Screen components
│   ├── onboarding/
│   │   ├── IntroScreen.tsx
│   │   ├── WelcomeScreen.tsx
│   │   └── [other onboarding screens]
│   ├── feed/
│   │   ├── TikTokFeedScreen.tsx
│   │   └── NewspaperDetailScreen.tsx
│   └── [other screens]
│
├── navigation/               # Navigation configuration
│   ├── RootNavigator.tsx
│   ├── OnboardingNavigator.tsx
│   └── MainNavigator.tsx
│
├── stores/                   # Zustand state stores
│   ├── useUserStore.ts       # User data & preferences
│   ├── useFeedStore.ts       # Feed state
│   └── useAudioStore.ts      # Audio playback state
│
├── hooks/                    # Custom React hooks
│   ├── useStories.ts         # TanStack Query hooks
│   ├── usePrefetch.ts        # Prefetch next cards
│   └── useAudioPlayer.ts     # Audio playback
│
├── services/                 # Business logic services
│   ├── api/
│   │   ├── client.ts         # Axios instance
│   │   ├── feed.ts           # Feed endpoints
│   │   ├── events.ts         # Analytics endpoints
│   │   └── auth.ts           # Auth endpoints
│   ├── audio/
│   │   └── audioManager.ts   # Audio service (expo-av)
│   ├── auth/
│   │   └── oauthService.ts   # OAuth flows
│   └── storage/
│       ├── database.ts       # SQLite service
│       └── preferences.ts    # AsyncStorage wrapper
│
├── types/                    # TypeScript definitions
│   ├── story.ts              # Story & StoryCard types
│   ├── user.ts               # User & Auth types
│   └── api.ts                # API response types
│
├── utils/                    # Utility functions
│   ├── constants.ts          # App constants
│   └── helpers.ts            # Helper functions
│
└── config/                   # App configuration
    └── queryClient.ts        # TanStack Query config
```

## 🔄 Data Flow

### 1. Story Feed Flow

```
User Opens App
     ↓
[Check onboarding status in AsyncStorage]
     ↓
┌─────────────────────────────────────┐
│ If not completed → OnboardingNavigator│
│ If completed → MainNavigator         │
└─────────────────────────────────────┘
     ↓
[FeedScreen Mounted]
     ↓
useStories() hook
     ↓
TanStack Query (check cache)
     ↓
┌─────────────────────────────────────┐
│ Cache Hit → Return cached data      │
│ Cache Miss → Fetch from API         │
└─────────────────────────────────────┘
     ↓
API Client (Axios)
     ↓
GET /v1/mobile/feed
     ↓
Receive StoryCards
     ↓
┌─────────────────────────────────────┐
│ 1. Update React Query cache         │
│ 2. Save to SQLite (databaseService) │
│ 3. Prefetch next 3 cards            │
└─────────────────────────────────────┘
     ↓
Render Feed
```

### 2. Audio Autoplay Flow

```
User Swipes to Story
     ↓
[Check audioAutoplay preference]
     ↓
preferences.audioAutoplay === true?
     ↓
┌─────────────────────────────────────┐
│ YES → Continue                      │
│ NO → Exit (manual play only)       │
└─────────────────────────────────────┘
     ↓
useAudioPlayer(storyId, audioUrl)
     ↓
audioManager.loadAudio()
     ↓
Delay 500ms (AUDIO_CONFIG.AUTOPLAY_DELAY)
     ↓
audioManager.play()
     ↓
[Story is now active card]
     ↓
User Swipes Away
     ↓
audioManager.pause()
     ↓
Cleanup when unmounted
```

### 3. Prefetch Flow

```
Current Card Index: N
     ↓
usePrefetch(stories, currentIndex)
     ↓
Calculate next cards: [N+1, N+2, N+3]
     ↓
┌─────────────────────────────────────┐
│ 1. Prefetch Images                  │
│    FastImage.preload()              │
│                                     │
│ 2. Cache Stories                    │
│    databaseService.cacheStories()   │
│                                     │
│ 3. Prefetch in React Query          │
│    queryClient.prefetchQuery()      │
└─────────────────────────────────────┘
     ↓
Ready for smooth scrolling
```

### 4. OAuth Flow

```
User Taps "Continue with [Provider]"
     ↓
oauthService.authenticate(provider)
     ↓
Expo AuthSession
     ↓
Open OAuth Provider (Apple/Google/Facebook)
     ↓
User Authenticates
     ↓
Receive Token (id_token or access_token)
     ↓
Send to Backend
POST /v1/auth/oauth/:provider
     ↓
Backend Validates Token
     ↓
Return { user, token, refreshToken }
     ↓
┌─────────────────────────────────────┐
│ 1. Save token to AsyncStorage       │
│ 2. Update useUserStore              │
│ 3. Show ConsentBanner (first time)  │
│ 4. Navigate to next screen          │
└─────────────────────────────────────┘
```

### 5. Offline Mode Flow

```
Device Goes Offline
     ↓
API Request Fails
     ↓
Axios Interceptor Catches Error
     ↓
Check SQLite for Cached Stories
     ↓
databaseService.getCachedStories(50)
     ↓
┌─────────────────────────────────────┐
│ Cache Available → Display cached    │
│ No Cache → Show offline message     │
└─────────────────────────────────────┘
     ↓
Device Back Online
     ↓
Network Change Listener (TODO)
     ↓
Background Refresh (Wi-Fi only)
     ↓
Fetch new stories
     ↓
Update cache
```

## 🧩 Component Hierarchy

### Feed Screen (TikTok View)

```
FeedScreen
├── FlashList (or FlatList)
│   └── StoryCard (vertical swipe)
│       ├── StoryImage
│       ├── StoryContent
│       │   ├── Title
│       │   ├── Summary
│       │   ├── Source Badge
│       │   └── ReadTime
│       ├── AudioPlayer
│       │   ├── PlayButton
│       │   ├── ProgressBar
│       │   └── VolumeControl
│       └── ActionButtons
│           ├── BookmarkButton
│           ├── ShareButton
│           └── ReadMoreButton
└── CategoryFilter (floating)
```

### Newspaper Detail View

```
DetailScreen
├── ScrollView
│   ├── HeroImage
│   ├── Breadcrumb (Source, Date)
│   ├── Headline
│   ├── Summary
│   ├── AudioPlayer (inline)
│   ├── ArticleBody
│   │   ├── Paragraph
│   │   ├── Quote
│   │   ├── Image
│   │   └── RelatedLink
│   ├── Tags
│   ├── SourcesSection
│   │   └── SourceCard (multiple)
│   └── RelatedStories
│       └── StoryCard (horizontal)
└── BottomBar
    ├── BookmarkButton
    └── ShareButton
```

## 🔐 Security & Privacy

### Token Management

```
Login/OAuth
     ↓
Receive JWT Token
     ↓
Save to AsyncStorage (encrypted)
storageService.saveAuthToken()
     ↓
Axios Interceptor
     ↓
Add to every request
Authorization: Bearer <token>
     ↓
401 Response?
     ↓
Clear token
Navigate to Login
```

### Data Privacy

- ✅ No PII stored in SQLite (only story IDs)
- ✅ User preferences stored locally
- ✅ Analytics events anonymized
- ✅ Consent tracking (consentPersonalization flag)
- ✅ GDPR-compliant data deletion

## 📊 Performance Optimizations

### 1. Image Optimization
- FastImage with priority preloading
- Lazy loading with IntersectionObserver concept
- Image caching at OS level

### 2. List Performance
- FlashList for recycling views
- Key extraction for stable IDs
- windowSize optimization

### 3. Memory Management
- Unload audio when not in use
- Clear expired SQLite cache
- Limit cached stories to 50

### 4. Network Optimization
- Request deduplication (TanStack Query)
- Retry with exponential backoff
- Prefetch next 3 cards only
- Wi-Fi-only background refresh

### 5. Bundle Optimization
- Code splitting per screen
- Lazy loading heavy dependencies
- Hermes engine enabled

## 🎯 Next Steps

1. **Implement Feed Screens**
   - TikTok-style vertical swipe
   - Newspaper-style detail view
   - Audio autoplay integration

2. **Background Services**
   - Wi-Fi-only refresh
   - Push notification handler
   - Background audio controls

3. **Testing**
   - E2E tests with Detox
   - Unit tests for services
   - Integration tests for hooks

4. **Monitoring**
   - Sentry error tracking
   - Analytics implementation
   - Performance monitoring

5. **CI/CD**
   - EAS Build configuration
   - GitHub Actions workflow
   - Auto versioning

---

**Last Updated**: 2025-11-01
**Version**: 1.0.0
**Status**: Foundation Complete, Ready for Feature Development
