import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, spacing, radius, createTypography } from '@/theme';
import { CATEGORY_LABELS, ToolCategory, ToolIconName } from '@/types/tool';

const ICON_BG_COLORS = [
  '#EAF1FF',
  '#E8F5E9',
  '#FFF3E0',
  '#FCE4EC',
  '#F3E5F5',
  '#E0F7FA',
];

interface ToolCardProps {
  title: string;
  description: string;
  icon: ToolIconName;
  category: ToolCategory;
  onPress: () => void;
  compact?: boolean;
  colorIndex?: number;
}

export function ToolCard({
  title,
  description,
  icon,
  category,
  onPress,
  compact = false,
  colorIndex = 0,
}: ToolCardProps) {
  const { colors } = useTheme();
  const typography = createTypography(colors);
  const iconBg = ICON_BG_COLORS[colorIndex % ICON_BG_COLORS.length];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={24} color={colors.primary} />
      </View>

      <View style={styles.body}>
        <Text style={[typography.label, styles.title]} numberOfLines={1}>
          {title}
        </Text>
        <Text style={[typography.bodySmall, styles.description]} numberOfLines={compact ? 1 : 2}>
          {description}
        </Text>
        <View style={[styles.pill, { backgroundColor: colors.primaryLight }]}>
          <Text style={[typography.caption, { color: colors.primary }]}>
            {CATEGORY_LABELS[category]}
          </Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.card,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: radius.icon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    fontSize: 15,
  },
  description: {
    lineHeight: 18,
  },
  pill: {
    alignSelf: 'flex-start',
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginTop: 2,
  },
});
