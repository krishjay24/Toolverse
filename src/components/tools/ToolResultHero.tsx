import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppCard } from '@/components/ui/AppCard';
import { useTheme, spacing, createTypography } from '@/theme';

interface ToolResultHeroProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function ToolResultHero({ icon, label, value, subtitle, children }: ToolResultHeroProps) {
  const { colors } = useTheme();
  const typography = createTypography(colors);

  return (
    <AppCard style={styles.card}>
      <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
        <Ionicons name={icon} size={28} color={colors.primary} />
      </View>
      <Text style={typography.bodySmall}>{label}</Text>
      <Text style={[typography.h1, { color: colors.primary }]}>{value}</Text>
      {subtitle ? <Text style={typography.bodySmall}>{subtitle}</Text> : null}
      {children}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: 'center', gap: spacing.sm },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
