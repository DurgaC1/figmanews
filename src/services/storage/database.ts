import { StoryCard } from '../../types/story';

// Conditionally import SQLite to avoid errors in Expo Go
// Use dynamic import pattern to catch module initialization errors
let SQLite: typeof import('expo-sqlite') | null = null;
try {
  // Use require instead of import to catch initialization errors
  SQLite = require('expo-sqlite');
} catch (e) {
  // SQLite not available (e.g., in Expo Go) - will be handled gracefully
  SQLite = null;
}

class DatabaseService {
  private db: any = null; // SQLite.SQLiteDatabase | null, but using any to avoid type issues when SQLite is null

  async init(): Promise<void> {
    // Early return if SQLite is not available (e.g., in Expo Go)
    if (!SQLite || typeof SQLite.openDatabaseAsync !== 'function') {
      this.db = null;
      return;
    }

    try {
      this.db = await SQLite.openDatabaseAsync('newsgenie.db');
      await this.createTables();
    } catch (error: any) {
      // In Expo Go, SQLite native module might not be available
      // This is expected and handled gracefully
      const isExpoGoError = 
        error?.message?.includes('ExpoSQLiteNext') ||
        error?.message?.includes('native module') ||
        error?.message?.includes('Cannot find native module') ||
        error?.code === 'MODULE_NOT_FOUND';
      
      if (isExpoGoError) {
        // Silently handle - expected in Expo Go
        this.db = null;
        return;
      }
      
      // Only log unexpected errors
      if (__DEV__) {
        console.warn('Database initialization skipped:', error?.message || error);
      }
      this.db = null;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) return;

    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS cached_stories (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        cached_at INTEGER NOT NULL,
        expires_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS bookmarks (
        story_id TEXT PRIMARY KEY,
        bookmarked_at INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_cached_stories_expires 
      ON cached_stories(expires_at);
    `);
  }

  // Cached Stories
  async cacheStories(stories: StoryCard[], ttl: number = 60 * 60 * 1000): Promise<void> {
    if (!this.db) return;

    const now = Date.now();
    const expiresAt = now + ttl;

    for (const story of stories) {
      await this.db.runAsync(
        'INSERT OR REPLACE INTO cached_stories (id, data, cached_at, expires_at) VALUES (?, ?, ?, ?)',
        [story.id, JSON.stringify(story), now, expiresAt]
      );
    }
  }

  async getCachedStories(limit: number = 50): Promise<StoryCard[]> {
    if (!this.db) return [];

    const now = Date.now();
    const rows = await this.db.getAllAsync<{ data: string }>(
      'SELECT data FROM cached_stories WHERE expires_at > ? ORDER BY cached_at DESC LIMIT ?',
      [now, limit]
    );

    return rows.map(row => JSON.parse(row.data));
  }

  async getCachedStory(storyId: string): Promise<StoryCard | null> {
    if (!this.db) return null;

    const now = Date.now();
    const row = await this.db.getFirstAsync<{ data: string }>(
      'SELECT data FROM cached_stories WHERE id = ? AND expires_at > ?',
      [storyId, now]
    );

    return row ? JSON.parse(row.data) : null;
  }

  async clearExpiredCache(): Promise<void> {
    if (!this.db) return;

    const now = Date.now();
    await this.db.runAsync('DELETE FROM cached_stories WHERE expires_at <= ?', [now]);
  }

  // Bookmarks
  async addBookmark(storyId: string): Promise<void> {
    if (!this.db) return;

    await this.db.runAsync(
      'INSERT OR REPLACE INTO bookmarks (story_id, bookmarked_at) VALUES (?, ?)',
      [storyId, Date.now()]
    );
  }

  async removeBookmark(storyId: string): Promise<void> {
    if (!this.db) return;

    await this.db.runAsync('DELETE FROM bookmarks WHERE story_id = ?', [storyId]);
  }

  async isBookmarked(storyId: string): Promise<boolean> {
    if (!this.db) return false;

    const row = await this.db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM bookmarks WHERE story_id = ?',
      [storyId]
    );

    return (row?.count ?? 0) > 0;
  }

  async getBookmarkedStoryIds(): Promise<string[]> {
    if (!this.db) return [];

    const rows = await this.db.getAllAsync<{ story_id: string }>(
      'SELECT story_id FROM bookmarks ORDER BY bookmarked_at DESC'
    );

    return rows.map(row => row.story_id);
  }

  // Cleanup
  async clearAll(): Promise<void> {
    if (!this.db) return;

    await this.db.execAsync(`
      DELETE FROM cached_stories;
      DELETE FROM bookmarks;
    `);
  }
}

export const databaseService = new DatabaseService();
