import { create } from 'zustand';
import { User, UserPreferences } from '../types/user';
import { storageService } from '../services/storage/preferences';

interface UserStore {
  user: User | null;
  preferences: UserPreferences;
  isOnboardingCompleted: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  setOnboardingCompleted: (completed: boolean) => Promise<void>;
  loadUserData: () => Promise<void>;
  clearUserData: () => Promise<void>;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  languages: ['en'],
  categories: ['politics', 'technology', 'business'],
  categoryWeights: [],
  viewType: 'tiktok',
  audioAutoplay: true,
  notificationsEnabled: false,
  theme: 'auto',
  textSize: 'medium',
  consentPersonalization: undefined,
  preferencesFinalized: false,
};

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  preferences: DEFAULT_PREFERENCES,
  isOnboardingCompleted: false,

  setUser: (user) => {
    set({ user });
  },

  updatePreferences: async (newPreferences) => {
    const updatedPreferences = {
      ...get().preferences,
      ...newPreferences,
    };
    
    // Save locally first
    await storageService.savePreferences(updatedPreferences);
    set({ preferences: updatedPreferences });

    // Sync to backend if online and preferences are finalized
    if (updatedPreferences.preferencesFinalized && get().user) {
      try {
        const { preferencesApi } = await import('../services/api/preferences');
        await preferencesApi.updatePreferences(get().user!.id, updatedPreferences);
      } catch (error) {
        console.error('Failed to sync preferences, will retry:', error);
        // Queue for background retry
        const { preferencesApi } = await import('../services/api/preferences');
        await preferencesApi.queuePreferenceSync(get().user!.id, updatedPreferences);
      }
    }
  },

  setOnboardingCompleted: async (completed) => {
    await storageService.setOnboardingCompleted(completed);
    set({ isOnboardingCompleted: completed });
  },

  loadUserData: async () => {
    try {
      const [preferences, onboardingCompleted] = await Promise.all([
        storageService.getPreferences(),
        storageService.isOnboardingCompleted(),
      ]);

      set({
        preferences: preferences || DEFAULT_PREFERENCES,
        isOnboardingCompleted: onboardingCompleted,
      });
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  },

  clearUserData: async () => {
    await storageService.clearAll();
    set({
      user: null,
      preferences: DEFAULT_PREFERENCES,
      isOnboardingCompleted: false,
    });
  },
}));
