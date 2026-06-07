import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, spacing, radius, createTypography } from '@/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search tools...',
  onClear,
}: SearchBarProps) {
  const { colors } = useTheme();
  const typography = createTypography(colors);

  const handleClear = () => {
    onChangeText('');
    onClear?.();
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <Ionicons name="search-outline" size={18} color={colors.textSecondary} />
      <TextInput
        style={[typography.body, styles.input]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
      {value.length > 0 ? (
        <Pressable onPress={handleClear} hitSlop={8}>
          <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.input,
    paddingHorizontal: spacing.base,
    minHeight: 48,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.sm,
  },
});
