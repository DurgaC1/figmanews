import { apiClient } from './client';
import { FeedResponse, FeedParams, Story, StoryCard } from '../../types/story';
import { ApiResponse } from '../../types/api';

export const feedApi = {
  /**
   * Get personalized feed for mobile
   * BFF endpoint optimized for mobile with compact StoryCards
   */
  getFeed: async (params: FeedParams): Promise<FeedResponse> => {
    const response = await apiClient.get<FeedResponse>('/mobile/feed', params);
    return response.data;
  },

  /**
   * Get story details by ID
   */
  getStory: async (storyId: string): Promise<Story> => {
    const response = await apiClient.get<Story>(`/stories/${storyId}`);
    return response.data;
  },

  /**
   * Search stories
   */
  searchStories: async (query: string, params: Partial<FeedParams>): Promise<FeedResponse> => {
    const response = await apiClient.get<FeedResponse>('/stories/search', {
      q: query,
      ...params,
    });
    return response.data;
  },

  /**
   * Get trending stories
   */
  getTrending: async (params: Partial<FeedParams>): Promise<FeedResponse> => {
    const response = await apiClient.get<FeedResponse>('/stories/trending', params);
    return response.data;
  },

  /**
   * Get bookmarked stories
   */
  getBookmarks: async (params: Partial<FeedParams>): Promise<FeedResponse> => {
    const response = await apiClient.get<FeedResponse>('/user/bookmarks', params);
    return response.data;
  },

  /**
   * Bookmark a story
   */
  bookmarkStory: async (storyId: string): Promise<void> => {
    await apiClient.post(`/stories/${storyId}/bookmark`);
  },

  /**
   * Remove bookmark
   */
  unbookmarkStory: async (storyId: string): Promise<void> => {
    await apiClient.delete(`/stories/${storyId}/bookmark`);
  },

  /**
   * Share a story
   */
  shareStory: async (storyId: string, platform: string): Promise<void> => {
    await apiClient.post(`/stories/${storyId}/share`, { platform });
  },
};

// Mock data for development
export const mockFeedData: StoryCard[] = [
  {
    id: '1',
    title: 'India\'s GDP Growth Surpasses Expectations in Q3',
    summary: 'Indian economy shows robust growth at 7.8%, driven by strong consumer demand and infrastructure investments.',
    category: 'business',
    source: 'Economic Times',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f',
    audioUrl: 'https://example.com/audio/1.mp3',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    readTime: 3,
    language: 'en',
  },
  {
    id: '2',
    title: 'ISRO Successfully Launches Chandrayaan-4 Mission',
    summary: 'India\'s space agency achieves another milestone with the successful launch of its fourth lunar mission.',
    category: 'science',
    source: 'The Hindu',
    imageUrl: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7',
    audioUrl: 'https://example.com/audio/2.mp3',
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    readTime: 4,
    language: 'en',
  },
  {
    id: '3',
    title: 'Indian Cricket Team Wins Test Series Against Australia',
    summary: 'Historic victory as India defeats Australia 3-1 in the Border-Gavaskar Trophy.',
    category: 'sports',
    source: 'Cricbuzz',
    imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da',
    audioUrl: 'https://example.com/audio/3.mp3',
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    readTime: 2,
    language: 'en',
  },
  {
    id: '4',
    title: 'New Education Policy Shows Promising Results',
    summary: 'Implementation of NEP 2020 brings positive changes in school curriculum and student outcomes.',
    category: 'politics',
    source: 'India Today',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b',
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    readTime: 5,
    language: 'en',
  },
  {
    id: '5',
    title: 'Bollywood Star Announces New Film Project',
    summary: 'Leading actor collaborates with acclaimed director for an ambitious period drama.',
    category: 'entertainment',
    source: 'Filmfare',
    imageUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26',
    audioUrl: 'https://example.com/audio/5.mp3',
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    readTime: 3,
    language: 'en',
  },
];
