import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ToolverseLogo } from '@/components/brand/ToolverseLogo';
import { useTheme, spacing, createTypography } from '@/theme';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
  showBack?: boolean;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
}

export function AppHeader({
  title = 'Toolverse',
  subtitle,
  showLogo = false,
  showBack = false,
  rightIcon = 'settings-outline',
  onRightPress,
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

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + spacing.sm, backgroundColor: colors.background },
      ]}
    >
      <View style={styles.row}>
        {showBack ? (
          <Pressable onPress={handleBack} style={styles.backButton} hitSlop={8}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </Pressable>
        ) : null}

        <View style={styles.titleBlock}>
          {showLogo ? (
            <View style={styles.logoRow}>
              <ToolverseLogo size={44} />
              <View style={styles.logoText}>
                <Text style={typography.h2}>{title}</Text>
                {subtitle ? <Text style={typography.bodySmall}>{subtitle}</Text> : null}
              </View>
            </View>
          ) : (
            <>
              <Text style={typography.h2}>{title}</Text>
              {subtitle ? <Text style={typography.bodySmall}>{subtitle}</Text> : null}
            </>
          )}
        </View>

        {!showBack ? (
          <Pressable
            onPress={handleRightPress}
            style={[styles.iconButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            hitSlop={8}
          >
            <Ionicons name={rightIcon} size={22} color={colors.textPrimary} />
          </Pressable>
        ) : (
          <View style={styles.iconSpacer} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.base,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleBlock: {
    flex: 1,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  logoText: {
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  iconSpacer: {
    width: 40,
  },
});
