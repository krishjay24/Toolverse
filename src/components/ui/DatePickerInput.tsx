import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, spacing, radius, createTypography } from '@/theme';

interface DatePickerInputProps {
  label?: string;
  value: Date | null;
  onChange: (date: Date) => void;
  error?: string;
  helperText?: string;
  maximumDate?: Date;
  minimumDate?: Date;
}

function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDisplay(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function DatePickerInput({
  label,
  value,
  onChange,
  error,
  helperText,
  maximumDate = new Date(),
  minimumDate = new Date(1900, 0, 1),
}: DatePickerInputProps) {
  const [showPicker, setShowPicker] = useState(false);
  const { colors } = useTheme();
  const typography = createTypography(colors);

  const handleChange = (_event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (selected) {
      onChange(selected);
    }
  };

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={typography.label}>{label}</Text> : null}
      <Pressable
        onPress={() => setShowPicker(true)}
        style={[
          styles.field,
          {
            backgroundColor: colors.surface,
            borderColor: error ? colors.error : colors.border,
          },
        ]}
      >
        <Ionicons name="calendar-outline" size={20} color={colors.primary} />
        <Text
          style={[
            typography.body,
            styles.valueText,
            !value && { color: colors.textSecondary },
          ]}
        >
          {value ? formatDisplay(value) : 'Tap to select your birth date'}
        </Text>
        <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
      </Pressable>
      {value ? (
        <Text style={typography.caption}>Selected: {toDateString(value)}</Text>
      ) : null}
      {error ? <Text style={[typography.caption, { color: colors.error }]}>{error}</Text> : null}
      {!error && helperText ? <Text style={typography.caption}>{helperText}</Text> : null}

      {showPicker ? (
        <DateTimePicker
          value={value ?? new Date(2000, 0, 1)}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
        />
      ) : null}
      {Platform.OS === 'ios' && showPicker ? (
        <Pressable onPress={() => setShowPicker(false)} style={styles.iosDone}>
          <Text style={[typography.label, { color: colors.primary }]}>Done</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.sm },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.input,
    paddingHorizontal: spacing.base,
    minHeight: 52,
    gap: spacing.sm,
  },
  valueText: { flex: 1 },
  iosDone: { alignSelf: 'flex-end', paddingVertical: spacing.sm },
});

export { toDateString };
