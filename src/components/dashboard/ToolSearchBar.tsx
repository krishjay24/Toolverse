import { memo } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createTypography, spacing, useTheme } from '@/theme';
import { radius } from '@/theme';

interface ToolSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

function ToolSearchBarComponent({ value, onChangeText }: ToolSearchBarProps) {
  const { colors, isDark } = useTheme();
  const typography = createTypography(colors);
  const backgroundColor = colors.surface;
  const borderColor = colors.border;

  return (
    <View style={[styles.container, { backgroundColor, borderColor }]}> 
      <Ionicons name="search-outline" size={21} color={colors.textSecondary} />
      <TextInput
        style={[typography.body, styles.input, { color: colors.textPrimary }]}
        value={value}
        onChangeText={onChangeText}
        placeholder="Search tools..."
        placeholderTextColor={colors.textSecondary}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
      {value.length > 0 ? (
        <Pressable onPress={() => onChangeText('')} hitSlop={8}>
          <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
        </Pressable>
      ) : null}
    </View>
  );
}

export const ToolSearchBar = memo(ToolSearchBarComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.button,
    paddingHorizontal: spacing.base,
    minHeight: 48,
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 0,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
  },
});