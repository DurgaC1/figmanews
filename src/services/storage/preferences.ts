import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferences } from '../../types/user';
import { STORAGE_KEYS } from '../../utils/constants';

class StorageService {
  // User Preferences
  async getPreferences(): Promise<UserPreferences | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting preferences:', error);
      return null;
    }
  }

  async savePreferences(preferences: UserPreferences): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_PREFERENCES,
        JSON.stringify(preferences)
      );
    } catch (error) {
      console.error('Error saving preferences:', error);
      throw error;
    }
  }

  // Onboarding
  async isOnboardingCompleted(): Promise<boolean> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
      return data === 'true';
    } catch (error) {
      console.error('Error checking onboarding:', error);
      return false;
    }
  }

  async setOnboardingCompleted(completed: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.ONBOARDING_COMPLETED,
        completed ? 'true' : 'false'
      );
    } catch (error) {
      console.error('Error setting onboarding:', error);
      throw error;
    }
  }

  // Auth Token
  async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  async saveAuthToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    } catch (error) {
      console.error('Error saving auth token:', error);
      throw error;
    }
  }

  async clearAuthToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error clearing auth token:', error);
    }
  }

  // Audio Autoplay Preference
  async getAudioAutoplay(): Promise<boolean> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.AUDIO_AUTOPLAY);
      return data === 'true';
    } catch (error) {
      console.error('Error getting audio autoplay:', error);
      return true; // Default to true
    }
  }

  async setAudioAutoplay(enabled: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.AUDIO_AUTOPLAY,
        enabled ? 'true' : 'false'
      );
    } catch (error) {
      console.error('Error setting audio autoplay:', error);
      throw error;
    }
  }

  // Clear all storage
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER_PREFERENCES,
        STORAGE_KEYS.ONBOARDING_COMPLETED,
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.AUDIO_AUTOPLAY,
      ]);
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }
}

export const storageService = new StorageService();
