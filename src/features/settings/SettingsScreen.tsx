import { Alert, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '@/components/ui/AppButton';
import { AppHeader } from '@/components/ui/AppHeader';
import { AppCard } from '@/components/ui/AppCard';
import { ThemeSelector } from '@/components/ui/ThemeSelector';
import { ToolverseLogo } from '@/components/brand/ToolverseLogo';
import { useTabBarInset } from '@/hooks/useTabBarInset';
import { useAppStore } from '@/store/useAppStore';
import { useToolStore } from '@/store/useToolStore';
import { useTheme, spacing, createTypography } from '@/theme';

interface SettingsRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  destructive?: boolean;
}

function SettingsRow({ icon, label, value, onPress, destructive }: SettingsRowProps) {
  const { colors } = useTheme();
  const typography = createTypography(colors);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.row,
        pressed && onPress ? { backgroundColor: colors.background } : undefined,
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.rowLeft}>
        <View
          style={[
            styles.rowIcon,
            { backgroundColor: destructive ? colors.errorLight : colors.primaryLight },
          ]}
        >
          <Ionicons
            name={icon}
            size={18}
            color={destructive ? colors.error : colors.primary}
          />
        </View>
        <Text style={[typography.body, destructive && { color: colors.error }]}>{label}</Text>
      </View>
      <View style={styles.rowRight}>
        {value ? <Text style={typography.bodySmall}>{value}</Text> : null}
        {onPress ? (
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        ) : null}
      </View>
    </Pressable>
  );
}

export function SettingsScreen() {
  const appVersion = useAppStore((s) => s.appVersion);
  const themePreference = useAppStore((s) => s.themePreference);
  const setThemePreference = useAppStore((s) => s.setThemePreference);
  const getUserLabel = useAppStore((s) => s.getUserLabel);
  const userEmail = useAppStore((s) => s.userEmail);
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);
  const logout = useAppStore((s) => s.logout);
  const clearHistory = useToolStore((s) => s.clearHistory);
  const tabBarInset = useTabBarInset();
  const { colors } = useTheme();
  const typography = createTypography(colors);

  const handleLogout = () => {
    Alert.alert('Reset session', 'Return to the welcome screen?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/auth/login');
        },
      },
    ]);
  };

  const handleClearHistory = () => {
    Alert.alert('Clear history', 'Remove all tool activity from this device?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clearHistory },
    ]);
  };

  const handleShareApp = async () => {
    await Share.share({
      message: 'Try Toolverse — one app with endless on-device utilities.',
    });
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <AppHeader title="Settings" subtitle="Preferences & about" />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: tabBarInset + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <AppCard style={styles.brandCard}>
          <ToolverseLogo size={56} />
          <Text style={typography.h2}>Toolverse</Text>
          <Text style={typography.bodySmall}>One app. Endless utilities.</Text>
        </AppCard>

        <AppCard style={styles.userCard}>
          <Text style={typography.label}>Signed in as</Text>
          <Text style={typography.h3}>{getUserLabel()}</Text>
          {isLoggedIn && userEmail ? (
            <Text style={typography.bodySmall}>{userEmail}</Text>
          ) : (
            <Text style={typography.bodySmall}>Guest mode — all tools are available.</Text>
          )}
        </AppCard>
        <AppButton title="Logout / Reset session" onPress={handleLogout} variant="danger" fullWidth />

        <AppCard style={styles.themeCard}>
          <Text style={typography.label}>Appearance</Text>
          <ThemeSelector value={themePreference} onChange={setThemePreference} />
        </AppCard>

        <AppCard padded={false}>
          <SettingsRow
            icon="shield-checkmark-outline"
            label="Privacy Policy"
            onPress={() => router.push('/settings/privacy-policy')}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingsRow
            icon="document-text-outline"
            label="Terms of Service"
            onPress={() => router.push('/settings/terms')}
          />
        </AppCard>

        <AppCard padded={false}>
          <SettingsRow
            icon="star-outline"
            label="Rate on Play Store"
            onPress={() =>
              Alert.alert('Rate Toolverse', 'Play Store link will be added before public release.')
            }
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingsRow icon="share-social-outline" label="Share App" onPress={handleShareApp} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingsRow icon="information-circle-outline" label="Version" value={appVersion} />
        </AppCard>

        <AppCard padded={false}>
          <SettingsRow
            icon="trash-outline"
            label="Clear history"
            destructive
            onPress={handleClearHistory}
          />
        </AppCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    paddingHorizontal: spacing.base,
    gap: spacing.base,
  },
  brandCard: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xl,
  },
  userCard: { gap: spacing.sm },
  themeCard: { gap: spacing.md },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: spacing.base,
  },
});
