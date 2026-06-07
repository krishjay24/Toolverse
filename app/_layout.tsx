import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initializeAdMob } from '@/features/ads/interstitialAd';
import { ThemeProvider, useTheme } from '@/theme';

// AdMob: initializeAdMob() is a no-op in Expo Go (placeholders only).
// Native dev/release builds load the real SDK via dynamic import in interstitialAd.ts.

function RootStack() {
  const { isDark } = useTheme();

  useEffect(() => {
    initializeAdMob();
  }, []);

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="tools/qr-generator" />
        <Stack.Screen name="tools/qr-scanner" />
        <Stack.Screen name="tools/image-compressor" />
        <Stack.Screen name="tools/image-resizer" />
        <Stack.Screen name="tools/age-calculator" />
        <Stack.Screen name="tools/emi-calculator" />
        <Stack.Screen name="tools/gst-calculator" />
        <Stack.Screen name="tools/bmi-calculator" />
        <Stack.Screen name="tools/percentage-calculator" />
        <Stack.Screen name="tools/password-generator" />
        <Stack.Screen name="tools/unit-converter" />
        <Stack.Screen name="tools/text-counter" />
        <Stack.Screen name="settings/privacy-policy" />
        <Stack.Screen name="settings/terms" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <RootStack />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
