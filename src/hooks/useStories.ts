import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { feedApi, mockFeedData } from '../services/api/feed';
import { FeedParams, StoryCard } from '../types/story';
import { useUserStore } from '../stores/useUserStore';
import { FEED_CONFIG } from '../utils/constants';
import { databaseService } from '../services/storage/database';

const USE_MOCK_DATA = true; // Set to false when API is ready

export const useStories = (params?: Partial<FeedParams>) => {
  const preferences = useUserStore((state) => state.preferences);

  return useInfiniteQuery({
    queryKey: ['stories', preferences.categories, preferences.languages, params],
    queryFn: async ({ pageParam = 0 }) => {
      if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Return mock data with pagination
        const start = pageParam * FEED_CONFIG.ITEMS_PER_PAGE;
        const end = start + FEED_CONFIG.ITEMS_PER_PAGE;
        const stories = mockFeedData.slice(start, end);
        
        return {
          stories,
          nextCursor: end < mockFeedData.length ? (pageParam + 1).toString() : undefined,
          hasMore: end < mockFeedData.length,
        };
      }

      return feedApi.getFeed({
        page: pageParam,
        limit: params?.limit || FEED_CONFIG.ITEMS_PER_PAGE,
        categories: preferences.categories,
        languages: preferences.languages,
        ...params,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length : undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useStory = (storyId: string) => {
  return useInfiniteQuery({
    queryKey: ['story', storyId],
    queryFn: async () => {
      // Try to get from cache first
      const cached = await databaseService.getCachedStory(storyId);
      if (cached) return cached;

      // Fetch from API
      return feedApi.getStory(storyId);
    },
    initialPageParam: 0,
    getNextPageParam: () => undefined,
  });
};

export const useBookmarkStory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ storyId, isBookmarked }: { storyId: string; isBookmarked: boolean }) => {
      // Update local database
      if (isBookmarked) {
        await databaseService.addBookmark(storyId);
      } else {
        await databaseService.removeBookmark(storyId);
      }

      // Update API
      if (isBookmarked) {
        await feedApi.bookmarkStory(storyId);
      } else {
        await feedApi.unbookmarkStory(storyId);
      }
    },
    onSuccess: () => {
      // Invalidate bookmarks query
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });
};

export const useShareStory = () => {
  return useMutation({
    mutationFn: async ({ storyId, platform }: { storyId: string; platform: string }) => {
      await feedApi.shareStory(storyId, platform);
    },
  });
};
