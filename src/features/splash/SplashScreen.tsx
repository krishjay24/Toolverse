import { Image, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useTheme, createTypography, spacing } from '@/theme';

export function SplashScreen() {
  const { colors } = useTheme();
  const typography = createTypography(colors);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Image
          source={require('../../../assets/splash-icon.png')}
          resizeMode="contain"
          style={styles.logo}
        />
        <Text style={[typography.h1, styles.title, { color: colors.textPrimary }]}>Toolverse</Text>
        <Text style={[typography.bodySmall, styles.tagline, { color: colors.textSecondary }]}>One app. Endless utilities.</Text>
        <ActivityIndicator style={styles.loader} size="small" color={colors.primary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  logo: {
    width: 164,
    height: 164,
  },
  title: {
    marginTop: spacing.xl,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700',
    letterSpacing: -0.6,
    textAlign: 'center',
  },
  tagline: {
    marginTop: spacing.sm,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  loader: {
    marginTop: spacing.xl,
  },
});