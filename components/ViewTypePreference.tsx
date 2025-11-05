import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

type ViewType = 'swipe' | 'detail';

interface ViewTypePreferenceProps {
  onComplete: (viewType: ViewType) => void;
  onSkip: () => void;
}

export function ViewTypePreference({ onComplete, onSkip }: ViewTypePreferenceProps) {
  const [selectedView, setSelectedView] = useState<ViewType>('swipe');

  const handleContinue = () => {
    onComplete(selectedView);
  };

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
          <Text style={styles.title}>Choose Your Reading Style</Text>
          <Text style={styles.subtitle}>
            Select how you'd like to consume your news
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            onPress={() => setSelectedView('swipe')}
            style={[
              styles.optionCard,
              selectedView === 'swipe' && styles.optionCardSelected
            ]}
            activeOpacity={0.7}
          >
            <View style={styles.optionIcon}>
              <Ionicons name="phone-portrait" size={48} color={selectedView === 'swipe' ? '#2563EB' : 'rgba(255,255,255,0.6)'} />
            </View>
            <Text style={[
              styles.optionTitle,
              selectedView === 'swipe' && styles.optionTitleSelected
            ]}>
              TikTok-Style Swipe
            </Text>
            <Text style={styles.optionDescription}>
              Immersive full-screen stories with vertical scrolling
            </Text>
            {selectedView === 'swipe' && (
              <View style={styles.selectedBadge}>
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedView('detail')}
            style={[
              styles.optionCard,
              selectedView === 'detail' && styles.optionCardSelected
            ]}
            activeOpacity={0.7}
          >
            <View style={styles.optionIcon}>
              <Ionicons name="newspaper" size={48} color={selectedView === 'detail' ? '#2563EB' : 'rgba(255,255,255,0.6)'} />
            </View>
            <Text style={[
              styles.optionTitle,
              selectedView === 'detail' && styles.optionTitleSelected
            ]}>
              Traditional Detail View
            </Text>
            <Text style={styles.optionDescription}>
              Classic newspaper-style reading with full articles
            </Text>
            {selectedView === 'detail' && (
              <View style={styles.selectedBadge}>
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleContinue}
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
  optionsContainer: {
    flex: 1,
    gap: 20,
  },
  optionCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 24,
    alignItems: 'center',
  },
  optionCardSelected: {
    backgroundColor: 'rgba(37,99,235,0.1)',
    borderColor: '#2563EB',
  },
  optionIcon: {
    marginBottom: 16,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 8,
    textAlign: 'center',
  },
  optionTitleSelected: {
    color: '#ffffff',
  },
  optionDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    lineHeight: 20,
  },
  selectedBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
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
