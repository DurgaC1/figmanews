import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
// Initialize Reanimated early (after React but before components)
import '../src/utils/reanimatedSetup';
import { RootNavigator } from '../src/navigation/RootNavigator';
import { useUserStore } from '../src/stores/useUserStore';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const { loadUserData } = useUserStore();

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

  // Render React Navigation navigator inside expo-router
  // This allows us to use React Navigation for app navigation while using expo-router for setup
  return <RootNavigator />;
}
