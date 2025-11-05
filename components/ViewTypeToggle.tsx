import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

interface ViewTypeToggleProps {
  viewType: 'swipe' | 'detail';
  onToggle: () => void;
}

export function ViewTypeToggle({ viewType, onToggle }: ViewTypeToggleProps) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      style={styles.container}
      activeOpacity={0.7}
    >
      <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
        <Ionicons
          name={viewType === 'swipe' ? 'newspaper' : 'phone-portrait'}
          size={20}
          color="#ffffff"
        />
      </BlurView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 80,
    right: 20,
    zIndex: 50,
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  blurContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
