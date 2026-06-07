import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useTheme, spacing, radius, createTypography } from '@/theme';

interface AppInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  keyboardType?: KeyboardTypeOptions;
  prefix?: string;
  suffix?: string;
  helperText?: string;
  multiline?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export function AppInput({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  keyboardType = 'default',
  prefix,
  suffix,
  helperText,
  multiline = false,
  autoCapitalize = 'sentences',
}: AppInputProps) {
  const { colors } = useTheme();
  const typography = createTypography(colors);

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={typography.label}>{label}</Text> : null}
      <View
        style={[
          styles.inputRow,
          { backgroundColor: colors.surface, borderColor: error ? colors.error : colors.border },
        ]}
      >
        {prefix ? <Text style={[typography.body, { color: colors.textSecondary }]}>{prefix}</Text> : null}
        <TextInput
          style={[typography.body, styles.input, multiline && styles.multiline]}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          multiline={multiline}
          autoCapitalize={autoCapitalize}
        />
        {suffix ? <Text style={[typography.body, { color: colors.textSecondary }]}>{suffix}</Text> : null}
      </View>
      {error ? <Text style={[typography.caption, { color: colors.error }]}>{error}</Text> : null}
      {!error && helperText ? <Text style={typography.caption}>{helperText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.input,
    paddingHorizontal: spacing.base,
    minHeight: 52,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
  },
  multiline: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
});
