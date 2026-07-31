import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppButton } from '@/components/ui/AppButton';
import { DatePickerInput } from '@/components/ui/DatePickerInput';
import { ToolScreenLayout } from '@/components/tools/ToolScreenLayout';
import { StatGrid } from '@/components/tools/StatGrid';
import { useToolTracking } from '@/hooks/useToolTracking';
import { useTheme, spacing, radius, createTypography } from '@/theme';
import { calculateDateDifference } from '@/utils/calculations';
import { formatNumber } from '@/utils/formatters';

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDateLabel(date: Date): string {
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

// ── Defaults ─────────────────────────────────────────────────────────────────

function defaultStartDate(): Date {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 1);
  return d;
}

function defaultEndDate(): Date {
  return new Date();
}

const FAR_FUTURE = new Date(2100, 11, 31);
const FAR_PAST = new Date(1900, 0, 1);

// ── Screen ────────────────────────────────────────────────────────────────────

export function DateDifferenceCalculatorScreen() {
  const [startDate, setStartDate] = useState<Date>(defaultStartDate);
  const [endDate, setEndDate] = useState<Date>(defaultEndDate);

  const trackAction = useToolTracking('date-difference-calculator');
  const { colors, isDark } = useTheme();
  const typography = createTypography(colors);

  const result = useMemo(
    () => calculateDateDifference(startDate, endDate),
    [startDate, endDate],
  );

  const handleCalculate = () => {
    trackAction(`${result.totalDays} days difference`);
  };

  const handleReset = () => {
    setStartDate(defaultStartDate());
    setEndDate(defaultEndDate());
  };

  const warningBg = isDark ? '#451a03' : '#FEF3C7';
  const warningText = isDark ? '#fde68a' : '#92400E';

  return (
    <ToolScreenLayout title="Date Difference" subtitle="Calculate days between two dates">

      {/* ── Date pickers ───────────────────────────────────────────────── */}
      <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <DatePickerInput
          label="Start Date"
          value={startDate}
          onChange={setStartDate}
          minimumDate={FAR_PAST}
          maximumDate={FAR_FUTURE}
        />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <DatePickerInput
          label="End Date"
          value={endDate}
          onChange={setEndDate}
          minimumDate={FAR_PAST}
          maximumDate={FAR_FUTURE}
        />
      </View>

      <AppButton
        title="Calculate Difference"
        onPress={handleCalculate}
        fullWidth
        iconLeft="calendar-outline"
      />

      {/* ── Reversed-dates note ──────────────────────────────────────── */}
      {result.isReversed ? (
        <View style={[styles.warningCard, { backgroundColor: warningBg }]}>
          <Text style={[typography.bodySmall, { color: warningText }]}>
            ℹ️ End date is before start date — showing absolute difference.
          </Text>
        </View>
      ) : null}

      {/* ── Hero result ───────────────────────────────────────────────── */}
      <View style={[styles.resultCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={[styles.resultTopBar, { backgroundColor: colors.primary }]} />
        <View style={styles.resultContent}>
          <Text style={[typography.bodySmall, { color: colors.textSecondary, textAlign: 'center' }]}>
            Total Days
          </Text>
          <Text style={[styles.totalDays, { color: colors.primary }]}>
            {formatNumber(result.totalDays, 0)}
          </Text>
          <Text style={[typography.caption, { color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xs }]}>
            {formatDateLabel(result.startDate)} → {formatDateLabel(result.endDate)}
          </Text>
        </View>
      </View>

      {/* ── Breakdown stats ───────────────────────────────────────────── */}
      <StatGrid
        columns={2}
        items={[
          {
            label: 'Weeks & Days',
            value: `${formatNumber(result.weeks, 0)}w ${formatNumber(result.remainingDays, 0)}d`,
          },
          {
            label: 'Approx Months',
            value: formatNumber(result.approxMonths, 0),
          },
          {
            label: 'Approx Years',
            value: formatNumber(result.approxYears, 1),
          },
          {
            label: 'Working Days*',
            value: formatNumber(Math.round(result.totalDays * 5 / 7), 0),
          },
        ]}
      />

      {/* ── Approximation note ──────────────────────────────────────── */}
      <View style={[styles.noteCard, { backgroundColor: colors.border + '20' }]}>
        <Text style={[typography.caption, { color: colors.textSecondary, fontStyle: 'italic' }]}>
          📌 Month and year values are approximate (month lengths vary 28–31 days).{'\n'}* Working days estimate assumes 5-day work weeks.
        </Text>
      </View>

      <AppButton title="Reset Dates" onPress={handleReset} variant="secondary" fullWidth />

    </ToolScreenLayout>
  );
}

const styles = StyleSheet.create({
  formCard: {
    borderRadius: radius.card,
    borderWidth: 1,
    padding: spacing.base,
    gap: spacing.md,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  resultCard: {
    borderRadius: radius.card,
    borderWidth: 1,
    overflow: 'hidden',
  },
  resultTopBar: {
    height: 4,
  },
  resultContent: {
    padding: spacing.base,
    alignItems: 'center',
    gap: spacing.xs,
  },
  totalDays: {
    fontSize: 52,
    fontWeight: '800',
    lineHeight: 56,
    letterSpacing: -1,
  },
  warningCard: {
    borderRadius: radius.card,
    padding: spacing.base,
  },
  noteCard: {
    borderRadius: radius.card,
    padding: spacing.base,
  },
});
