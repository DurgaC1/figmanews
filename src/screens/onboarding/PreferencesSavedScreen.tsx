import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import type { OnboardingStackParamList } from '../../navigation/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useUserStore } from '../../stores/useUserStore';

const { width } = Dimensions.get('window');

type PreferencesSavedScreenProps = {
  navigation: StackNavigationProp<OnboardingStackParamList, 'PreferencesSaved'>;
};

// Confetti particle component
interface ConfettiParticle {
  x: Animated.Value;
  y: Animated.Value;
  rotation: Animated.Value;
  color: string;
}

export const PreferencesSavedScreen: React.FC<PreferencesSavedScreenProps> = ({ navigation }) => {
  const confettiParticles = useRef<ConfettiParticle[]>([]);
  const celebrationScale = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const { updatePreferences } = useUserStore();

  useEffect(() => {
    // Trigger haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Animate celebration icon
    Animated.spring(celebrationScale, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();

    // Create confetti particles
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
    confettiParticles.current = Array.from({ length: 30 }, () => ({
      x: new Animated.Value(width / 2),
      y: new Animated.Value(100),
      rotation: new Animated.Value(0),
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    // Animate confetti
    confettiParticles.current.forEach((particle, index) => {
      const delay = index * 30;
      const randomX = (Math.random() - 0.5) * width;
      const randomRotation = Math.random() * 720 - 360;

      Animated.parallel([
        Animated.timing(particle.x, {
          toValue: width / 2 + randomX,
          duration: 1500,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(particle.y, {
          toValue: 600 + Math.random() * 200,
          duration: 1500,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(particle.rotation, {
          toValue: randomRotation,
          duration: 1500,
          delay,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, []);

  const handleRefineFurther = () => {
    // Navigate to additional preference cards
    // TODO: Implement refined preference flow
    console.log('Refine further');
  };

  const handlePreviewResults = () => {
    // Show temporary feed preview
    // TODO: Implement preview modal
    console.log('Preview results');
  };

  const handleFinishOnboarding = async () => {
    await updatePreferences({ preferencesFinalized: true });
    navigation.navigate('AllowNotifications');
  };

  const handleSkip = () => {
    handleFinishOnboarding();
  };

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Gradient Background */}
      <LinearGradient
        colors={['#0A0A1F', '#1A1A3E', '#0A0A1F']}
        style={styles.gradient}
      />

      {/* Confetti particles */}
      {confettiParticles.current.map((particle, index) => (
        <Animated.View
          key={index}
          style={[
            styles.confetti,
            {
              backgroundColor: particle.color,
              transform: [
                { translateX: particle.x },
                { translateY: particle.y },
                { rotate: particle.rotation.interpolate({
                    inputRange: [0, 360],
                    outputRange: ['0deg', '360deg'],
                  })
                },
              ],
            },
          ]}
        />
      ))}

      {/* Top bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <View style={styles.topLeft}>
          <Text style={styles.time}>{currentTime}</Text>
          <TouchableOpacity onPress={handlePreviewResults} style={styles.previewButton}>
            <Text style={styles.previewText}>Preview Results</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Celebration Icon */}
        <Animated.View
          style={[
            styles.celebrationContainer,
            {
              transform: [{ scale: celebrationScale }],
            },
          ]}
        >
          <View style={styles.celebrationIcon}>
            <Ionicons name="sparkles" size={60} color="#FFD700" />
          </View>
        </Animated.View>

        {/* Title and Subtext */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Preferences Saved!{'\n'}Keep going?</Text>
          <Text style={styles.subtitle}>
            NewsGenie is ready to deliver stories based on your feedback. You can fine-tune further to maximize personalization.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + 20 }]}>
          <TouchableOpacity
            style={styles.refineButton}
            onPress={handleRefineFurther}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#1E293B', '#0F172A']}
              style={styles.refineGradient}
            >
              <Text style={styles.refineButtonText}>Refine Further</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.finishButton}
            onPress={handleFinishOnboarding}
            activeOpacity={0.9}
          >
            <Text style={styles.finishButtonText}>Finish Onboarding</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A1F',
  },
  gradient: {
    position: 'absolute',
    width,
    height: '100%',
  },
  confetti: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 8,
    zIndex: 10,
  },
  topLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  time: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  previewButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  previewText: {
    fontSize: 15,
    color: '#3B82F6',
    fontWeight: '500',
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  celebrationContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  celebrationIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 80,
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 50,
  },
  subtitle: {
    fontSize: 17,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 26,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  buttonContainer: {
    gap: 12,
  },
  refineButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  refineGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  refineButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  finishButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  finishButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
});
