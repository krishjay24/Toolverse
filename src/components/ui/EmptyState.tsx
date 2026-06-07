import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from './AppButton';
import { useTheme, spacing, createTypography } from '@/theme';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  actionTitle?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionTitle,
  onAction,
}: EmptyStateProps) {
  const { colors } = useTheme();
  const typography = createTypography(colors);

  return (
    <View style={styles.container}>
      <View style={[styles.iconWrap, { backgroundColor: colors.primaryLight }]}>
        <Ionicons name={icon} size={28} color={colors.primary} />
      </View>
      <Text style={[typography.h3, styles.title]}>{title}</Text>
      <Text style={[typography.bodySmall, styles.description]}>{description}</Text>
      {actionTitle && onAction ? (
        <AppButton title={actionTitle} onPress={onAction} variant="secondary" />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['2xl'],
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
  },
});
