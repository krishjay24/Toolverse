import { Alert, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DashboardAdSlot } from '@/components/dashboard/DashboardAdSlot';
import { ThemeSelector } from '@/components/ui/ThemeSelector';
import { useTabBarInset } from '@/hooks/useTabBarInset';
import { useAppStore } from '@/store/useAppStore';
import { useToolStore } from '@/store/useToolStore';
import {
  createTypography,
  getSemanticAccentColor,
  getSettingsRowAccent,
  getSurfaceCardStyle,
  radius,
  spacing,
  useTheme,
} from '@/theme';

interface SettingsRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  destructive?: boolean;
}

function SettingsRow({ icon, label, value, onPress, destructive }: SettingsRowProps) {
  const { colors, isDark } = useTheme();
  const typography = createTypography(colors);
  const accent = destructive ? 'error' : getSettingsRowAccent(label);
  const iconBackground = getSemanticAccentColor(colors, accent);
  const pressedBackground = colors.surfaceContainer;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.row,
        pressed && onPress ? { backgroundColor: pressedBackground } : undefined,
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.rowLeft}>
        <View style={[styles.rowIcon, { backgroundColor: iconBackground }]}> 
          <Ionicons name={icon} size={18} color="#FFFFFF" />
        </View>
        <Text style={[styles.rowTitle, { color: destructive ? colors.error : colors.textPrimary }]}>
          {label}
        </Text>
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

function SettingsHeader() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const typography = createTypography(colors);
  const buttonBackground = colors.surface;
  const buttonBorder = colors.border;

  return (
    <View style={[styles.header, { backgroundColor: colors.background, paddingTop: insets.top + 8 }]}>
      <Pressable
        onPress={() => router.back()}
        style={({ pressed }) => [
          styles.headerButton,
          {
            backgroundColor: buttonBackground,
            borderColor: buttonBorder,
            shadowOpacity: isDark ? 0 : 0.05,
            elevation: isDark ? 0 : 2,
          },
          pressed && styles.headerPressed,
        ]}
      >
        <Ionicons name="arrow-back" size={21} color={colors.textPrimary} />
      </Pressable>

      <Text style={[typography.h1, styles.headerTitle, { color: colors.textPrimary }]}>Settings</Text>

      <View style={styles.headerSpacer} />
    </View>
  );
}

export function SettingsScreen() {
  const appVersion = useAppStore((s) => s.appVersion);
  const themePreference = useAppStore((s) => s.themePreference);
  const setThemePreference = useAppStore((s) => s.setThemePreference);
  const clearHistory = useToolStore((s) => s.clearHistory);
  const tabBarInset = useTabBarInset();
  const { colors, isDark } = useTheme();
  const typography = createTypography(colors);
  const surfaceCardStyle = getSurfaceCardStyle(colors, isDark);

  const handleClearHistory = () => {
    Alert.alert('Clear history', 'Remove all tool activity from this device?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clearHistory },
    ]);
  };

  const handleShareApp = async () => {
    await Share.share({ message: 'Try Toolverse — one app with endless on-device utilities.' });
  };

  const handleComingSoon = (title: string, message: string) => {
    Alert.alert(title, message);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}> 
      <SettingsHeader />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: tabBarInset + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.section, surfaceCardStyle]}> 
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}> 
              App
            </Text>
          </View>
          <View style={styles.themeSelectorWrap}>
            <ThemeSelector value={themePreference} onChange={setThemePreference} />
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingsRow icon="information-circle-outline" label="App version" value={appVersion} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingsRow icon="trash-outline" label="Clear history" destructive onPress={handleClearHistory} />
        </View>

        <View style={[styles.section, surfaceCardStyle]}> 
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}> 
              Support
            </Text>
          </View>
          <SettingsRow
            icon="star-outline"
            label="Rate Toolverse"
            onPress={() => Alert.alert('Rate Toolverse', 'Play Store link coming before public release.')}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingsRow icon="share-social-outline" label="Share Toolverse" onPress={handleShareApp} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingsRow
            icon="mail-outline"
            label="Send Feedback"
            onPress={() => handleComingSoon('Send Feedback', 'Feedback contact options will be added before public release.')}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingsRow
            icon="bulb-outline"
            label="Suggest a Tool"
            onPress={() => handleComingSoon('Suggest a Tool', 'Tool suggestion intake will be added before public release.')}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingsRow
            icon="warning-outline"
            label="Report an Issue"
            onPress={() => handleComingSoon('Report an Issue', 'Issue reporting options will be added before public release.')}
          />
        </View>

        <View style={[styles.section, surfaceCardStyle]}> 
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}> 
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
            label="Terms & Conditions"
            onPress={() => router.push('/settings/terms')}
          />
        </View>

        <View style={[styles.section, surfaceCardStyle]}> 
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}> 
              About
            </Text>
          </View>
          <SettingsRow
            icon="information-circle-outline"
            label="About Toolverse"
            onPress={() => handleComingSoon('About Toolverse', 'Toolverse is an all-in-one utility app built for fast, on-device everyday tools.')}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingsRow
            icon="code-slash-outline"
            label="Developer"
            onPress={() => handleComingSoon('Developer', 'Developer contact details will be added before public release.')}
          />
        </View>

        <DashboardAdSlot />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    paddingHorizontal: spacing.screen,
    paddingBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  headerPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  headerSpacer: {
    width: 44,
  },
  content: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.base,
    gap: spacing.md,
  },
  section: {
    borderRadius: radius.card,
    borderWidth: 1,
    overflow: 'hidden',
  },
  sectionHeader: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    paddingBottom: spacing.xs,
  },
  sectionLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  themeSelectorWrap: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.base,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: 16,
    minHeight: 68,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  rowIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    flexShrink: 1,
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
