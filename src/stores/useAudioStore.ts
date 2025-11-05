import { create } from 'zustand';

interface AudioStore {
  currentStoryId: string | null;
  isPlaying: boolean;
  duration: number;
  position: number;
  isLoading: boolean;
  
  // Actions
  setCurrentStory: (storyId: string | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setDuration: (duration: number) => void;
  setPosition: (position: number) => void;
  setIsLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useAudioStore = create<AudioStore>((set) => ({
  currentStoryId: null,
  isPlaying: false,
  duration: 0,
  position: 0,
  isLoading: false,

  setCurrentStory: (storyId) => set({ currentStoryId: storyId }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setDuration: (duration) => set({ duration }),
  setPosition: (position) => set({ position }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  reset: () => set({
    currentStoryId: null,
    isPlaying: false,
    duration: 0,
    position: 0,
    isLoading: false,
  }),
}));
