import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { StackNavigationProp } from '@react-navigation/stack';
import type { OnboardingStackParamList } from '../../navigation/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Category } from '../../types/story';
import { CategoryWeight } from '../../types/user';
import { useUserStore } from '../../stores/useUserStore';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

type StoryPreferenceCardsScreenProps = {
  navigation: StackNavigationProp<OnboardingStackParamList, 'StoryPreferenceCards'>;
};

interface StoryCardData {
  category: Category;
  title: string;
  subtitle: string;
  imageUrl: string;
  color: string;
}

const STORY_CARDS: StoryCardData[] = [
  {
    category: 'politics',
    title: 'India Extends Grip Over Kashmir After Election Win',
    subtitle: 'The Modi administration revoked the regions semi-autonomy and increased its control despite recently holding local ele.',
    imageUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800',
    color: 'rgba(194, 110, 40, 0.4)',
  },
  {
    category: 'sports',
    title: 'Late Goal Lifts AC Milan Past Juventus 1-0',
    subtitle: 'The goal in stoppage time delivers a much needso victory for Milan against their rival. Juventus to stay stow the leggue table.',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800',
    color: 'rgba(76, 175, 80, 0.4)',
  },
  {
    category: 'business',
    title: 'Tech Giants Report Record Quarterly Earnings',
    subtitle: 'Major technology companies exceed market expectations with strong revenue growth driven by AI investments and cloud services.',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    color: 'rgba(33, 150, 243, 0.4)',
  },
  {
    category: 'entertainment',
    title: 'Blockbuster Film Breaks Box Office Records',
    subtitle: 'The latest superhero sequel dominates theaters worldwide, becoming the highest-grossing opening weekend of the year.',
    imageUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800',
    color: 'rgba(233, 30, 99, 0.4)',
  },
  {
    category: 'technology',
    title: 'Revolutionary AI Model Achieves Human Parity',
    subtitle: 'New artificial intelligence system demonstrates unprecedented capabilities in language understanding and reasoning tasks.',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
    color: 'rgba(103, 58, 183, 0.4)',
  },
];

export const StoryPreferenceCardsScreen: React.FC<StoryPreferenceCardsScreenProps> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [categoryWeights, setCategoryWeights] = useState<CategoryWeight[]>(
    STORY_CARDS.map((card) => ({
      category: card.category,
      weight: 3, // Default middle weight
      interaction: undefined,
    }))
  );
  const insets = useSafeAreaInsets();
  const { updatePreferences } = useUserStore();

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const currentCard = STORY_CARDS[currentIndex];
  const progress = `${currentIndex + 1}/5`;

  const updateWeight = (delta: number, interaction: 'more' | 'less') => {
    setCategoryWeights((prev) => {
      const newWeights = [...prev];
      const current = newWeights[currentIndex];
      current.weight = Math.max(0, Math.min(5, current.weight + delta));
      current.interaction = interaction;
      return newWeights;
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleMore = () => {
    updateWeight(1, 'more');
  };

  const handleLess = () => {
    updateWeight(-1, 'less');
  };

  const goToNext = () => {
    if (currentIndex < STORY_CARDS.length - 1) {
      // Mark as view_only if no interaction
      if (!categoryWeights[currentIndex].interaction) {
        setCategoryWeights((prev) => {
          const newWeights = [...prev];
          newWeights[currentIndex].interaction = 'view_only';
          return newWeights;
        });
      }
      setCurrentIndex(currentIndex + 1);
    } else {
      // Save preferences and navigate
      saveAndContinue();
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const saveAndContinue = async () => {
    // Calculate normalized weights
    const maxWeight = Math.max(...categoryWeights.map(w => w.weight));
    const normalizedWeights = categoryWeights.map(w => ({
      ...w,
      normalized: maxWeight > 0 ? w.weight / maxWeight : 0,
    }));

    // Save to store
    await updatePreferences({
      categoryWeights: normalizedWeights,
      categories: normalizedWeights
        .filter(w => w.weight > 0)
        .map(w => w.category),
    });

    // Navigate to preferences saved screen
    navigation.navigate('PreferencesSaved');
  };

  const handleSkip = () => {
    // Mark current as skipped and go to next
    setCategoryWeights((prev) => {
      const newWeights = [...prev];
      newWeights[currentIndex].interaction = 'skipped';
      return newWeights;
    });
    
    if (currentIndex < STORY_CARDS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      saveAndContinue();
    }
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx: any) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
    },
    onEnd: (event) => {
      const threshold = width * 0.3;
      
      if (event.translationX > threshold) {
        // Swipe right - go to previous
        runOnJS(goToPrevious)();
      } else if (event.translationX < -threshold) {
        // Swipe left - go to next
        runOnJS(goToNext)();
      }
      
      // Reset position
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value } as any,
      { translateY: translateY.value } as any,
    ],
  }));

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
  });

  const promptText = currentIndex === 0
    ? 'How frequently do you want to see stories like this?'
    : 'Adjust how often you want to see this.';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar style="light" />

        {/* Top bar */}
        <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
          <Text style={styles.time}>{currentTime}</Text>
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Story Card */}
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.cardContainer, animatedStyle as any]}>
            <View style={styles.card}>
              {/* Hero Image with overlay */}
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: currentCard.imageUrl }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <View style={[styles.overlay, { backgroundColor: currentCard.color }]} />
              </View>

              {/* Content */}
              <View style={styles.contentContainer}>
                <Text style={styles.cardTitle}>{currentCard.title}</Text>
                <Text style={styles.cardSubtitle}>{currentCard.subtitle}</Text>

                <Text style={styles.promptText}>{promptText}</Text>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.lessButton}
                    onPress={handleLess}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.buttonText}>Less</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.moreButton}
                    onPress={handleMore}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.buttonText}>More</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.helperText}>
                  No problem—preferences can be updated at any time.
                </Text>
              </View>
            </View>
          </Animated.View>
        </PanGestureHandler>

        {/* Progress Indicator */}
        <View style={[styles.progressContainer, { paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.progressBar}>
            {STORY_CARDS.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  index <= currentIndex && styles.progressDotActive,
                ]}
              />
            ))}
          </View>
          <Text style={styles.progressText}>{progress}</Text>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 8,
    zIndex: 10,
  },
  time: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  skipText: {
    fontSize: 17,
    color: '#FFFFFF',
    fontWeight: '400',
  },
  cardContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    overflow: 'hidden',
  },
  imageContainer: {
    height: height * 0.45,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    lineHeight: 30,
  },
  cardSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 22,
    marginBottom: 24,
  },
  promptText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  lessButton: {
    flex: 1,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.4)',
  },
  moreButton: {
    flex: 1,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.4)',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3B82F6',
  },
  helperText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  progressContainer: {
    alignItems: 'center',
    paddingTop: 16,
  },
  progressBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  progressDot: {
    width: 40,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
  },
  progressDotActive: {
    backgroundColor: '#FFFFFF',
  },
  progressText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
  },
});
