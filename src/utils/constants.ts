import { Category, Language } from '../types/story';

// API Configuration
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api'
  : 'https://api.newsgenie.com';

export const API_VERSION = 'v1';
export const API_TIMEOUT = 15000; // 15 seconds

// Storage Keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: '@newsgenie:preferences',
  ONBOARDING_COMPLETED: '@newsgenie:onboarding',
  AUTH_TOKEN: '@newsgenie:auth_token',
  USER_DATA: '@newsgenie:user_data',
  CACHED_STORIES: '@newsgenie:cached_stories',
  AUDIO_AUTOPLAY: '@newsgenie:audio_autoplay',
} as const;

// Feed Configuration
export const FEED_CONFIG = {
  ITEMS_PER_PAGE: 10,
  PREFETCH_NEXT_CARDS: 3,
  MAX_CACHED_STORIES: 50,
  BACKGROUND_REFRESH_INTERVAL: 30 * 60 * 1000, // 30 minutes
} as const;

// Categories
export const CATEGORIES: { id: Category; label: string; emoji: string }[] = [
  { id: 'politics', label: 'Politics', emoji: '🏛️' },
  { id: 'business', label: 'Business', emoji: '💼' },
  { id: 'technology', label: 'Technology', emoji: '💻' },
  { id: 'sports', label: 'Sports', emoji: '⚽' },
  { id: 'entertainment', label: 'Entertainment', emoji: '🎬' },
  { id: 'science', label: 'Science', emoji: '🔬' },
  { id: 'health', label: 'Health', emoji: '🏥' },
  { id: 'world', label: 'World', emoji: '🌍' },
];

// Languages
export const LANGUAGES: { id: Language; label: string; nativeLabel: string }[] = [
  { id: 'en', label: 'English', nativeLabel: 'English' },
  { id: 'hi', label: 'Hindi', nativeLabel: 'हिंदी' },
  { id: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
  { id: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
  { id: 'bn', label: 'Bengali', nativeLabel: 'বাংলা' },
  { id: 'mr', label: 'Marathi', nativeLabel: 'मराठी' },
  { id: 'gu', label: 'Gujarati', nativeLabel: 'ગુજરાતી' },
  { id: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ' },
  { id: 'ml', label: 'Malayalam', nativeLabel: 'മലയാളം' },
  { id: 'pa', label: 'Punjabi', nativeLabel: 'ਪੰਜਾਬੀ' },
];

// Audio Configuration
export const AUDIO_CONFIG = {
  AUTOPLAY_DELAY: 500, // ms
  FADE_DURATION: 200, // ms
  MAX_CONCURRENT_DOWNLOADS: 3,
} as const;

// Analytics Events
export const ANALYTICS_EVENTS = {
  STORY_VIEWED: 'story_viewed',
  STORY_SWIPED: 'story_swiped',
  AUDIO_PLAYED: 'audio_played',
  STORY_SHARED: 'story_shared',
  STORY_BOOKMARKED: 'story_bookmarked',
  CATEGORY_SELECTED: 'category_selected',
  LANGUAGE_CHANGED: 'language_changed',
  VIEW_MODE_CHANGED: 'view_mode_changed',
} as const;

// Colors (for NativeWind)
export const COLORS = {
  primary: '#6366F1',
  primaryDark: '#4F46E5',
  background: '#FFFFFF',
  backgroundDark: '#0F172A',
  text: '#1E293B',
  textDark: '#F1F5F9',
  gray: '#64748B',
  border: '#E2E8F0',
} as const;
