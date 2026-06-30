import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppHeader } from '@/components/ui/AppHeader';
import { useTheme, spacing, createTypography } from '@/theme';

const SECTIONS = [
  {
    title: 'Overview',
    body: 'Toolverse is a local utility app. All tools run on your device. No account is required to use the app.',
  },
  {
    title: 'Information we collect',
    body: 'Toolverse does not directly collect personal account data. Tool usage history is stored locally on your device and can be cleared anytime from Settings.',
  },
  {
    title: 'Permissions',
    body: 'Camera access is used only for QR scanning. Photo and media access is used only when you choose images for compression or resizing. Permissions can be revoked in Android settings.',
  },
  {
    title: 'Advertising',
    body: 'Toolverse may use Google AdMob for advertisements in production builds. During development, placeholder ads are shown. Some third-party ad services may collect ad-related data when ads are enabled in production.',
  },
  {
    title: 'Third-party services',
    body: 'When you share content or open links from scan results, those actions use your device\'s standard share and browser features outside Toolverse.',
  },
  {
    title: 'Contact',
    body: 'For privacy questions about Toolverse, contact the developer through the Play Store listing before public release.',
  },
];

export function PrivacyPolicyScreen() {
  const { colors } = useTheme();
  const typography = createTypography(colors);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <AppHeader title="Privacy Policy" showBack />
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
