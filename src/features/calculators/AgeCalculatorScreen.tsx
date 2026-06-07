import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { DatePickerInput, toDateString } from '@/components/ui/DatePickerInput';
import { StatGrid } from '@/components/tools/StatGrid';
import { ToolInsightBanner } from '@/components/tools/ToolInsightBanner';
import { ToolScreenLayout } from '@/components/tools/ToolScreenLayout';
import { useToolTracking } from '@/hooks/useToolTracking';
import { useTheme, spacing, createTypography } from '@/theme';
import { calculateAge } from '@/utils/calculations';
import { formatDate } from '@/utils/formatters';
import { ageCalculatorSchema } from '@/utils/validators';

export function AgeCalculatorScreen() {
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<ReturnType<typeof calculateAge> | null>(null);
  const trackAction = useToolTracking('age-calculator');
  const { colors } = useTheme();
  const typography = createTypography(colors);

  const onSubmit = () => {
    if (!dateOfBirth) {
      setError('Please select your date of birth.');
      return;
    }
    const data = { dateOfBirth: toDateString(dateOfBirth) };
    const parsed = ageCalculatorSchema.safeParse(data);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid date');
      return;
    }
    setError(undefined);
    const age = calculateAge(dateOfBirth);
    setResult(age);
    trackAction(`${age.years}y ${age.months}m ${age.days}d`);
  };

  const handleClear = () => {
    setDateOfBirth(null);
    setResult(null);
    setError(undefined);
  };

  return (
    <ToolScreenLayout title="Age Calculator" subtitle="Exact age & birthday countdown">
      <ToolInsightBanner
        icon="gift-outline"
        title="Celebrate every milestone"
        description="Select your birth date to see your exact age and days until your next birthday."
      />
      <DatePickerInput
        label="Date of birth"
        value={dateOfBirth}
        onChange={(date) => {
          setDateOfBirth(date);
          setError(undefined);
        }}
        error={error}
      />
      <AppButton title="Calculate my age" onPress={onSubmit} iconLeft="calendar-outline" fullWidth />
      <AppButton title="Clear" onPress={handleClear} variant="secondary" fullWidth />

      {result ? (
        <AppCard style={styles.resultCard}>
          <View style={[styles.celebration, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="sparkles" size={24} color={colors.primary} />
            <Text style={[typography.h3, { color: colors.primary }]}>You are exactly</Text>
          </View>
          <StatGrid
            items={[
              { value: result.years, label: 'Years' },
              { value: result.months, label: 'Months' },
              { value: result.days, label: 'Days' },
            ]}
          />
          <Text style={[typography.bodySmall, styles.totalDays]}>
            That's {result.totalDays.toLocaleString()} days of life!
          </Text>
          <View style={[styles.birthdayCard, { backgroundColor: colors.successLight }]}>
            <View style={styles.birthdayHeader}>
              <Ionicons name="balloon-outline" size={20} color={colors.success} />
              <Text style={[typography.label, { color: colors.success }]}>Next birthday</Text>
            </View>
            <Text style={typography.body}>{formatDate(result.nextBirthdayDate)}</Text>
            <Text style={[typography.h3, { color: colors.success }]}>
              {result.nextBirthdayDays} days to go
            </Text>
          </View>
        </AppCard>
      ) : null}
    </ToolScreenLayout>
  );
}

const styles = StyleSheet.create({
  resultCard: { gap: spacing.base },
  celebration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: 16,
    padding: spacing.base,
  },
  totalDays: { textAlign: 'center' },
  birthdayCard: { borderRadius: 16, padding: spacing.base, gap: spacing.sm },
  birthdayHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
