import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';

const { width, height } = Dimensions.get('window');

interface NotificationsPermissionProps {
  onAllow: () => void;
  onSkip: () => void;
  userPreferences: Record<string, number>;
}

export function NotificationsPermission({ onAllow, onSkip, userPreferences }: NotificationsPermissionProps) {
  
  const handleAllow = async () => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus === 'granted') {
        Alert.alert('Success', 'Notifications enabled! You\'ll receive updates about stories you care about.');
        onAllow();
      } else {
        Alert.alert('Permission Denied', 'You can enable notifications later in settings.');
        onSkip();
      }
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      Alert.alert('Error', 'Failed to request notification permissions.');
      onSkip();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <LinearGradient
        colors={['#000000', '#0A0A1A', '#000000']}
        style={styles.gradient}
      />

      <View style={styles.content}>
        <View style={styles.center}>
          <View style={styles.iconContainer}>
            <Ionicons name="notifications" size={60} color="#ffffff" />
          </View>
          
          <Text style={styles.title}>Stay Updated</Text>
          <Text style={styles.subtitle}>
            Get notified about breaking news and stories that match your interests
          </Text>

          <View style={styles.featuresContainer}>
            <View style={styles.featureRow}>
              <Ionicons name="flash" size={24} color="#2563EB" />
              <Text style={styles.featureText}>Breaking news alerts</Text>
            </View>
            <View style={styles.featureRow}>
              <Ionicons name="heart" size={24} color="#2563EB" />
              <Text style={styles.featureText}>Personalized story suggestions</Text>
            </View>
            <View style={styles.featureRow}>
              <Ionicons name="time" size={24} color="#2563EB" />
              <Text style={styles.featureText}>Daily news digest</Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            onPress={handleAllow}
            style={[styles.button, styles.buttonPrimary]}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>ALLOW NOTIFICATIONS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onSkip}
            style={[styles.button, styles.buttonOutline]}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonTextOutline}>Maybe Later</Text>
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
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(37,99,235,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
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
    marginBottom: 40,
  },
  featuresContainer: {
    gap: 20,
    width: '100%',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  featureText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  buttonsContainer: {
    gap: 12,
  },
  button: {
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#2563EB',
  },
  buttonOutline: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'transparent',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
  buttonTextOutline: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
    fontWeight: '600',
  },
});
