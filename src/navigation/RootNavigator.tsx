import React, { useEffect, useState } from 'react';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { OnboardingNavigator } from './OnboardingNavigator';
import { MainNavigator } from './MainNavigator';
import { useUserStore } from '../stores/useUserStore';
import { View, ActivityIndicator } from 'react-native';

export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { isOnboardingCompleted, loadUserData } = useUserStore();

  useEffect(() => {
    const init = async () => {
      await loadUserData();
      setIsLoading(false);
    };

    init();
  }, [loadUserData]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isOnboardingCompleted ? (
            <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
          ) : (
            <Stack.Screen name="Main" component={MainNavigator} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
};
