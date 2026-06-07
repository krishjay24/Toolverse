import { StyleSheet, Text, View } from 'react-native';
import { useTheme, spacing, createTypography } from '@/theme';

interface StatItem {
  value: string | number;
  label: string;
}

interface StatGridProps {
  items: StatItem[];
  columns?: 2 | 3;
}

export function StatGrid({ items, columns = 3 }: StatGridProps) {
  const { colors } = useTheme();
  const typography = createTypography(colors);

  return (
    <View style={[styles.grid, columns === 2 && styles.gridTwo]}>
      {items.map((item) => (
        <View
          key={item.label}
          style={[styles.item, { backgroundColor: colors.background }, columns === 2 && styles.itemTwo]}
        >
          <Text style={[typography.h2, { color: colors.primary }]}>{item.value}</Text>
          <Text style={typography.caption}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', gap: spacing.sm },
  gridTwo: { flexWrap: 'wrap' },
  item: {
    flex: 1,
    borderRadius: 16,
    padding: spacing.base,
    alignItems: 'center',
    gap: 4,
    minWidth: '30%',
  },
  itemTwo: { flexBasis: '47%', flexGrow: 1 },
});
