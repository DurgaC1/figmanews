import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { StoryCard } from '../types/story';
import { FEED_CONFIG } from '../utils/constants';
import { databaseService } from '../services/storage/database';
import FastImage from 'react-native-fast-image';

/**
 * Prefetch next N story cards for smooth scrolling
 */
export const usePrefetch = (
  stories: StoryCard[],
  currentIndex: number,
  enabled: boolean = true
) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled || !stories.length) return;

    const prefetchNextCards = async () => {
      const startIndex = currentIndex + 1;
      const endIndex = Math.min(
        startIndex + FEED_CONFIG.PREFETCH_NEXT_CARDS,
        stories.length
      );

      const storiesToPrefetch = stories.slice(startIndex, endIndex);

      // Prefetch images
      const imageUrls = storiesToPrefetch
        .map(story => story.imageUrl)
        .filter(Boolean);

      if (imageUrls.length > 0) {
        FastImage.preload(
          imageUrls.map(url => ({
            uri: url,
            priority: FastImage.priority.high,
          }))
        );
      }

      // Cache stories in SQLite
      try {
        await databaseService.cacheStories(storiesToPrefetch);
      } catch (error) {
        console.error('Failed to cache stories:', error);
      }

      // Prefetch story details in React Query cache
      storiesToPrefetch.forEach(story => {
        queryClient.prefetchQuery({
          queryKey: ['story', story.id],
          queryFn: async () => story,
          staleTime: 10 * 60 * 1000, // 10 minutes
        });
      });
    };

    prefetchNextCards();
  }, [currentIndex, stories, enabled, queryClient]);
};

/**
 * Prefetch audio files for offline playback
 */
export const usePrefetchAudio = (
  stories: StoryCard[],
  currentIndex: number,
  enabled: boolean = true
) => {
  useEffect(() => {
    if (!enabled || !stories.length) return;

    const prefetchAudio = async () => {
      const startIndex = currentIndex + 1;
      const endIndex = Math.min(
        startIndex + FEED_CONFIG.PREFETCH_NEXT_CARDS,
        stories.length
      );

      const audioUrls = stories
        .slice(startIndex, endIndex)
        .map(story => story.audioUrl || story.ttsUrl)
        .filter(Boolean);

      // TODO: Implement audio prefetching
      // This would involve downloading audio files to local storage
      // and updating the story URLs to point to local files
      
      if (__DEV__) {
        console.log('Prefetching audio:', audioUrls);
      }
    };

    prefetchAudio();
  }, [currentIndex, stories, enabled]);
};
