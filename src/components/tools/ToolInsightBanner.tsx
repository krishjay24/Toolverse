import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, spacing, createTypography } from '@/theme';

interface ToolInsightBannerProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

export function ToolInsightBanner({ icon, title, description }: ToolInsightBannerProps) {
  const { colors } = useTheme();
  const typography = createTypography(colors);

  return (
    <View style={[styles.banner, { backgroundColor: colors.primaryLight, borderColor: colors.primary + '30' }]}>
      <View style={[styles.iconWrap, { backgroundColor: colors.surface }]}>
        <Ionicons name={icon} size={22} color={colors.primary} />
      </View>
      <View style={styles.textWrap}>
        <Text style={[typography.label, { color: colors.primary }]}>{title}</Text>
        <Text style={typography.bodySmall}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.base,
    borderRadius: 16,
    borderWidth: 1,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: { flex: 1, gap: 2 },
});
