import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, spacing, radius, createTypography } from '@/theme';
import { CATEGORY_LABELS, ToolCategory, ToolIconName } from '@/types/tool';

interface ToolCardProps {
  title: string;
  description: string;
  icon: ToolIconName;
  category: ToolCategory;
  onPress: () => void;
  compact?: boolean;
}

export function ToolCard({
  title,
  description,
  icon,
  category,
  onPress,
  compact = false,
}: ToolCardProps) {
  const { colors } = useTheme();
  const typography = createTypography(colors);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          minHeight: compact ? 108 : 120,
        },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: colors.primaryLight }]}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>

      <View style={styles.body}>
        <Text style={[typography.label, styles.title]} numberOfLines={1}>
          {title}
        </Text>
        <Text style={[typography.bodySmall, styles.description]} numberOfLines={compact ? 1 : 2}>
          {description}
        </Text>
        <View style={[styles.pill, { backgroundColor: colors.background }]}>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>
            {CATEGORY_LABELS[category]}
          </Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} style={styles.chevron} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.card,
    padding: spacing.md,
    gap: spacing.md,
  },
  pressed: {
    opacity: 0.92,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    gap: 2,
  },
  title: {
    marginBottom: 2,
  },
  description: {
    marginBottom: spacing.xs,
  },
  pill: {
    alignSelf: 'flex-start',
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  chevron: {
    marginLeft: spacing.xs,
  },
});
