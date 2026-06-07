import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme, spacing, createTypography } from '@/theme';

interface CategoryChipsProps {
  categories: { id: string; label: string }[];
  activeId: string;
  onSelect: (id: string) => void;
  scrollable?: boolean;
}

export function CategoryChips({
  categories,
  activeId,
  onSelect,
  scrollable = false,
}: CategoryChipsProps) {
  const { colors } = useTheme();
  const typography = createTypography(colors);

  const content = categories.map((category) => {
    const active = activeId === category.id;
    return (
      <Pressable
        key={category.id}
        style={[
          styles.chip,
          {
            backgroundColor: active ? colors.primaryLight : colors.surface,
            borderColor: active ? colors.primary : colors.border,
          },
        ]}
        onPress={() => onSelect(category.id)}
      >
        <Text
          style={[
            typography.bodySmall,
            active && { color: colors.primary, fontWeight: '600' },
            !active && { color: colors.textPrimary },
          ]}
        >
          {category.label}
        </Text>
      </Pressable>
    );
  });

  if (scrollable) {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.row}>{content}</View>
      </ScrollView>
    );
  }

  return <View style={[styles.row, styles.wrap]}>{content}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  wrap: {
    flexWrap: 'wrap',
  },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
});
