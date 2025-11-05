import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { StackNavigationProp } from '@react-navigation/stack';
import type { OnboardingStackParamList } from '../../navigation/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '../../stores/useUserStore';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

type ViewTypeSelectScreenProps = {
  navigation: StackNavigationProp<OnboardingStackParamList, 'ViewTypeSelect'>;
};

type ViewType = 'tiktok' | 'newspaper';

interface ViewOption {
  type: ViewType;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const VIEW_OPTIONS: ViewOption[] = [
  {
    type: 'tiktok',
    title: 'Swipe View',
    subtitle: 'Quick, vertical stories like social media',
    icon: 'phone-portrait',
    color: '#3B82F6',
  },
  {
    type: 'newspaper',
    title: 'Read View',
    subtitle: 'Traditional article layout for in-depth reading',
    icon: 'newspaper',
    color: '#10B981',
  },
];

export const ViewTypeSelectScreen: React.FC<ViewTypeSelectScreenProps> = ({ navigation }) => {
  const [selectedType, setSelectedType] = useState<ViewType>('tiktok');
  const scaleAnimations = useRef(
    VIEW_OPTIONS.map(() => new Animated.Value(1))
  ).current;
  const insets = useSafeAreaInsets();
  const { updatePreferences } = useUserStore();

  const handleSelectType = (type: ViewType, index: number) => {
    setSelectedType(type);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Scale animation
    Animated.sequence([
      Animated.timing(scaleAnimations[index], {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimations[index], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleContinue = async () => {
    await updatePreferences({ viewType: selectedType });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('StoryPreferenceCards');
  };

  const handleSkip = async () => {
    await updatePreferences({ viewType: 'tiktok' }); // Default
    navigation.navigate('StoryPreferenceCards');
  };

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Top bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.time}>{currentTime}</Text>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Title Section */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Choose your{'\n'}news experience</Text>
          <Text style={styles.subtitle}>
            Pick how you want to consume news. You can change this anytime in settings.
          </Text>
        </View>

        {/* View Type Options */}
        <View style={styles.optionsContainer}>
          {VIEW_OPTIONS.map((option, index) => {
            const isSelected = selectedType === option.type;
            
            return (
              <Animated.View
                key={option.type}
                style={[
                  {
                    transform: [{ scale: scaleAnimations[index] }],
                  },
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.optionCard,
                    isSelected && styles.optionCardSelected,
                    { borderColor: isSelected ? option.color : 'rgba(255, 255, 255, 0.1)' },
                  ]}
                  onPress={() => handleSelectType(option.type, index)}
                  activeOpacity={0.9}
                >
                  {/* Icon Container */}
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: `${option.color}20` },
                    ]}
                  >
                    <Ionicons
                      name={option.icon}
                      size={32}
                      color={isSelected ? option.color : 'rgba(255, 255, 255, 0.6)'}
                    />
                  </View>

                  {/* Text Content */}
                  <View style={styles.optionContent}>
                    <View style={styles.optionHeader}>
                      <Text style={styles.optionTitle}>{option.title}</Text>
                      {isSelected && (
                        <View style={[styles.checkmark, { backgroundColor: option.color }]}>
                          <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                        </View>
                      )}
                    </View>
                    <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {/* Helper Text */}
        <Text style={styles.helperText}>
          Don't worry—you can switch between views anytime
        </Text>

        {/* Continue Button */}
        <TouchableOpacity
          style={[styles.continueButton, { marginBottom: insets.bottom + 20 }]}
          onPress={handleContinue}
          activeOpacity={0.9}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  titleContainer: {
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    lineHeight: 50,
  },
  subtitle: {
    fontSize: 17,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 24,
  },
  optionsContainer: {
    flex: 1,
    gap: 16,
  },
  optionCard: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    alignItems: 'center',
    gap: 16,
  },
  optionCardSelected: {
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionContent: {
    flex: 1,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 20,
  },
  helperText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  continueButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
});
