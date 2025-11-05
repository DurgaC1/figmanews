import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

interface PreferencesSavedProps {
  onRefine: () => void;
  onPreview: () => void;
  onFinish: () => void;
  onSkip: () => void;
}

export function PreferencesSaved({ onRefine, onPreview, onFinish, onSkip }: PreferencesSavedProps) {
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
        <View style={styles.center}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>✓</Text>
          </View>
          
          <Text style={styles.title}>Preferences Saved!</Text>
          <Text style={styles.subtitle}>
            Your personalized feed is ready. You can always adjust your preferences later in settings.
          </Text>
        </View>

        <View style={styles.buttonsContainer}>
          <View style={styles.rowButtons}>
            <TouchableOpacity
              onPress={onRefine}
              style={[styles.button, styles.buttonOutline]}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonTextOutline}>Refine</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onPreview}
              style={[styles.button, styles.buttonOutline]}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonTextOutline}>Preview</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={onFinish}
            style={[styles.button, styles.buttonPrimary]}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>CONTINUE</Text>
          </TouchableOpacity>
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
    justifyContent: 'space-between',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  icon: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  buttonsContainer: {
    gap: 12,
  },
  rowButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonOutline: {
    flex: 1,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  buttonPrimary: {
    backgroundColor: '#2563EB',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
  buttonTextOutline: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
