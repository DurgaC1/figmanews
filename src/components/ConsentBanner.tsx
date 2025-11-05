import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '../stores/useUserStore';

interface ConsentBannerProps {
  onDismiss?: () => void;
}

export const ConsentBanner: React.FC<ConsentBannerProps> = ({ onDismiss }) => {
  const [visible, setVisible] = useState(false);
  const slideAnim = new Animated.Value(-100);
  const { preferences, updatePreferences } = useUserStore();

  useEffect(() => {
    // Show banner only if consent hasn't been set yet
    if (preferences.consentPersonalization === undefined) {
      setVisible(true);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    }
  }, [preferences.consentPersonalization]);

  const handleAccept = async () => {
    await updatePreferences({ consentPersonalization: true });
    dismissBanner();
  };

  const handleDismiss = async () => {
    await updatePreferences({ consentPersonalization: false });
    dismissBanner();
  };

  const dismissBanner = () => {
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      if (onDismiss) onDismiss();
    });
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="settings-outline" size={20} color="#2563EB" />
        </View>
        <Text style={styles.text}>
          We use preferences & usage to personalize your feed. Manage in Settings.
        </Text>
        <TouchableOpacity onPress={handleDismiss} style={styles.closeButton}>
          <Ionicons name="close" size={20} color="rgba(255, 255, 255, 0.6)" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={handleAccept} style={styles.acceptButton}>
        <Text style={styles.acceptText}>Got it</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(37, 99, 235, 0.3)',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    zIndex: 1000,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(37, 99, 235, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  text: {
    flex: 1,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 18,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
  acceptButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  acceptText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
