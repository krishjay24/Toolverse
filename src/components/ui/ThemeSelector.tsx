import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemePreference } from '@/store/useAppStore';
import { useTheme, spacing, radius, createTypography } from '@/theme';

const OPTIONS: { id: ThemePreference; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'light', label: 'Light', icon: 'sunny-outline' },
  { id: 'dark', label: 'Dark', icon: 'moon-outline' },
  { id: 'system', label: 'System', icon: 'phone-portrait-outline' },
];

interface ThemeSelectorProps {
  value: ThemePreference;
  onChange: (value: ThemePreference) => void;
}

export function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  const { colors } = useTheme();
  const typography = createTypography(colors);

  return (
    <View style={styles.row}>
      {OPTIONS.map((option) => {
        const active = value === option.id;
        return (
          <Pressable
            key={option.id}
            onPress={() => onChange(option.id)}
            style={[
              styles.chip,
              {
                borderColor: active ? colors.primary : colors.border,
                backgroundColor: active ? colors.primary : colors.surface,
              },
            ]}
          >
            <Ionicons
              name={option.icon}
              size={16}
              color={active ? '#FFFFFF' : colors.textPrimary}
            />
            <Text
              style={[
                typography.caption,
                { color: active ? '#FFFFFF' : colors.textPrimary, fontWeight: '600' },
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderWidth: 1,
    borderRadius: radius.button,
    minHeight: 46,
    paddingVertical: spacing.sm,
  },
});
