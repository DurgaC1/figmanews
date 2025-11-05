import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onSkip: () => void;
}

export function WelcomeScreen({ onGetStarted, onSkip }: WelcomeScreenProps) {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800' }}
        style={styles.backgroundImage}
      />

      <LinearGradient
        colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.9)']}
        style={styles.gradient}
      />

      <TouchableOpacity
        onPress={onSkip}
        style={styles.skipButton}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.emoji}>✨</Text>
          <Text style={styles.title}>NewsGenie</Text>
          <Text style={styles.subtitle}>
            Your personalized AI-powered news companion. Stay informed with bite-sized stories tailored just for you.
          </Text>
        </View>

        <View>
          <TouchableOpacity
            onPress={onGetStarted}
            style={styles.button}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>GET STARTED</Text>
          </TouchableOpacity>

          <Text style={styles.features}>
            Swipe through stories • AI summaries • Multi-language support
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundImage: {
    position: 'absolute',
    width,
    height,
    opacity: 0.3,
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
    justifyContent: 'flex-end',
    paddingHorizontal: 32,
    paddingBottom: 80,
  },
  textContainer: {
    marginBottom: 32,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 30,
  },
  button: {
    backgroundColor: '#2563EB',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
  features: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    textAlign: 'center',
  },
});
