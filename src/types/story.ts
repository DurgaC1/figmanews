export interface Story {
    id: string;
    title: string;
    summary: string;
    category: string;
    source: string;
    imageUrl: string;
    audioUrl?: string;
    publishedAt: string;
    readTime: number;
    language: string;
    author?: string;
    
    // Detailed view fields
    fullContent?: string;
    quotes?: Quote[];
    relatedStories?: RelatedStory[];
    tags?: string[];
    viewCount?: number;
    shareCount?: number;
  }
  
  export interface Quote {
    id: string;
    text: string;
    author: string;
    role?: string;
  }
  
  export interface RelatedStory {
    id: string;
    title: string;
    imageUrl: string;
    category: string;
  }
  
  export interface StoryCard {
    id: string;
    title: string;
    summary: string;
    category: string;
    source: string;
    imageUrl: string;
    audioUrl?: string;
    ttsUrl?: string;
    publishedAt: string;
    readTime: number;
    language: string;
  }
  
  export type Category = 
    | 'politics'
    | 'business'
    | 'technology'
    | 'sports'
    | 'entertainment'
    | 'science'
    | 'health'
    | 'world';
  
  export type Language = 
    | 'en'
    | 'hi'
    | 'ta'
    | 'te'
    | 'bn'
    | 'mr'
    | 'gu'
    | 'kn'
    | 'ml'
    | 'pa';
  
  export interface FeedParams {
    page: number;
    limit: number;
    categories?: Category[];
    languages?: Language[];
    cursor?: string;
  }
  
  export interface FeedResponse {
    stories: StoryCard[];
    nextCursor?: string;
    hasMore: boolean;
  }
  