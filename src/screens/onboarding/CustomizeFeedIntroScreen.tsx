import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  AccessibilityInfo,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { StackNavigationProp } from '@react-navigation/stack';
import type { OnboardingStackParamList } from '../../navigation/types';
import { useUserStore } from '../../stores/useUserStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
const PARTICLE_COUNT = 15;

interface Particle {
  x: Animated.Value;
  y: Animated.Value;
  opacity: Animated.Value;
  size: number;
}

type CustomizeFeedIntroScreenProps = {
  navigation: StackNavigationProp<OnboardingStackParamList, 'CustomizeFeedIntro'>;
};

export const CustomizeFeedIntroScreen: React.FC<CustomizeFeedIntroScreenProps> = ({ navigation }) => {
  const particles = useRef<Particle[]>([]);
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const insets = useSafeAreaInsets();
  const { setOnboardingCompleted } = useUserStore();

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((isEnabled) => {
      setReducedMotion(isEnabled || false);
    });
  }, []);

  useEffect(() => {
    if (!reducedMotion) {
      // Initialize subtle particles
      particles.current = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: new Animated.Value(Math.random() * width),
        y: new Animated.Value(Math.random() * height),
        opacity: new Animated.Value(Math.random() * 0.3 + 0.1),
        size: Math.random() * 40 + 15,
      }));

      // Animate particles
      particles.current.forEach((particle) => {
        Animated.loop(
          Animated.parallel([
            Animated.sequence([
              Animated.timing(particle.y, {
                toValue: Math.random() * height,
                duration: 10000 + Math.random() * 5000,
                useNativeDriver: true,
              }),
            ]),
            Animated.sequence([
              Animated.timing(particle.opacity, {
                toValue: Math.random() * 0.2 + 0.05,
                duration: 3000,
                useNativeDriver: true,
              }),
              Animated.timing(particle.opacity, {
                toValue: Math.random() * 0.3 + 0.1,
                duration: 3000,
                useNativeDriver: true,
              }),
            ]),
          ])
        ).start();
      });
    }
  }, [reducedMotion]);

  const handleGetStarted = () => {
    navigation.navigate('ViewTypeSelect');
  };

  const handleSkip = async () => {
    await setOnboardingCompleted(true);
    // Navigation will be handled by RootNavigator
  };

  // Get current time
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Dark background */}
      <View style={styles.background} />

      {/* Subtle particles */}
      {!reducedMotion && particles.current.map((particle, index) => (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            {
              width: particle.size,
              height: particle.size,
              transform: [
                { translateX: particle.x },
                { translateY: particle.y },
              ],
              opacity: particle.opacity,
            },
          ]}
        />
      ))}

      {/* Top bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.time}>{currentTime}</Text>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Customize{'\n'}your feed</Text>
          <Text style={styles.subtitle}>
            Set how often stories from various categories appear in your NewsGenie feed.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.getStartedButton, { marginBottom: insets.bottom + 20 }]}
          onPress={handleGetStarted}
          activeOpacity={0.9}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
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
  background: {
    position: 'absolute',
    width,
    height,
    backgroundColor: '#0A0A0A',
  },
  particle: {
    position: 'absolute',
    borderRadius: 100,
    backgroundColor: 'rgba(100, 100, 100, 0.3)',
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 100,
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 20,
    lineHeight: 56,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 26,
  },
  getStartedButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  getStartedText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
});
