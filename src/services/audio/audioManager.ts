import { Audio, AVPlaybackStatus } from "expo-av";
import { Sound } from "expo-av/build/Audio";
import { AUDIO_CONFIG } from "../../utils/constants";

class AudioManager {
  private sound: Sound | null = null;
  private currentStoryId: string | null = null;
  private isInitialized = false;

  async init(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await Audio.setAudioModeAsync({
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
      });
      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize audio:", error);
      throw error;
    }
  }

  async loadAudio(storyId: string, audioUrl: string): Promise<void> {
    try {
      // Unload previous sound
      if (this.sound) {
        await this.sound.unloadAsync();
        this.sound = null;
      }

      // Load new sound
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: false },
        this.onPlaybackStatusUpdate
      );

      this.sound = sound;
      this.currentStoryId = storyId;
    } catch (error) {
      console.error("Failed to load audio:", error);
      throw error;
    }
  }

  async play(): Promise<void> {
    if (!this.sound) return;

    try {
      await this.sound.playAsync();
    } catch (error) {
      console.error("Failed to play audio:", error);
      throw error;
    }
  }

  async pause(): Promise<void> {
    if (!this.sound) return;

    try {
      await this.sound.pauseAsync();
    } catch (error) {
      console.error("Failed to pause audio:", error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (!this.sound) return;

    try {
      await this.sound.stopAsync();
      await this.sound.setPositionAsync(0);
    } catch (error) {
      console.error("Failed to stop audio:", error);
      throw error;
    }
  }

  async seek(positionMillis: number): Promise<void> {
    if (!this.sound) return;

    try {
      await this.sound.setPositionAsync(positionMillis);
    } catch (error) {
      console.error("Failed to seek audio:", error);
      throw error;
    }
  }

  async setVolume(volume: number): Promise<void> {
    if (!this.sound) return;

    try {
      await this.sound.setVolumeAsync(Math.max(0, Math.min(1, volume)));
    } catch (error) {
      console.error("Failed to set volume:", error);
      throw error;
    }
  }

  async getStatus(): Promise<AVPlaybackStatus | null> {
    if (!this.sound) return null;

    try {
      return await this.sound.getStatusAsync();
    } catch (error) {
      console.error("Failed to get status:", error);
      return null;
    }
  }

  getCurrentStoryId(): string | null {
    return this.currentStoryId;
  }

  private onPlaybackStatusUpdate = (status: AVPlaybackStatus): void => {
    if (!status.isLoaded) {
      // Handle error
      if ("error" in status && status.error) {
        console.error("Playback error:", status.error);
      }
    }
  };

  async unload(): Promise<void> {
    if (this.sound) {
      try {
        await this.sound.unloadAsync();
        this.sound = null;
        this.currentStoryId = null;
      } catch (error) {
        console.error("Failed to unload audio:", error);
      }
    }
  }

  async cleanup(): Promise<void> {
    await this.unload();
    this.isInitialized = false;
  }
}

export const audioManager = new AudioManager();
