import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClientProvider } from "@tanstack/react-query";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { queryClient } from "./src/config/queryClient";
import { databaseService } from "./src/services/storage/database";
import { audioManager } from "./src/services/audio/audioManager";
import "./global.css";

export default function App() {
  useEffect(() => {
    const initServices = async () => {
      try {
        // Initialize database
        await databaseService.init();

        // Initialize audio
        await audioManager.init();

        // Clear expired cache on app start
        await databaseService.clearExpiredCache();
      } catch (error) {
        console.error("Failed to initialize services:", error);
      }
    };

    initServices();

    // Cleanup on unmount
    return () => {
      audioManager.cleanup();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryClientProvider client={queryClient}>
          <RootNavigator />
        </QueryClientProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}