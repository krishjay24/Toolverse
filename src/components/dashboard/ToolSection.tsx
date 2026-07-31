import { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DashboardSectionDef } from '@/constants/dashboard';
import { TOOLS } from '@/constants/tools';
import { Tool } from '@/types/tool';
import { ToolDashboardCard } from '@/components/tools/ToolDashboardCard';
import { createTypography, radius, spacing, useTheme } from '@/theme';

interface ToolSectionProps {
  section: Pick<DashboardSectionDef, 'label' | 'icon'>;
  tools: Tool[];
  onToolPress: (route: string) => void;
}

const SECTION_ICON_COLORS: Record<DashboardSectionDef['label'] | 'Popular Tools', string> = {
  'Popular Tools': '#F97316',
  'Daily Tools': '#F59E0B',
  Finance: '#10B981',
  'Text Tools': '#8B5CF6',
  'QR & Barcode': '#2563EB',
  'Image Tools': '#0EA5E9',
  'PDF Tools': '#EF4444',
  Health: '#EC4899',
  'Random & Fun': '#8B5CF6',
  Converters: '#F59E0B',
  Security: '#6366F1',
};

function ToolSectionComponent({ section, tools, onToolPress }: ToolSectionProps) {
  const { colors } = useTheme();
  const typography = createTypography(colors);
  const sectionColor = SECTION_ICON_COLORS[section.label] ?? colors.primary;

  const toolsWithColorIndex = useMemo(
    () => tools.map((tool) => ({ ...tool, colorIndex: TOOLS.findIndex((item) => item.id === tool.id) })),
    [tools],
  );

  if (toolsWithColorIndex.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name={section.icon} size={20} color={sectionColor} />
          <Text style={[typography.h3, styles.headerTitle, { color: colors.textPrimary }]}>{section.label}</Text>
        </View>
      </View>

      <View style={styles.grid}>
        {toolsWithColorIndex.map((tool) => (
          <ToolDashboardCard
            key={tool.id}
            title={tool.title}
            icon={tool.icon}
            category={tool.category}
            onPress={() => onToolPress(tool.route)}
            colorIndex={tool.colorIndex}
          />
        ))}
      </View>
    </View>
  );
}

export const ToolSection = memo(ToolSectionComponent);

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
});