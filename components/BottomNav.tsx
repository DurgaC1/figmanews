import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'explore', label: 'Explore', icon: 'compass' },
  { id: 'saved', label: 'Saved', icon: 'bookmark' },
  { id: 'profile', label: 'Profile', icon: 'person' },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <View style={styles.container}>
      <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => onTabChange(tab.id)}
                style={styles.tab}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={isActive ? tab.icon as any : `${tab.icon}-outline` as any}
                  size={24}
                  color={isActive ? '#60A5FA' : 'rgba(255,255,255,0.6)'}
                />
                <Text style={[
                  styles.tabLabel,
                  isActive && styles.tabLabelActive
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 40,
  },
  blurContainer: {
    overflow: 'hidden',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },
  tab: {
    alignItems: 'center',
    gap: 4,
    minWidth: 60,
  },
  tabLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  tabLabelActive: {
    color: '#60A5FA',
    fontWeight: '600',
  },
});
