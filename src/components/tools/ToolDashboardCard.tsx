import { memo } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ToolCategory, ToolIconName } from '@/types/tool';
import { createTypography, radius, spacing, useTheme } from '@/theme';

const GRID_GAP = spacing.md;
const HORIZONTAL_PADDING = spacing.screen;

const CATEGORY_ICON_COLORS: Record<ToolCategory, string[]> = {
  daily: ['#06B6D4', '#22C55E', '#A855F7'],
  finance: ['#10B981', '#2563EB', '#F59E0B'],
  text: ['#38BDF8', '#8B5CF6', '#14B8A6'],
  qr: ['#2563EB', '#6366F1', '#0EA5E9'],
  image: ['#0EA5E9', '#22C55E', '#8B5CF6'],
  health: ['#EF4444', '#22C55E', '#3B82F6'],
  random: ['#EF4444', '#8B5CF6', '#14B8A6'],
  converters: ['#F59E0B', '#10B981', '#2563EB'],
  security: ['#6366F1', '#0EA5E9', '#334155'],
};

const FORMATTED_TITLES: Record<string, string> = {
  'QR Generator': 'QR\nGenerator',
  'QR Scanner': 'QR\nScanner',
  'Image Compressor': 'Image\nCompressor',
  'Image Resizer': 'Image\nResizer',
  'Discount Calculator': 'Discount\nCalculator',
  'EMI Calculator': 'EMI\nCalculator',
  'GST Calculator': 'GST\nCalculator',
  'SIP Calculator': 'SIP\nCalculator',
  'Age Calculator': 'Age\nCalculator',
  'BMI Calculator': 'BMI\nCalculator',
  'Percentage Calculator': 'Percentage\nCalculator',
  'Password Generator': 'Password\nGenerator',
  'Unit Converter': 'Unit\nConverter',
  'Text Counter': 'Word\nCounter',
  'Case Converter': 'Case\nConverter',
  'Remove Extra Spaces': 'Extra\nSpaces',
  'Password Strength Checker': 'Password\nStrength',
  'Date Difference': 'Date\nDifference',
  'FD & RD Calculator': 'FD & RD\nCalculator',
  'Coin Flip': 'Coin\nFlip',
  'Dice Roll': 'Dice\nRoll',
  'Random Number': 'Random\nNumber',
  'Yes or No': 'Yes or\nNo',
  'Random Picker': 'Random\nPicker',
  'Spin Wheel': 'Spin\nWheel',
  'Team Splitter': 'Team\nSplitter',
  'Decision Maker': 'Decision\nMaker',
  'Rock Paper Scissors': 'Rock Paper\nScissors',
  'Guess the Number': 'Guess the\nNumber',
};

function formatDashboardTitle(title: string): string {
  return FORMATTED_TITLES[title] ?? title;
}

interface ToolDashboardCardProps {
  title: string;
  icon: ToolIconName;
  category: ToolCategory;
  onPress: () => void;
  colorIndex?: number;
}

function ToolDashboardCardComponent({
  title,
  icon,
  category,
  onPress,
  colorIndex = 0,
}: ToolDashboardCardProps) {
  const { width } = useWindowDimensions();
  const { colors, isDark } = useTheme();
  const typography = createTypography(colors);
  const cardWidth = Math.floor((width - HORIZONTAL_PADDING * 2 - GRID_GAP * 2) / 3);
  const iconBackground = CATEGORY_ICON_COLORS[category][Math.abs(colorIndex) % CATEGORY_ICON_COLORS[category].length];
  const cardBackground = colors.surface;
  const borderColor = colors.border;
  const shadowStyle = isDark
    ? { shadowOpacity: 0, elevation: 0 }
    : { shadowOpacity: 0.05, elevation: 2 };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          width: cardWidth,
          backgroundColor: cardBackground,
          borderColor,
          ...shadowStyle,
        },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: iconBackground }]}>
        <Ionicons name={icon} size={24} color="#FFFFFF" />
      </View>
      <Text
        style={[typography.label, styles.title, { color: colors.textPrimary }]}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {formatDashboardTitle(title)}
      </Text>
    </Pressable>
  );
}

export const ToolDashboardCard = memo(ToolDashboardCardComponent);

const styles = StyleSheet.create({
  card: {
    minHeight: 116,
    height: 118,
    borderWidth: 1,
    borderRadius: radius.card,
    paddingHorizontal: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 7,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.icon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center',
    fontWeight: '700',
    width: '100%',
  },
});