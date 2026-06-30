import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { AppButton } from '@/components/ui/AppButton';
import { ToolScreenLayout } from '@/components/tools/ToolScreenLayout';
import { useToolTracking } from '@/hooks/useToolTracking';
import { useTheme, spacing, radius, createTypography } from '@/theme';
import { calculateEmi } from '@/utils/calculations';
import { formatRupee } from '@/utils/formatters';

function SliderInput({
  label,
  value,
  min,
  max,
  step,
  displayValue,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  displayValue: string;
  suffix: string;
  onChange: (v: number) => void;
}) {
  const { colors } = useTheme();
  const typography = createTypography(colors);

  return (
    <View style={[styles.sliderCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.sliderLabelRow}>
        <Text style={[typography.label, { color: colors.textSecondary }]}>{label}</Text>
        <View style={[styles.sliderValueBox, { backgroundColor: colors.primaryLight }]}>
          <Text style={[typography.label, { color: colors.primary }]}>
            {displayValue} {suffix}
          </Text>
        </View>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor={colors.border}
        thumbTintColor={colors.primary}
      />
      <View style={styles.sliderRange}>
        <Text style={[typography.caption, { color: colors.textSecondary }]}>
          {min.toLocaleString()}
        </Text>
        <Text style={[typography.caption, { color: colors.textSecondary }]}>
          {max.toLocaleString()}
        </Text>
      </View>
    </View>
  );
}

export function EmiCalculatorScreen() {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(5);
  const [result, setResult] = useState<ReturnType<typeof calculateEmi> | null>(null);
  const trackAction = useToolTracking('emi-calculator');
  const { colors } = useTheme();
  const typography = createTypography(colors);

  useEffect(() => {
    const emiResult = calculateEmi(loanAmount, interestRate, tenureYears * 12);
    setResult(emiResult);
  }, [loanAmount, interestRate, tenureYears]);

  const principalPercent = result ? (loanAmount / result.totalPayment) * 100 : 70;
  const interestPercent = 100 - principalPercent;

  return (
    <ToolScreenLayout title="EMI Calculator" subtitle="Loan payment planner">
      {/* Slider Inputs */}
      <SliderInput
        label="Loan Amount"
        value={loanAmount}
        min={10000}
        max={10000000}
        step={10000}
        displayValue={`₹${(loanAmount / 100000).toFixed(1)}L`}
        suffix=""
        onChange={setLoanAmount}
      />

      <SliderInput
        label="Interest Rate (p.a.)"
        value={interestRate}
        min={1}
        max={24}
        step={0.1}
        displayValue={interestRate.toFixed(1)}
        suffix="%"
        onChange={setInterestRate}
      />

      <SliderInput
        label="Tenure"
        value={tenureYears}
        min={1}
        max={30}
        step={1}
        displayValue={tenureYears.toString()}
        suffix="Yrs"
        onChange={setTenureYears}
      />

      {/* Result Card */}
      {result ? (
        <View style={[styles.resultCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {/* Monthly EMI hero */}
          <View style={[styles.emiHero, { backgroundColor: colors.primaryLight }]}>
            <Text style={[typography.caption, { color: colors.primary, letterSpacing: 1, textTransform: 'uppercase' }]}>
              Monthly EMI
            </Text>
            <Text style={[styles.emiAmount, { color: colors.primary }]}>
              {formatRupee(result.monthlyEmi)}
            </Text>
          </View>

          {/* Breakdown row */}
          <View style={styles.breakdownRow}>
            <View style={[styles.breakdownItem, { borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: colors.border }]}>
              <Text style={[typography.caption, { color: colors.textSecondary, textAlign: 'center' }]}>
                Total Interest
              </Text>
              <Text style={[typography.label, { color: '#F59E0B', textAlign: 'center' }]}>
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

          {/* Stacked bar */}
          <View style={styles.barSection}>
            <View style={styles.barLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
                <Text style={[typography.caption, { color: colors.textSecondary }]}>Principal</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
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
                  { backgroundColor: '#F59E0B', width: `${interestPercent}%` as any },
                ]}
              />
            </View>
          </View>
        </View>
      ) : null}
    </ToolScreenLayout>
  );
}

const styles = StyleSheet.create({
  sliderCard: {
    borderRadius: radius.card,
    borderWidth: 1,
    padding: spacing.base,
    gap: spacing.sm,
  },
  sliderLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sliderValueBox: {
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  slider: {
    width: '100%',
    height: 32,
    marginHorizontal: -spacing.sm,
  },
  sliderRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resultCard: {
    borderRadius: radius.card,
    borderWidth: 1,
    overflow: 'hidden',
    gap: 0,
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
