import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ToolverseLogo } from '@/components/brand/ToolverseLogo';
import { createTypography, radius, spacing, useTheme } from '@/theme';

interface DashboardHeaderProps {
  onSettingsPress: () => void;
  onThemeToggle: () => void;
}

function DashboardHeaderComponent({ onSettingsPress, onThemeToggle }: DashboardHeaderProps) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const headerBackground = colors.background;
  const buttonBackground = colors.surface;
  const buttonBorder = colors.border;

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 8,
          backgroundColor: headerBackground,
        },
      ]}
    >
      <View style={styles.brandBlock}>
        <View style={styles.logoContainer}>
          <ToolverseLogo size={45} />
        </View>
        <Text style={[styles.brandTitle, { color: colors.textPrimary }]}>Toolverse</Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          onPress={onThemeToggle}
          hitSlop={8}
          style={({ pressed }) => [
            styles.actionButton,
            {
              backgroundColor: buttonBackground,
              borderColor: buttonBorder,
              shadowOpacity: isDark ? 0 : 0.05,
              elevation: isDark ? 0 : 2,
            },
            pressed && styles.pressed,
          ]}
        >
          <Ionicons
            name={isDark ? 'sunny-outline' : 'moon-outline'}
            size={20}
            color={colors.primary}
          />
        </Pressable>
        <Pressable
          onPress={onSettingsPress}
          hitSlop={8}
          style={({ pressed }) => [
            styles.actionButton,
            {
              backgroundColor: buttonBackground,
              borderColor: buttonBorder,
              shadowOpacity: isDark ? 0 : 0.05,
              elevation: isDark ? 0 : 2,
            },
            pressed && styles.pressed,
          ]}
        >
          <Ionicons name="settings-outline" size={20} color={colors.primary} />
        </Pressable>
      </View>
    </View>
  );
}

export const DashboardHeader = memo(DashboardHeaderComponent);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.screen,
    paddingBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.icon,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  brandTitle: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: radius.button,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
});