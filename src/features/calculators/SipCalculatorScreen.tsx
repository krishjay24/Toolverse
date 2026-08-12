import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { StatGrid } from '@/components/tools/StatGrid';
import { ToolScreenLayout } from '@/components/tools/ToolScreenLayout';
import { useDebouncedToolTracking } from '@/hooks/useToolTracking';
import { useTheme, spacing, radius, createTypography } from '@/theme';
import { calculateSip } from '@/utils/calculations';

function cleanNumber(input: string): number {
  const cleaned = input.replace(/[^\d.]/g, '');
  return parseFloat(cleaned) || 0;
}

export function SipCalculatorScreen() {
  const [monthlyInvestment, setMonthlyInvestment] = useState('5000');
  const [annualReturn, setAnnualReturn] = useState('12');
  const [investmentYears, setInvestmentYears] = useState('10');

  const { markEdited, scheduleTrack } = useDebouncedToolTracking('sip-calculator');
  const { colors } = useTheme();
  const typography = createTypography(colors);

  const monthly = cleanNumber(monthlyInvestment);
  const annual = cleanNumber(annualReturn);
  const years = cleanNumber(investmentYears);

  const result = useMemo(
    () => calculateSip(monthly, annual, years),
    [monthly, annual, years],
  );

  useEffect(() => {
    if (monthly <= 0 || years <= 0) {
      return;
    }
    scheduleTrack(`SIP: ₹${monthly}/mo, ${annual}% return, ${years} years`);
  }, [monthly, annual, years, scheduleTrack]);

  const handleClear = () => {
    setMonthlyInvestment('');
    setAnnualReturn('');
    setInvestmentYears('');
  };

  const onMonthlyChange = (value: string) => {
    markEdited();
    setMonthlyInvestment(value);
  };

  const onAnnualChange = (value: string) => {
    markEdited();
    setAnnualReturn(value);
  };

  const onYearsChange = (value: string) => {
    markEdited();
    setInvestmentYears(value);
  };

  const isValid = monthly > 0 && years > 0 && annual >= 0;

  return (
    <ToolScreenLayout
      title="SIP Calculator"
      subtitle="Estimate SIP maturity value and returns"
    >
      {/* Inputs Card */}
      <View
        style={[
          styles.inputCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <AppInput
          label="Monthly Investment"
          value={monthlyInvestment}
          onChangeText={onMonthlyChange}
          prefix="₹"
          placeholder="5000"
          keyboardType="decimal-pad"
        />

        <AppInput
          label="Expected Annual Return"
          value={annualReturn}
          onChangeText={onAnnualChange}
          suffix="% p.a."
          placeholder="12"
          keyboardType="decimal-pad"
        />

        <AppInput
          label="Investment Period"
          value={investmentYears}
          onChangeText={onYearsChange}
          suffix="years"
          placeholder="10"
          keyboardType="decimal-pad"
        />
      </View>

      {/* Results */}
      {isValid && (
        <>
          {/* Maturity Value Hero Card */}
          <View
            style={[
              styles.heroCard,
              {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              },
            ]}
          >
            <Text
              style={[
                typography.caption,
                { color: colors.background, opacity: 0.8 },
              ]}
            >
              Maturity Value
            </Text>
            <Text
              style={[
                typography.h1,
                { color: colors.background, marginTop: spacing.xs },
              ]}
            >
              ₹{result.futureValue.toFixed(0)}
            </Text>
            <Text
              style={[
                typography.bodySmall,
                { color: colors.background, opacity: 0.7, marginTop: spacing.xs },
              ]}
            >
              After {cleanNumber(investmentYears)} years
            </Text>
          </View>

          {/* Stats Grid */}
          <StatGrid
            items={[
              {
                label: 'Total Invested',
                value: `₹${result.totalInvested.toFixed(0)}`,
              },
              {
                label: 'Estimated Returns',
                value: `₹${result.estimatedReturns.toFixed(0)}`,
              },
            ]}
            columns={2}
          />

          {/* Calculation Details Card */}
          <View
            style={[
              styles.detailsCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Text
              style={[typography.label, { color: colors.textPrimary, marginBottom: spacing.base }]}
            >
              Calculation Details
            </Text>

            <View style={styles.detailRow}>
              <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
                Monthly Investment
              </Text>
              <Text style={[typography.body, { color: colors.textPrimary }]}>
                ₹{cleanNumber(monthlyInvestment).toLocaleString('en-IN')}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
                Annual Return
              </Text>
              <Text style={[typography.body, { color: colors.textPrimary }]}>
                {cleanNumber(annualReturn).toFixed(2)}% p.a.
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
                Investment Period
              </Text>
              <Text style={[typography.body, { color: colors.textPrimary }]}>
                {cleanNumber(investmentYears).toFixed(0)} years ({(cleanNumber(investmentYears) * 12).toFixed(0)} months)
              </Text>
            </View>

            <View
              style={[
                styles.divider,
                { backgroundColor: colors.border, marginVertical: spacing.base },
              ]}
            />

            <View style={styles.detailRow}>
              <Text style={[typography.label, { color: colors.textPrimary }]}>
                Future Value
              </Text>
              <Text style={[typography.label, { color: colors.primary }]}>
                ₹{result.futureValue.toFixed(0)}
              </Text>
            </View>
          </View>

          {/* Disclaimer Note */}
          <View
            style={[
              styles.disclaimerNote,
              { backgroundColor: colors.errorLight },
            ]}
          >
            <Text style={[typography.caption, { color: colors.error }]}>
              ⚠️ This is an estimated calculation. Actual returns may vary based on market performance.
            </Text>
          </View>
        </>
      )}

      {/* Clear Button */}
      <AppButton
        title="Clear"
        onPress={handleClear}
        variant="secondary"
        fullWidth
      />
    </ToolScreenLayout>
  );
}

const styles = StyleSheet.create({
  inputCard: {
    borderRadius: radius.card,
    borderWidth: 1,
    padding: spacing.base,
    gap: spacing.md,
  },
  heroCard: {
    borderRadius: radius.card,
    borderWidth: 1,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsCard: {
    borderRadius: radius.card,
    borderWidth: 1,
    padding: spacing.base,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  disclaimerNote: {
    borderRadius: radius.card,
    padding: spacing.base,
  },
});
