import { useEffect, useCallback } from "react";
import { audioManager } from "../services/audio/audioManager";
import { useAudioStore } from "../stores/useAudioStore";
import { useUserStore } from "../stores/useUserStore";
import { AUDIO_CONFIG } from "../utils/constants";

export const useAudioPlayer = (storyId: string, audioUrl?: string) => {
  const {
    currentStoryId,
    isPlaying,
    isLoading,
    setCurrentStory,
    setIsPlaying,
    setIsLoading,
    reset,
  } = useAudioStore();

  const audioAutoplay = useUserStore(
    (state) => state.preferences.audioAutoplay
  );

  const isCurrentStory = currentStoryId === storyId;

  // Load audio when story becomes active
  const loadAudio = useCallback(async () => {
    if (!audioUrl) return;

    try {
      setIsLoading(true);
      await audioManager.loadAudio(storyId, audioUrl);
      setCurrentStory(storyId);
    } catch (error) {
      console.error("Failed to load audio:", error);
    } finally {
      setIsLoading(false);
    }
  }, [storyId, audioUrl, setCurrentStory, setIsLoading]);

  // Play audio
  const play = useCallback(async () => {
    if (!isCurrentStory) {
      await loadAudio();
    }

    try {
      await audioManager.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("Failed to play audio:", error);
    }
  }, [isCurrentStory, loadAudio, setIsPlaying]);

  // Pause audio
  const pause = useCallback(async () => {
    try {
      await audioManager.pause();
      setIsPlaying(false);
    } catch (error) {
      console.error("Failed to pause audio:", error);
    }
  }, [setIsPlaying]);

  // Toggle play/pause
  const togglePlayPause = useCallback(async () => {
    if (isPlaying) {
      await pause();
    } else {
      await play();
    }
  }, [isPlaying, play, pause]);

  // Seek to position
  const seek = useCallback(async (positionMillis: number) => {
    try {
      await audioManager.seek(positionMillis);
    } catch (error) {
      console.error("Failed to seek audio:", error);
    }
  }, []);

  // Auto-play when story becomes active
  useEffect(() => {
    if (!audioUrl || !audioAutoplay) return;

    let timeout: ReturnType<typeof setTimeout>;

    const autoPlay = async () => {
      timeout = setTimeout(async () => {
        await loadAudio();
        await play();
      }, AUDIO_CONFIG.AUTOPLAY_DELAY);
    };

    autoPlay();

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [storyId, audioUrl, audioAutoplay, loadAudio, play]);

  // Cleanup when component unmounts or story changes
  useEffect(() => {
    return () => {
      if (isCurrentStory && isPlaying) {
        pause();
      }
    };
  }, [isCurrentStory, isPlaying, pause]);

  return {
    isCurrentStory,
    isPlaying,
    isLoading,
    play,
    pause,
    togglePlayPause,
    seek,
  };
};
