import { Redirect } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { ToolverseLogo } from '@/components/brand/ToolverseLogo';
import { useAppStore } from '@/store/useAppStore';
import { useTheme } from '@/theme';

export default function Index() {
  const hasSession = useAppStore((s) => s.hasSession);
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ToolverseLogo size={64} />
      <Redirect href={hasSession ? '/(tabs)/home' : '/auth/login'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
