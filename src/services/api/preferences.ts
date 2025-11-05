import { apiClient } from './client';
import { UserPreferences, CategoryWeight } from '../../types/user';

interface FinalizePreferencesRequest {
  categoryWeights: CategoryWeight[];
  notificationsEnabled: boolean;
  preferencesFinalized: boolean;
}

interface PreferencesResponse {
  success: boolean;
  message: string;
}

export const preferencesApi = {
  /**
   * Finalize user preferences after onboarding
   * POST /v1/users/{userId}/preferences:finalize
   */
  finalizePreferences: async (userId: string, data: FinalizePreferencesRequest): Promise<PreferencesResponse> => {
    try {
      const response = await apiClient.post<PreferencesResponse>(
        `/users/${userId}/preferences:finalize`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Failed to finalize preferences:', error);
      throw error;
    }
  },

  /**
   * Update user preferences
   * PATCH /v1/users/{userId}/preferences
   */
  updatePreferences: async (userId: string, preferences: Partial<UserPreferences>): Promise<PreferencesResponse> => {
    try {
      const response = await apiClient.patch<PreferencesResponse>(
        `/users/${userId}/preferences`,
        preferences
      );
      return response.data;
    } catch (error) {
      console.error('Failed to update preferences:', error);
      throw error;
    }
  },

  /**
   * Get user preferences
   * GET /v1/users/{userId}/preferences
   */
  getPreferences: async (userId: string): Promise<UserPreferences> => {
    try {
      const response = await apiClient.get<UserPreferences>(`/users/${userId}/preferences`);
      return response.data;
    } catch (error) {
      console.error('Failed to get preferences:', error);
      throw error;
    }
  },

  /**
   * Register device for push notifications
   * POST /v1/users/{userId}/devices:register
   */
  registerDevice: async (
    userId: string,
    data: {
      token: string;
      platform: 'ios' | 'android';
      categories?: string[];
    }
  ): Promise<{ success: boolean; deviceId: string }> => {
    try {
      const response = await apiClient.post<{ success: boolean; deviceId: string }>(
        `/users/${userId}/devices:register`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Failed to register device:', error);
      throw error;
    }
  },

  /**
   * Queue preference sync for offline/background retry
   */
  queuePreferenceSync: async (userId: string, preferences: Partial<UserPreferences>): Promise<void> => {
    // Store in AsyncStorage for background retry
    // This would be picked up by a background service
    console.log('Queuing preference sync for user:', userId, preferences);
    // TODO: Implement background sync queue
  },
};
