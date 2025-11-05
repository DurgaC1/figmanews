import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
  AccessibilityInfo,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import type { OnboardingStackParamList } from '../../navigation/types';

const { width, height } = Dimensions.get('window');

type IntroScreenProps = {
  navigation: StackNavigationProp<OnboardingStackParamList, 'Intro'>;
};

// Particle configuration
const PARTICLE_COUNT = 20;

interface Particle {
  x: Animated.Value;
  y: Animated.Value;
  scale: Animated.Value;
  opacity: Animated.Value;
  size: number;
  color: string;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ navigation }) => {
  const particles = useRef<Particle[]>([]);
  const [reducedMotion, setReducedMotion] = React.useState(false);

  useEffect(() => {
    // Check if reduced motion is enabled
    AccessibilityInfo.isReduceMotionEnabled().then((isEnabled) => {
      setReducedMotion(isEnabled || false);
    });
  }, []);

  useEffect(() => {
    if (!reducedMotion) {
      // Initialize particles
      particles.current = Array.from({ length: PARTICLE_COUNT }, () => {
        const colors = ['rgba(99, 102, 241, 0.6)', 'rgba(139, 92, 246, 0.6)', 'rgba(236, 72, 153, 0.6)', 'rgba(37, 99, 235, 0.6)'];
        return {
          x: new Animated.Value(Math.random() * width),
          y: new Animated.Value(Math.random() * height),
          scale: new Animated.Value(Math.random() * 0.5 + 0.5),
          opacity: new Animated.Value(Math.random() * 0.5 + 0.3),
          size: Math.random() * 60 + 20,
          color: colors[Math.floor(Math.random() * colors.length)],
        };
      });

      // Animate particles
      particles.current.forEach((particle) => {
        const animate = () => {
          Animated.loop(
            Animated.parallel([
              Animated.sequence([
                Animated.timing(particle.y, {
                  toValue: Math.random() * height,
                  duration: 8000 + Math.random() * 4000,
                  useNativeDriver: true,
                }),
              ]),
              Animated.sequence([
                Animated.timing(particle.x, {
                  toValue: Math.random() * width,
                  duration: 10000 + Math.random() * 5000,
                  useNativeDriver: true,
                }),
              ]),
              Animated.sequence([
                Animated.timing(particle.scale, {
                  toValue: Math.random() * 0.5 + 0.5,
                  duration: 3000,
                  useNativeDriver: true,
                }),
                Animated.timing(particle.scale, {
                  toValue: Math.random() * 0.5 + 0.5,
                  duration: 3000,
                  useNativeDriver: true,
                }),
              ]),
              Animated.sequence([
                Animated.timing(particle.opacity, {
                  toValue: Math.random() * 0.3 + 0.1,
                  duration: 2000,
                  useNativeDriver: true,
                }),
                Animated.timing(particle.opacity, {
                  toValue: Math.random() * 0.5 + 0.3,
                  duration: 2000,
                  useNativeDriver: true,
                }),
              ]),
            ])
          ).start();
        };
        animate();
      });
    }
  }, [reducedMotion]);

  const handleAuth = async (provider: 'apple' | 'google' | 'facebook') => {
    try {
      // For development, use mock authentication
      // In production, replace with: oauthService.authenticate(provider)
      const { oauthService } = await import('../../services/auth/oauthService');
      
      const result = await oauthService.mockAuthenticate(provider);
      
      if (result.success) {
        // Store user in global state
        const { useUserStore } = await import('../../stores/useUserStore');
        useUserStore.getState().setUser(result.user);
        
        // Navigate to feed customization
        navigation.navigate('CustomizeFeedIntro');
        
        // TODO: Show consent banner on first sign-in
      }
    } catch (error) {
      console.error('Authentication error:', error);
      // TODO: Show error alert
    }
  };

  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['#0A0A1F', '#1A0A2E', '#0A0A1F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />

      {/* Animated Particles */}
      {!reducedMotion && particles.current.map((particle, index) => (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            {
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              transform: [
                { translateX: particle.x },
                { translateY: particle.y },
                { scale: particle.scale },
              ],
              opacity: particle.opacity,
            },
          ]}
        />
      ))}

      {/* Main Content */}
      <View style={styles.content}>
        {/* Brand Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={['#2563EB', '#3B82F6']}
              style={styles.logoGradient}
            >
              <Ionicons name="newspaper" size={40} color="#FFFFFF" />
            </LinearGradient>
          </View>
          <Text style={styles.appName}>NewsGenie</Text>
          <Text style={styles.tagline}>Stay informed effortlessly</Text>
        </View>

        {/* Value Prop Cards */}
        <View style={styles.cardsContainer}>
          {/* Card 1: See stories from every side */}
          <View style={styles.card}>
            <LinearGradient
              colors={['rgba(37, 99, 235, 0.1)', 'rgba(59, 130, 246, 0.05)']}
              style={styles.cardGradient}
            >
              <Text style={styles.cardTitle}>See stories{'\n'}from every side</Text>
              <Text style={styles.cardSubtext}>
                View coverage from multiple sources so you always see varied perspectives.
              </Text>
              
              {/* Demo illustration - multiple source icons */}
              <View style={styles.demoIllustration}>
                <View style={styles.sourceIconsContainer}>
                  <View style={[styles.sourceIcon, { backgroundColor: '#3B82F6' }]}>
                    <Text style={styles.sourceIconText}>AlC</Text>
                  </View>
                  <View style={[styles.sourceIcon, { backgroundColor: '#2563EB', width: 70, height: 70 }]}>
                    <Ionicons name="newspaper" size={32} color="#FFFFFF" />
                  </View>
                  <View style={[styles.sourceIcon, { backgroundColor: '#1D4ED8' }]}>
                    <Text style={styles.sourceIconText}>It</Text>
                  </View>
                  <View style={[styles.sourceIcon, { backgroundColor: '#EF4444', width: 40, height: 40, position: 'absolute', top: 40, left: 10 }]}>
                    <Text style={styles.sourceIconText}>TM</Text>
                  </View>
                  <View style={[styles.sourceIcon, { backgroundColor: '#10B981', width: 45, height: 45, position: 'absolute', bottom: 35, right: 15 }]}>
                    <Ionicons name="play" size={16} color="#FFFFFF" />
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Card 2: Learn faster, your way */}
          <View style={styles.card}>
            <LinearGradient
              colors={['rgba(37, 99, 235, 0.1)', 'rgba(59, 130, 246, 0.05)']}
              style={styles.cardGradient}
            >
              <Text style={styles.cardTitle}>Learn faster,{'\n'}your way</Text>
              <Text style={styles.cardSubtext}>
                Control which stories show up, explore articles, get summaries, or listen on the go
              </Text>
              
              {/* Demo story tile */}
              <View style={styles.demoStoryTile}>
                <View style={styles.demoStoryImage}>
                  {/* Placeholder for astronaut image */}
                  <LinearGradient
                    colors={['#7C2D12', '#991B1B']}
                    style={styles.demoImageGradient}
                  >
                    <Ionicons name="rocket" size={40} color="#FFFFFF" />
                  </LinearGradient>
                </View>
                <Text style={styles.demoStoryText}>
                  What are the implications of China's plan to send a crewed mission to the moon by 2030?
                </Text>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Authentication CTAs */}
        <View style={styles.ctaContainer}>
          {/* Primary CTA - Platform specific */}
          {Platform.OS === 'ios' ? (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => handleAuth('apple')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#FFFFFF', '#F5F5F5']}
                style={styles.buttonGradient}
              >
                <Ionicons name="logo-apple" size={24} color="#000000" style={styles.buttonIcon} />
                <Text style={styles.primaryButtonText}>Continue</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => handleAuth('google')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#FFFFFF', '#F5F5F5']}
                style={styles.buttonGradient}
              >
                <Ionicons name="logo-google" size={24} color="#DB4437" style={styles.buttonIcon} />
                <Text style={styles.primaryButtonText}>Continue</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Secondary CTA - Facebook */}
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => handleAuth('facebook')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#1877F2', '#1865D1']}
              style={styles.buttonGradient}
            >
              <Ionicons name="logo-facebook" size={24} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.secondaryButtonText}>Facebook</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Legal Footer */}
        <View style={styles.footer}>
          <View style={styles.legalLinks}>
            <TouchableOpacity onPress={() => openLink('https://newsgenie.com/privacy')}>
              <Text style={styles.legalLink}>Privacy Policy</Text>
            </TouchableOpacity>
            <Text style={styles.legalSeparator}>•</Text>
            <TouchableOpacity onPress={() => openLink('https://newsgenie.com/terms')}>
              <Text style={styles.legalLink}>Terms</Text>
            </TouchableOpacity>
            <Text style={styles.legalSeparator}>•</Text>
            <TouchableOpacity onPress={() => openLink('https://newsgenie.com/data-use')}>
              <Text style={styles.legalLink}>Data Use (analytics & perso...</Text>
            </TouchableOpacity>
          </View>
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
    height,
  },
  particle: {
    position: 'absolute',
    borderRadius: 100,
    zIndex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
    zIndex: 2,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  appName: {
    fontSize: 42,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  cardsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
    flex: 1,
  },
  card: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  cardGradient: {
    flex: 1,
    padding: 16,
    paddingBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
    lineHeight: 24,
  },
  cardSubtext: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 18,
    marginBottom: 16,
  },
  demoIllustration: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  sourceIconsContainer: {
    position: 'relative',
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sourceIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  sourceIconText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  demoStoryTile: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  demoStoryImage: {
    height: 100,
    backgroundColor: '#7C2D12',
  },
  demoImageGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  demoStoryText: {
    fontSize: 12,
    color: '#FFFFFF',
    padding: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
  ctaContainer: {
    gap: 12,
    marginBottom: 20,
  },
  primaryButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  secondaryButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#1877F2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  buttonIcon: {
    marginRight: 10,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  footer: {
    alignItems: 'center',
  },
  legalLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  legalLink: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    paddingHorizontal: 4,
  },
  legalSeparator: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 4,
  },
});
