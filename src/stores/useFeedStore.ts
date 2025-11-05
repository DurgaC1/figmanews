import { create } from 'zustand';

interface FeedStore {
  activeCardIndex: number;
  feedScrollOffset: number;
  
  // Actions
  setActiveCardIndex: (index: number) => void;
  setFeedScrollOffset: (offset: number) => void;
  incrementActiveCard: () => void;
  decrementActiveCard: () => void;
  reset: () => void;
}

export const useFeedStore = create<FeedStore>((set, get) => ({
  activeCardIndex: 0,
  feedScrollOffset: 0,

  setActiveCardIndex: (index) => set({ activeCardIndex: index }),
  setFeedScrollOffset: (offset) => set({ feedScrollOffset: offset }),
  
  incrementActiveCard: () => {
    const currentIndex = get().activeCardIndex;
    set({ activeCardIndex: currentIndex + 1 });
  },
  
  decrementActiveCard: () => {
    const currentIndex = get().activeCardIndex;
    if (currentIndex > 0) {
      set({ activeCardIndex: currentIndex - 1 });
    }
  },
  
  reset: () => set({
    activeCardIndex: 0,
    feedScrollOffset: 0,
  }),
}));
