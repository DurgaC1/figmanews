import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const categories = [
  { id: 'all', label: 'All', emoji: '📰' },
  { id: 'politics', label: 'Politics', emoji: '🏛️' },
  { id: 'sports', label: 'Sports', emoji: '⚽' },
  { id: 'tech', label: 'Tech', emoji: '💻' },
  { id: 'entertainment', label: 'Entertainment', emoji: '🎬' },
  { id: 'business', label: 'Business', emoji: '💼' },
];

export function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <View style={styles.container}>
      <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {categories.map((category) => {
            const isSelected = selectedCategory === category.id;
            return (
              <TouchableOpacity
                key={category.id}
                onPress={() => onSelectCategory(category.id)}
                style={[
                  styles.categoryButton,
                  isSelected && styles.categoryButtonActive
                ]}
                activeOpacity={0.7}
              >
                <Text style={styles.emoji}>{category.emoji}</Text>
                <Text style={[
                  styles.categoryLabel,
                  isSelected && styles.categoryLabelActive
                ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 40,
    paddingTop: 48,
  },
  blurContainer: {
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    gap: 6,
  },
  categoryButtonActive: {
    backgroundColor: '#2563EB',
  },
  emoji: {
    fontSize: 16,
  },
  categoryLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontWeight: '500',
  },
  categoryLabelActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
