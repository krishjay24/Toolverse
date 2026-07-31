import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, spacing, radius, createTypography } from '@/theme';

/**
 * Visual placeholder for banner ad space.
 *
 * EXPO GO: Always shown — native AdMob SDK is not available.
 * NATIVE BUILD: Shown only when the banner fails to load; otherwise BannerAdBox renders real ads.
 */
export function AdPlaceholder() {
  const { colors, isDark } = useTheme();
  const typography = createTypography(colors);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowOpacity: isDark ? 0 : 0.05,
          shadowRadius: isDark ? 0 : 8,
          elevation: isDark ? 0 : 2,
        },
      ]}
    >
      <View style={styles.body}>
        <View style={[styles.iconWrap, { backgroundColor: colors.surfaceContainer }]}> 
          <Ionicons name="megaphone-outline" size={20} color={colors.primary} />
        </View>
        <View style={styles.textWrap}>
          <Text style={[typography.label, { color: colors.textPrimary }]}>Ad space</Text>
          <Text style={[typography.bodySmall, { color: colors.textSecondary }]} numberOfLines={1}>
            A real banner ad will appear in native builds.
          </Text>
        </View>
        <View style={[styles.badge, { borderColor: colors.border }]}> 
          <Text style={[typography.caption, { color: colors.textSecondary, fontWeight: '700' }]}>AD</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: radius.card,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.icon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
    gap: 2,
  },
  badge: {
    borderRadius: radius.full,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
});
