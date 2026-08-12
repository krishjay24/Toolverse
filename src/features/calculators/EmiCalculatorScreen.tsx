import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppInput } from '@/components/ui/AppInput';
import { ToolScreenLayout } from '@/components/tools/ToolScreenLayout';
import { useDebouncedToolTracking } from '@/hooks/useToolTracking';
import { useTheme, spacing, radius, createTypography } from '@/theme';
import { calculateEmi } from '@/utils/calculations';
import { formatRupee } from '@/utils/formatters';

function cleanNumber(value: string): number {
  const numeric = value.replace(/[^0-9.]/g, '');
  return Number(numeric) || 0;
}

export function EmiCalculatorScreen() {
  const [loanAmountText, setLoanAmountText] = useState('500000');
  const [interestRateText, setInterestRateText] = useState('8.5');
  const [tenureYearsText, setTenureYearsText] = useState('5');

  const { markEdited, scheduleTrack } = useDebouncedToolTracking('emi-calculator');
  const { colors } = useTheme();
  const typography = createTypography(colors);

  const loanAmount = cleanNumber(loanAmountText);
  const interestRate = cleanNumber(interestRateText);
  const tenureYears = cleanNumber(tenureYearsText);
  const tenureMonths = Math.round(tenureYears * 12);

  const result = useMemo(() => {
    return calculateEmi(loanAmount, interestRate, tenureMonths);
  }, [interestRate, loanAmount, tenureMonths]);

  const principalPercent =
    result.totalPayment > 0 ? (loanAmount / result.totalPayment) * 100 : 0;

  const interestPercent = Math.max(0, 100 - principalPercent);

  useEffect(() => {
    if (loanAmount <= 0 || tenureMonths <= 0) {
      return;
    }
    scheduleTrack(`EMI ${formatRupee(result.monthlyEmi)}`);
  }, [loanAmount, tenureMonths, result.monthlyEmi, scheduleTrack]);

  const handleFieldChange = (field: 'loan' | 'interest' | 'tenure', value: string) => {
    markEdited();
    if (field === 'loan') {
      setLoanAmountText(value);
    } else if (field === 'interest') {
      setInterestRateText(value);
    } else {
      setTenureYearsText(value);
    }
  };

  return (
    <ToolScreenLayout title="EMI Calculator" subtitle="Plan your loan payments">
      <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <AppInput
          label="Loan Amount"
          value={loanAmountText}
          onChangeText={(value) => handleFieldChange('loan', value)}
          keyboardType="numeric"
          prefix="₹"
          placeholder="500000"
          helperText="Enter the exact principal amount you want to borrow"
        />

        <AppInput
          label="Interest Rate"
          value={interestRateText}
          onChangeText={(value) => handleFieldChange('interest', value)}
          keyboardType="decimal-pad"
          suffix="% p.a."
          placeholder="8.5"
          helperText="Add the annual interest rate"
        />

        <AppInput
          label="Tenure"
          value={tenureYearsText}
          onChangeText={(value) => handleFieldChange('tenure', value)}
          keyboardType="numeric"
          suffix="years"
          placeholder="5"
          helperText="Enter total loan tenure in years"
        />
      </View>

      <View style={[styles.resultCard, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
        <View style={[styles.emiHero, { backgroundColor: colors.primaryLight }]}>
          <Text style={[typography.caption, { color: colors.primary, letterSpacing: 1, textTransform: 'uppercase' }]}>
            Monthly EMI
          </Text>
          <Text style={[styles.emiAmount, { color: colors.primary }]}>
            {formatRupee(result.monthlyEmi)}
          </Text>
        </View>

        <View style={styles.breakdownRow}>
          <View style={[styles.breakdownItem, { borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: colors.border }]}>
            <Text style={[typography.caption, { color: colors.textSecondary, textAlign: 'center' }]}>
              Total Interest
            </Text>
            <Text style={[typography.label, { color: colors.warning, textAlign: 'center' }]}>
              {formatRupee(result.totalInterest)}
            </Text>
          </View>

          <View style={styles.breakdownItem}>
            <Text style={[typography.caption, { color: colors.textSecondary, textAlign: 'center' }]}>
              Total Payment
            </Text>
            <Text style={[typography.label, { color: colors.primary, textAlign: 'center' }]}>
              {formatRupee(result.totalPayment)}
            </Text>
          </View>
        </View>

        <View style={[styles.barSection, { borderTopColor: colors.border }]}>
          <View style={styles.barLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
              <Text style={[typography.caption, { color: colors.textSecondary }]}>Principal</Text>
            </View>

            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.warning }]} />
              <Text style={[typography.caption, { color: colors.textSecondary }]}>Interest</Text>
            </View>
          </View>

          <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
            <View
              style={[
                styles.progressFill,
                { backgroundColor: colors.primary, width: `${principalPercent}%` as any },
              ]}
            />
            <View
              style={[
                styles.progressFill,
                { backgroundColor: colors.warning, width: `${interestPercent}%` as any },
              ]}
            />
          </View>
        </View>
      </View>
    </ToolScreenLayout>
  );
}

const styles = StyleSheet.create({
  formCard: {
    borderRadius: radius.card,
    borderWidth: 1,
    padding: spacing.base,
    gap: spacing.base,
  },
  resultCard: {
    borderRadius: radius.card,
    borderWidth: 1,
    overflow: 'hidden',
  },
  emiHero: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.xs,
  },
  emiAmount: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 42,
  },
  breakdownRow: {
    flexDirection: 'row',
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.base,
  },
  breakdownItem: {
    flex: 1,
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  barSection: {
    padding: spacing.base,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: spacing.sm,
  },
  barLegend: {
    flexDirection: 'row',
    gap: spacing.base,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  progressBar: {
    flexDirection: 'row',
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
});