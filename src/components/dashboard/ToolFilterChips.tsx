import { memo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FilterChipId, FILTER_CHIPS } from '@/constants/dashboard';
import { createTypography, radius, spacing, useTheme } from '@/theme';

interface ToolFilterChipsProps {
  activeId: FilterChipId;
  onSelect: (id: FilterChipId) => void;
}

const CHIP_ICONS: Record<FilterChipId, keyof typeof Ionicons.glyphMap> = {
  all: 'apps-outline',
  popular: 'flame-outline',
  finance: 'card-outline',
  text: 'text-outline',
  qr: 'qr-code-outline',
  health: 'heart-outline',
  fun: 'game-controller-outline',
  image: 'image-outline',
  converters: 'swap-horizontal-outline',
  security: 'shield-checkmark-outline',
};

function ToolFilterChipsComponent({ activeId, onSelect }: ToolFilterChipsProps) {
  const { colors, isDark } = useTheme();
  const typography = createTypography(colors);
  const inactiveBackground = colors.surface;
  const inactiveBorder = colors.border;
  const inactiveText = colors.textPrimary;
  const inactiveIcon = colors.textSecondary;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {FILTER_CHIPS.map((chip) => {
        const active = chip.id === activeId;

        return (
          <Pressable
            key={chip.id}
            onPress={() => onSelect(chip.id)}
            style={({ pressed }) => [
              styles.chip,
              {
                backgroundColor: active ? colors.primary : inactiveBackground,
                borderColor: active ? colors.primary : inactiveBorder,
              },
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name={CHIP_ICONS[chip.id]}
              size={15}
              color={active ? '#FFFFFF' : inactiveIcon}
            />
            <Text
              style={[
                typography.bodySmall,
                styles.label,
                { color: active ? '#FFFFFF' : inactiveText },
              ]}
            >
              {chip.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

export const ToolFilterChips = memo(ToolFilterChipsComponent);

const styles = StyleSheet.create({
  content: {
    gap: spacing.sm,
    paddingTop: spacing.xs,
    paddingBottom: spacing.base,
    paddingRight: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 1,
    borderRadius: radius.button,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 44,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.015,
    shadowRadius: 3,
    elevation: 0,
  },
  label: {
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.88,
  },
});
