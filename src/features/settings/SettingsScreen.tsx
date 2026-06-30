import { Alert, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '@/components/ui/AppHeader';
import { ThemeSelector } from '@/components/ui/ThemeSelector';
import { useTabBarInset } from '@/hooks/useTabBarInset';
import { useAppStore } from '@/store/useAppStore';
import { useToolStore } from '@/store/useToolStore';
import { useTheme, spacing, radius, createTypography } from '@/theme';

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
        {value ? <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>{value}</Text> : null}
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
  const clearHistory = useToolStore((s) => s.clearHistory);
  const tabBarInset = useTabBarInset();
  const { colors } = useTheme();
  const typography = createTypography(colors);

  const handleClearHistory = () => {
    Alert.alert('Clear history', 'Remove all tool activity from this device?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clearHistory },
    ]);
  };

  const handleShareApp = async () => {
    await Share.share({ message: 'Try Toolverse — one app with endless on-device utilities.' });
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <AppHeader showLogo onRightPress={() => {}} />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: tabBarInset + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Page title */}
        <Text style={[typography.h2, { color: colors.textPrimary }]}>Settings</Text>

        {/* Profile card */}
        <View style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.avatarCircle, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="person" size={28} color={colors.primary} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={[typography.label, { color: colors.textPrimary }]}>{getUserLabel()}</Text>
            <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
              All tools available — no account required
            </Text>
          </View>
        </View>

        {/* Appearance */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Text style={[typography.label, { color: colors.textSecondary, textTransform: 'uppercase', fontSize: 11, letterSpacing: 0.8 }]}>
              Appearance
            </Text>
          </View>
          <View style={styles.sectionBody}>
            <ThemeSelector value={themePreference} onChange={setThemePreference} />
          </View>
        </View>

        {/* Legal */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Text style={[typography.label, { color: colors.textSecondary, textTransform: 'uppercase', fontSize: 11, letterSpacing: 0.8 }]}>
              Legal
            </Text>
          </View>
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
        </View>

        {/* About */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Text style={[typography.label, { color: colors.textSecondary, textTransform: 'uppercase', fontSize: 11, letterSpacing: 0.8 }]}>
              About
            </Text>
          </View>
          <SettingsRow
            icon="star-outline"
            label="Rate on Play Store"
            onPress={() => Alert.alert('Rate Toolverse', 'Play Store link coming before public release.')}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingsRow icon="share-social-outline" label="Share App" onPress={handleShareApp} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingsRow icon="information-circle-outline" label="Version" value={appVersion} />
        </View>

        {/* Danger zone */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <SettingsRow
            icon="trash-outline"
            label="Clear history"
            destructive
            onPress={handleClearHistory}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.base,
    gap: spacing.base,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    padding: spacing.base,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  section: {
    borderRadius: radius.card,
    borderWidth: 1,
    overflow: 'hidden',
  },
  sectionHeader: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  sectionBody: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.base,
  },
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
    borderRadius: 10,
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
