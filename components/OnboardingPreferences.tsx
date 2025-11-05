import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

interface OnboardingPreferencesProps {
  onComplete: (preferences: Record<string, number>) => void;
  onSkip: () => void;
}

const categories = [
  { id: 'politics', label: 'Politics', emoji: '🏛️', color: '#EF4444' },
  { id: 'sports', label: 'Sports', emoji: '⚽', color: '#10B981' },
  { id: 'tech', label: 'Technology', emoji: '💻', color: '#3B82F6' },
  { id: 'entertainment', label: 'Entertainment', emoji: '🎬', color: '#F59E0B' },
  { id: 'business', label: 'Business', emoji: '💼', color: '#8B5CF6' },
  { id: 'health', label: 'Health', emoji: '🏥', color: '#EC4899' },
  { id: 'science', label: 'Science', emoji: '🔬', color: '#06B6D4' },
  { id: 'world', label: 'World', emoji: '🌍', color: '#14B8A6' },
];

export function OnboardingPreferences({ onComplete, onSkip }: OnboardingPreferencesProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleCategory = (categoryId: string) => {
    setSelected(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleContinue = () => {
    if (selected.size > 0) {
      const preferences: Record<string, number> = {};
      selected.forEach(id => {
        preferences[id] = 1;
      });
      onComplete(preferences);
    }
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
          <Text style={styles.title}>Choose Your Interests</Text>
          <Text style={styles.subtitle}>
            Select topics you'd like to stay updated on
          </Text>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.categoriesContainer}
          showsVerticalScrollIndicator={false}
        >
          {categories.map((category) => {
            const isSelected = selected.has(category.id);
            return (
              <TouchableOpacity
                key={category.id}
                onPress={() => toggleCategory(category.id)}
                style={[
                  styles.categoryCard,
                  isSelected && styles.categoryCardSelected
                ]}
                activeOpacity={0.7}
              >
                <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                <Text style={[
                  styles.categoryLabel,
                  isSelected && styles.categoryLabelSelected
                ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.bottomContainer}>
          <TouchableOpacity
            onPress={handleContinue}
            disabled={selected.size === 0}
            style={[
              styles.button,
              selected.size === 0 && styles.buttonDisabled
            ]}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.buttonText,
              selected.size === 0 && styles.buttonTextDisabled
            ]}>
              CONTINUE ({selected.size} selected)
            </Text>
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
    paddingTop: 96,
  },
  header: {
    paddingHorizontal: 32,
    marginBottom: 32,
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
  scrollView: {
    flex: 1,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    margin: 8,
  },
  categoryCardSelected: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: '#ffffff',
  },
  categoryEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  categoryLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
  },
  categoryLabelSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
  bottomContainer: {
    paddingHorizontal: 32,
    paddingTop: 32,
    paddingBottom: 48,
    backgroundColor: '#000000',
  },
  button: {
    backgroundColor: '#2563EB',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
  buttonTextDisabled: {
    color: 'rgba(255,255,255,0.4)',
  },
});
