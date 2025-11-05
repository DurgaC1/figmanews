import { apiClient } from './client';
import { EventPayload } from '../../types/api';

export const eventsApi = {
  /**
   * Track user events for analytics
   */
  trackEvent: async (event: string, properties: Record<string, any>): Promise<void> => {
    const payload: EventPayload = {
      event,
      properties,
      timestamp: new Date().toISOString(),
    };

    try {
      await apiClient.post('/mobile/events', payload);
    } catch (error) {
      // Silently fail analytics events
      if (__DEV__) {
        console.warn('Failed to track event:', event, error);
      }
    }
  },

  /**
   * Batch track multiple events
   */
  trackBatchEvents: async (events: EventPayload[]): Promise<void> => {
    try {
      await apiClient.post('/mobile/events/batch', { events });
    } catch (error) {
      if (__DEV__) {
        console.warn('Failed to track batch events:', error);
      }
    }
  },
};
