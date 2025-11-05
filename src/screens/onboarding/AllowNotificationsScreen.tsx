import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import type { OnboardingStackParamList } from '../../navigation/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { useUserStore } from '../../stores/useUserStore';

const { width } = Dimensions.get('window');

type AllowNotificationsScreenProps = {
  navigation: StackNavigationProp<OnboardingStackParamList, 'AllowNotifications'>;
};

export const AllowNotificationsScreen: React.FC<AllowNotificationsScreenProps> = ({ navigation }) => {
  const [showCategories, setShowCategories] = useState(false);
  const insets = useSafeAreaInsets();
  const { updatePreferences, preferences, setOnboardingCompleted } = useUserStore();

  const requestNotificationPermission = async () => {
    try {
      if (!Device.isDevice) {
        Alert.alert('Error', 'Push notifications only work on physical devices');
        return false;
      }

      // Request permission
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        return false;
      }

      // Get push token
      const token = await Notifications.getExpoPushTokenAsync();
      console.log('Push token:', token.data);

      // TODO: Register device with backend
      // await apiClient.post(`/users/${userId}/devices:register`, {
      //   token: token.data,
      //   platform: Platform.OS,
      // });

      // Subscribe to notification topics based on preferences
      const highPriorityCategories = preferences.categoryWeights
        ?.filter(w => (w.normalized || 0) >= 0.6)
        .map(w => w.category) || [];

      console.log('Subscribing to categories:', highPriorityCategories);

      return true;
    } catch (error) {
      console.error('Failed to get push token:', error);
      return false;
    }
  };

  const handleAllowNotifications = async () => {
    const granted = await requestNotificationPermission();
    
    if (granted) {
      await updatePreferences({ notificationsEnabled: true });
      await completeOnboarding();
    } else {
      Alert.alert(
        'Notifications Disabled',
        'You can enable notifications anytime in Settings.',
        [
          {
            text: 'OK',
            onPress: () => handleNotNow(),
          },
        ]
      );
    }
  };

  const handleNotNow = async () => {
    await updatePreferences({ notificationsEnabled: false });
    await completeOnboarding();
  };

  const completeOnboarding = async () => {
    await setOnboardingCompleted(true);
    // RootNavigator will handle navigation to main app
  };

  const handleSkip = () => {
    handleNotNow();
  };

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
  });

  // Get high-priority categories for display
  const highPriorityCategories = preferences.categoryWeights
    ?.filter(w => (w.normalized || 0) >= 0.6)
    .map(w => w.category.charAt(0).toUpperCase() + w.category.slice(1)) || [];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Gradient Background */}
      <LinearGradient
        colors={['#0A0A1F', '#1E1E3F', '#0A0A1F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />

      {/* Top bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.time}>{currentTime}</Text>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="notifications" size={60} color="#3B82F6" />
          </View>
        </View>

        {/* Title and Subtext */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Stay in the loop</Text>
          <Text style={styles.subtitle}>
            Get breaking updates and stories you care about.
          </Text>

          {/* Category Preview */}
          {highPriorityCategories.length > 0 && (
            <View style={styles.categoryPreview}>
              <Text style={styles.categoryPreviewLabel}>
                Based on your preferences:
              </Text>
              <View style={styles.categoryTags}>
                {highPriorityCategories.map((category) => (
                  <View key={category} style={styles.categoryTag}>
                    <Text style={styles.categoryTagText}>{category}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Manage Categories Link */}
          <TouchableOpacity
            onPress={() => setShowCategories(!showCategories)}
            style={styles.manageCategoriesButton}
          >
            <Text style={styles.manageCategoriesText}>
              Manage Categories
            </Text>
            <Ionicons
              name={showCategories ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="#3B82F6"
            />
          </TouchableOpacity>

          {showCategories && (
            <View style={styles.categoriesSheet}>
              <Text style={styles.categoriesSheetText}>
                You'll receive notifications for stories marked as "More" during onboarding.
                You can customize this anytime in Settings.
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + 20 }]}>
          <TouchableOpacity
            style={styles.allowButton}
            onPress={handleAllowNotifications}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#3B82F6', '#2563EB']}
              style={styles.allowGradient}
            >
              <Ionicons name="notifications" size={22} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.allowButtonText}>Allow Notifications</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.notNowButton}
            onPress={handleNotNow}
            activeOpacity={0.8}
          >
            <Text style={styles.notNowButtonText}>Not Now</Text>
          </TouchableOpacity>
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
    height: '100%',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 8,
    zIndex: 10,
  },
  time: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  skipText: {
    fontSize: 17,
    color: '#FFFFFF',
    fontWeight: '400',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 80,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: 24,
  },
  categoryPreview: {
    marginTop: 24,
    padding: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  categoryPreviewLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 12,
    textAlign: 'center',
  },
  categoryTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  categoryTag: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.4)',
  },
  categoryTagText: {
    fontSize: 13,
    color: '#3B82F6',
    fontWeight: '600',
  },
  manageCategoriesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 12,
    gap: 6,
  },
  manageCategoriesText: {
    fontSize: 15,
    color: '#3B82F6',
    fontWeight: '500',
  },
  categoriesSheet: {
    marginTop: 12,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
  },
  categoriesSheetText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 12,
  },
  allowButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  allowGradient: {
    flexDirection: 'row',
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  allowButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  notNowButton: {
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  notNowButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
});
