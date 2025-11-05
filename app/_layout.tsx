import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../src/config/queryClient";
import { databaseService } from "../src/services/storage/database";
import { audioManager } from "../src/services/audio/audioManager";
import "../styles/globals.css";

export default function RootLayout() {
  useEffect(() => {
    const initServices = async () => {
      try {
        // Initialize database (may fail in Expo Go - that's expected)
        await databaseService.init();
      } catch (error: any) {
        // SQLite not available in Expo Go - silently handle
        // The database service already handles this gracefully, so we just suppress here
        const isExpoGoError =
          error?.message?.includes("ExpoSQLiteNext") ||
          error?.message?.includes("native module") ||
          error?.message?.includes("Cannot find native module");

        if (!isExpoGoError && __DEV__) {
          // Only log unexpected database errors
          console.warn("Database initialization error:", error);
        }
      }

      try {
        // Initialize audio
        await audioManager.init();
      } catch (error) {
        // Audio initialization failed - non-critical
        if (__DEV__) {
          console.warn("Audio initialization skipped:", error);
        }
      }

      try {
        // Clear expired cache on app start (only if DB is available)
        await databaseService.clearExpiredCache();
      } catch (error) {
        // Cache cleanup failed - non-critical, expected in Expo Go
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
          <Stack screenOptions={{ headerShown: false }} />
        </QueryClientProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
