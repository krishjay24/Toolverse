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
  const { colors } = useTheme();
  const typography = createTypography(colors);

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceContainer, borderColor: colors.border }]}>
      <View style={styles.topRow}>
        <Text style={[typography.caption, styles.sponsoredLabel, { color: colors.textSecondary }]}>
          SPONSORED
        </Text>
      </View>
      <View style={styles.body}>
        <View style={[styles.iconWrap, { backgroundColor: colors.primaryLight }]}>
          <Ionicons name="rocket-outline" size={22} color={colors.primary} />
        </View>
        <View style={styles.textWrap}>
          <Text style={[typography.label, { color: colors.textPrimary }]}>Premium Utilities Pro</Text>
          <Text style={[typography.bodySmall, { color: colors.textSecondary }]} numberOfLines={1}>
            Unlock 50+ advanced tools and cloud sync.
          </Text>
        </View>
        <Pressable style={[styles.upgradeBtn, { backgroundColor: colors.primary }]}>
          <Text style={[typography.caption, { color: '#FFFFFF', fontWeight: '700' }]}>Upgrade</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: radius.card,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    width: '100%',
    gap: spacing.xs,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  sponsoredLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontSize: 10,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
    gap: 2,
  },
  upgradeBtn: {
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
});
