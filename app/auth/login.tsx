import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppInput } from '@/components/ui/AppInput';
import { ToolverseLogo } from '@/components/brand/ToolverseLogo';
import { useAppStore } from '@/store/useAppStore';
import { useTheme, spacing, createTypography } from '@/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const loginDemo = useAppStore((s) => s.loginDemo);
  const continueAsGuest = useAppStore((s) => s.continueAsGuest);
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const typography = createTypography(colors);

  const goHome = () => router.replace('/(tabs)/home');

  const handleLogin = () => {
    if (!email.trim() || !password) {
      setError('Enter email and password.');
      return;
    }
    const success = loginDemo(email, password);
    if (!success) {
      setError('Invalid credentials. Use the demo account or continue as guest.');
      return;
    }
    setError(null);
    goHome();
  };

  const handleGuest = () => {
    setError(null);
    continueAsGuest();
    goHome();
  };

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.xl },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brandBlock}>
          <ToolverseLogo size={72} />
          <Text style={typography.h1}>Toolverse</Text>
          <Text style={[typography.body, { color: colors.textSecondary }]}>
            One app. Endless utilities.
          </Text>
        </View>

        <AppCard style={styles.formCard}>
          <Text style={typography.h3}>Welcome back</Text>
          <Text style={typography.bodySmall}>
            Sign in with the demo account or continue without an account.
          </Text>

          <AppInput
            label="Email"
            placeholder="demo@toolverse.app"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            error={error ?? undefined}
          />
          <AppInput
            label="Password"
            placeholder="Enter password"
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
          />

          <AppButton title="Login" onPress={handleLogin} fullWidth iconLeft="log-in-outline" />
          <AppButton
            title="Continue as Guest"
            onPress={handleGuest}
            variant="secondary"
            fullWidth
            iconLeft="person-outline"
          />

          <Text style={[typography.caption, styles.helper]}>
            Demo login is optional. You can use all tools without an account.
          </Text>
        </AppCard>

        {/* Google Sign-In can be added later if cloud sync or premium accounts are introduced. */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    paddingHorizontal: spacing.base,
    gap: spacing.xl,
  },
  brandBlock: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  formCard: {
    gap: spacing.base,
  },
  helper: {
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
