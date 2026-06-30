import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme, spacing, createTypography } from '@/theme';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
  showBack?: boolean;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
  /** Extra icon shown on tool pages (e.g. info) */
  infoIcon?: keyof typeof Ionicons.glyphMap;
  onInfoPress?: () => void;
}

export function AppHeader({
  title = 'Toolverse',
  subtitle,
  showLogo = false,
  showBack = false,
  rightIcon = 'person-circle-outline',
  onRightPress,
  infoIcon,
  onInfoPress,
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const typography = createTypography(colors);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/home');
    }
  };

  const handleRightPress = () => {
    if (onRightPress) {
      onRightPress();
      return;
    }
    router.push('/(tabs)/settings');
  };

  if (showBack) {
    return (
      <View
        style={[
          styles.container,
          styles.toolHeader,
          {
            paddingTop: insets.top + spacing.sm,
            backgroundColor: colors.surface,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Pressable onPress={handleBack} style={styles.backButton} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>

        <View style={styles.toolTitleBlock}>
          <Text style={[typography.h3, { color: colors.textPrimary }]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={[typography.caption, { color: colors.textSecondary }]} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        {infoIcon ? (
          <Pressable onPress={onInfoPress} style={styles.iconBtn} hitSlop={8}>
            <Ionicons name={infoIcon} size={22} color={colors.textSecondary} />
          </Pressable>
        ) : (
          <View style={styles.iconSpacer} />
        )}
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        styles.mainHeader,
        {
          paddingTop: insets.top + spacing.sm,
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={styles.brandBlock}>
        <Text style={[styles.brandTitle, { color: colors.primary }]}>Toolverse</Text>
        {subtitle ? (
          <Text style={[typography.caption, { color: colors.textSecondary }]}>{subtitle}</Text>
        ) : null}
      </View>

      <Pressable
        onPress={handleRightPress}
        style={[styles.avatarButton, { backgroundColor: colors.primaryLight, borderColor: colors.border }]}
        hitSlop={8}
      >
        <Ionicons name={rightIcon} size={22} color={colors.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.screen,
    paddingBottom: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  mainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandBlock: {
    flex: 1,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  toolTitleBlock: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSpacer: {
    width: 40,
  },
});
