import { StyleSheet, Text, View } from 'react-native';
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
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[typography.caption, styles.label]}>Advertisement</Text>
      <Text style={typography.caption}>Banner ad space</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: radius.card,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
    width: '100%',
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.xs,
  },
});
