import { Stack } from 'expo-router';

export default function TabLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="tools" />
      <Stack.Screen name="history" />
    </Stack>
  );
}
