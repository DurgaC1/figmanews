import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { WelcomeScreen } from '../screens/onboarding/WelcomeScreen';
import { IntroScreen } from '../screens/onboarding/IntroScreen';
import { CustomizeFeedIntroScreen } from '../screens/onboarding/CustomizeFeedIntroScreen';
import { ViewTypeSelectScreen } from '../screens/onboarding/ViewTypeSelectScreen';
import { StoryPreferenceCardsScreen } from '../screens/onboarding/StoryPreferenceCardsScreen';
import { PreferencesSavedScreen } from '../screens/onboarding/PreferencesSavedScreen';
import { AllowNotificationsScreen } from '../screens/onboarding/AllowNotificationsScreen';
import type { OnboardingStackParamList } from './types';

// Define navigation types
// types moved to src/navigation/types.ts to avoid circular imports

const Stack = createStackNavigator<OnboardingStackParamList>();

export const OnboardingNavigator = () => {
  if (__DEV__) {
    // Sanity check to ensure screens are defined at runtime
    // If any of these are undefined, navigation will crash with "Element type is invalid"
    // eslint-disable-next-line no-console
    console.log('[OnboardingNavigator] screens:', {
      IntroScreen: typeof IntroScreen,
      CustomizeFeedIntroScreen: typeof CustomizeFeedIntroScreen,
      ViewTypeSelectScreen: typeof ViewTypeSelectScreen,
      StoryPreferenceCardsScreen: typeof StoryPreferenceCardsScreen,
      PreferencesSavedScreen: typeof PreferencesSavedScreen,
      AllowNotificationsScreen: typeof AllowNotificationsScreen,
      WelcomeScreen: typeof WelcomeScreen,
    });
  }
  return (
    <Stack.Navigator
      initialRouteName="Intro"
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        animationEnabled: true,
        cardStyle: { backgroundColor: 'transparent' },
      }}
    >
      {/* Authentication Intro */}
      <Stack.Screen name="Intro" component={IntroScreen} />
      
      {/* Onboarding Flow: S0 → ViewType → S1-S5 → S6 → S7 */}
      <Stack.Screen name="CustomizeFeedIntro" component={CustomizeFeedIntroScreen} />
      <Stack.Screen name="ViewTypeSelect" component={ViewTypeSelectScreen} />
      <Stack.Screen name="StoryPreferenceCards" component={StoryPreferenceCardsScreen} />
      <Stack.Screen name="PreferencesSaved" component={PreferencesSavedScreen} />
      <Stack.Screen name="AllowNotifications" component={AllowNotificationsScreen} />
      
      {/* Legacy screens (can be removed or refactored) */}
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
    </Stack.Navigator>
  );
};
