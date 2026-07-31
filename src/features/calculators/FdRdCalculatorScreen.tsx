import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AppInput } from '@/components/ui/AppInput';
import { ToolScreenLayout } from '@/components/tools/ToolScreenLayout';
import { ToolResultHero } from '@/components/tools/ToolResultHero';
import { StatGrid } from '@/components/tools/StatGrid';
import { useToolTracking } from '@/hooks/useToolTracking';
import { useTheme, spacing, radius, createTypography } from '@/theme';
import {
  calculateFixedDeposit,
  calculateRecurringDeposit,
  type FixedDepositResult,
  type RecurringDepositResult,
} from '@/utils/calculations';
import { formatRupee } from '@/utils/formatters';

type CalculatorMode = 'fd' | 'rd';

function cleanNumber(value: string): number {
  const numeric = value.replace(/[^0-9.]/g, '');
  return Number(numeric) || 0;
}

export function FdRdCalculatorScreen() {
  const [mode, setMode] = useState<CalculatorMode>('fd');
  const [amount, setAmount] = useState('100000');
  const [rate, setRate] = useState('7.5');
  const [tenureMonths, setTenureMonths] = useState('12');

  const trackAction = useToolTracking('fd-rd-calculator');
  const { colors } = useTheme();
  const typography = createTypography(colors);

  const amountValue = cleanNumber(amount);
  const rateValue = cleanNumber(rate);
  const tenureValue = Math.round(cleanNumber(tenureMonths));

  const result = useMemo<FixedDepositResult | RecurringDepositResult>(() => {
    if (mode === 'fd') {
      return calculateFixedDeposit(amountValue, rateValue, tenureValue);
    }

    return calculateRecurringDeposit(amountValue, rateValue, tenureValue);
  }, [amountValue, mode, rateValue, tenureValue]);

  const totalDeposit =
    mode === 'fd'
      ? amountValue
      : 'totalDeposit' in result
        ? Number(result.totalDeposit)
        : amountValue;

  const handleModeChange = (nextMode: CalculatorMode) => {
    setMode(nextMode);
    trackAction(`selected ${nextMode.toUpperCase()} calculator`);
  };

  return (
    <ToolScreenLayout
      title="FD & RD Calculator"
      subtitle="Estimate maturity amount and interest"
    >
      <View style={[styles.modeContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Pressable
          onPress={() => handleModeChange('fd')}
          style={[
            styles.modeButton,
            mode === 'fd' && { backgroundColor: colors.primary },
          ]}
        >
          <Text
            style={[
              typography.label,
              { color: mode === 'fd' ? '#FFFFFF' : colors.textSecondary },
            ]}
          >
            Fixed Deposit
          </Text>
        </Pressable>

        <Pressable
          onPress={() => handleModeChange('rd')}
          style={[
            styles.modeButton,
            mode === 'rd' && { backgroundColor: colors.primary },
          ]}
        >
          <Text
            style={[
              typography.label,
              { color: mode === 'rd' ? '#FFFFFF' : colors.textSecondary },
            ]}
          >
            Recurring Deposit
          </Text>
        </Pressable>
      </View>

      <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <AppInput
          label={mode === 'fd' ? 'Deposit Amount' : 'Monthly Deposit'}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          prefix="₹"
          placeholder={mode === 'fd' ? '100000' : '5000'}
          helperText={mode === 'fd' ? 'One-time investment amount' : 'Amount deposited every month'}
        />

        <AppInput
          label="Interest Rate"
          value={rate}
          onChangeText={setRate}
          keyboardType="decimal-pad"
          suffix="% p.a."
          placeholder="7.5"
        />

        <AppInput
          label="Tenure"
          value={tenureMonths}
          onChangeText={setTenureMonths}
          keyboardType="numeric"
          suffix="months"
          placeholder="12"
          helperText="Enter total tenure in months"
        />
      </View>

      <ToolResultHero
        icon="trending-up-outline"
        label="Maturity Amount"
        value={formatRupee(result.maturityAmount)}
        subtitle={`Estimated result for ${tenureValue || 0} months`}
      />

      <StatGrid
        columns={2}
        items={[
          {
            label: mode === 'fd' ? 'Deposit Amount' : 'Total Deposit',
            value: formatRupee(totalDeposit),
          },
          {
            label: 'Total Interest',
            value: formatRupee(result.totalInterest),
          },
        ]}
      />

      <View style={[styles.noteCard, { backgroundColor: colors.primaryLight }]}>
        <Text style={[typography.caption, { color: colors.primary }]}>
          This is an estimated calculation. Actual bank returns may vary depending on bank rules,
          compounding frequency, TDS, premature withdrawal, and tax conditions.
        </Text>
      </View>
    </ToolScreenLayout>
  );
}

const styles = StyleSheet.create({
  modeContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: radius.button,
    padding: spacing.xs,
    gap: spacing.xs,
  },
  modeButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: radius.button - 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formCard: {
    borderWidth: 1,
    borderRadius: radius.card,
    padding: spacing.base,
    gap: spacing.base,
  },
  noteCard: {
    borderRadius: radius.card,
    padding: spacing.base,
  },
});