import { Category, Language } from './story';

export interface User {
  id: string;
  email?: string;
  name?: string;
  avatar?: string;
  createdAt: string;
}

export interface CategoryWeight {
  category: Category;
  weight: number; // 0-5 scale
  normalized?: number; // 0-1 normalized score
  interaction?: 'more' | 'less' | 'view_only' | 'skipped';
}

export interface UserPreferences {
  languages: Language[];
  categories: Category[];
  categoryWeights?: CategoryWeight[];
  viewType: 'tiktok' | 'newspaper';
  audioAutoplay: boolean;
  notificationsEnabled: boolean;
  theme: 'light' | 'dark' | 'auto';
  textSize: 'small' | 'medium' | 'large';
  consentPersonalization?: boolean;
  preferencesFinalized?: boolean;
}

export interface OnboardingState {
  completed: boolean;
  status: 'not_started' | 'in_progress' | 'skipped' | 'preferences_completed' | 'completed';
  currentStep: number;
  currentCardIndex?: number; // For S1-S5 story cards
  selectedLanguages: Language[];
  selectedCategories: Category[];
  categoryWeights: CategoryWeight[];
  selectedViewType: 'tiktok' | 'newspaper';
  notificationsPermission: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token?: string;
  authProvider?: 'apple' | 'google' | 'facebook' | 'email';
}
