import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppHeader } from '@/components/ui/AppHeader';
import { useTheme, spacing, createTypography } from '@/theme';

const SECTIONS = [
  {
    title: 'Acceptance',
    body: 'By using Toolverse, you agree to these terms. If you do not agree, please uninstall the app.',
  },
  {
    title: 'Service description',
    body: 'Toolverse provides on-device utility tools including QR generation, scanning, image tools, calculators, and converters. Features may change between app updates.',
  },
  {
    title: 'Use responsibly',
    body: 'Use Toolverse tools responsibly. Do not use generated QR codes, passwords, or scanned content for unlawful purposes.',
  },
  {
    title: 'No warranty',
    body: 'Calculators and converters are for guidance only. Toolverse provides no warranty for financial, health, or legal decisions. Always verify important results independently.',
  },
  {
    title: 'User responsibility',
    body: 'You are responsible for how you use generated QR codes, passwords, compressed images, and scanned content.',
  },
  {
    title: 'Advertising',
    body: 'Future versions may include AdMob banner and interstitial ads. Ad content is served by Google and subject to Google\'s policies.',
  },
  {
    title: 'Changes',
    body: 'These terms may be updated when Toolverse is updated on the Play Store. Continued use after updates constitutes acceptance of revised terms.',
  },
];

export function TermsScreen() {
  const { colors } = useTheme();
  const typography = createTypography(colors);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <AppHeader title="Terms of Service" showBack />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={typography.bodySmall}>Last updated: June 2026</Text>
        {SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={typography.h3}>{section.title}</Text>
            <Text style={typography.body}>{section.body}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    padding: spacing.base,
    paddingBottom: spacing['3xl'],
    gap: spacing.lg,
  },
  section: { gap: spacing.sm },
});
