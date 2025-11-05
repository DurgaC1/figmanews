import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

interface IntroScreenProps {
  onGetStarted: () => void;
  onSkip: () => void;
}

const features = [
  { emoji: '📱', title: 'TikTok-Style Scrolling', description: 'Swipe through stories vertically with an immersive full-screen experience' },
  { emoji: '🤖', title: 'AI-Powered Summaries', description: 'Get the key points instantly without reading full articles' },
  { emoji: '🌏', title: 'Multi-Language Support', description: 'Read news in your preferred Indian language' },
  { emoji: '✅', title: 'Source Credibility', description: 'Verified badges help you trust quality journalism' },
];

export function IntroScreen({ onGetStarted, onSkip }: IntroScreenProps) {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <LinearGradient
        colors={['#000000', '#0A0A1A', '#000000']}
        style={styles.gradient}
      />

      <TouchableOpacity
        onPress={onSkip}
        style={styles.skipButton}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>How NewsGenie Works</Text>
          <Text style={styles.subtitle}>
            Your personalized news feed, designed for the modern reader
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <Text style={styles.featureEmoji}>{feature.emoji}</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity
          onPress={onGetStarted}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>CONTINUE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  gradient: {
    position: 'absolute',
    width,
    height,
  },
  skipButton: {
    position: 'absolute',
    top: 56,
    right: 20,
    zIndex: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  skipText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 96,
    paddingBottom: 48,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 26,
  },
  featuresContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  featureEmoji: {
    fontSize: 36,
    marginRight: 20,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#2563EB',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
});
