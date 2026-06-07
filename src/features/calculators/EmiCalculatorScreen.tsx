import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppInput } from '@/components/ui/AppInput';
import { ToolInsightBanner } from '@/components/tools/ToolInsightBanner';
import { ToolResultHero } from '@/components/tools/ToolResultHero';
import { ToolScreenLayout } from '@/components/tools/ToolScreenLayout';
import { useToolTracking } from '@/hooks/useToolTracking';
import { useTheme, spacing, createTypography } from '@/theme';
import { calculateEmi } from '@/utils/calculations';
import { formatRupee } from '@/utils/formatters';
import { emiCalculatorSchema, EmiCalculatorForm } from '@/utils/validators';

type TenureUnit = 'months' | 'years';

export function EmiCalculatorScreen() {
  const [tenureUnit, setTenureUnit] = useState<TenureUnit>('years');
  const [result, setResult] = useState<ReturnType<typeof calculateEmi> | null>(null);
  const trackAction = useToolTracking('emi-calculator');
  const { colors } = useTheme();
  const typography = createTypography(colors);

  const { control, handleSubmit, setError, reset, formState: { errors } } = useForm<EmiCalculatorForm>({
    defaultValues: { loanAmount: '', interestRate: '', tenure: '' },
  });

  const onSubmit = (data: EmiCalculatorForm) => {
    const parsed = emiCalculatorSchema.safeParse(data);
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field === 'loanAmount' || field === 'interestRate' || field === 'tenure') {
          setError(field, { message: issue.message });
        }
      });
      return;
    }
    const tenureMonths =
      tenureUnit === 'years' ? Number(parsed.data.tenure) * 12 : Number(parsed.data.tenure);
    const emiResult = calculateEmi(Number(parsed.data.loanAmount), Number(parsed.data.interestRate), tenureMonths);
    setResult(emiResult);
    trackAction(`EMI ${formatRupee(emiResult.monthlyEmi)}`);
  };

  return (
    <ToolScreenLayout title="EMI Calculator" subtitle="Loan payment in rupees">
      <ToolInsightBanner
        icon="home-outline"
        title="Plan your loan"
        description="See your monthly EMI, total interest, and full repayment at a glance."
      />
      <Controller control={control} name="loanAmount" render={({ field: { value, onChange } }) => (
        <AppInput label="Loan amount" placeholder="2500000" value={value} onChangeText={onChange} error={errors.loanAmount?.message} keyboardType="numeric" prefix="₹" />
      )} />
      <Controller control={control} name="interestRate" render={({ field: { value, onChange } }) => (
        <AppInput label="Annual interest rate" placeholder="8.5" value={value} onChangeText={onChange} error={errors.interestRate?.message} keyboardType="numeric" suffix="%" />
      )} />
      <Controller control={control} name="tenure" render={({ field: { value, onChange } }) => (
        <AppInput label={`Tenure (${tenureUnit})`} placeholder={tenureUnit === 'years' ? '20' : '240'} value={value} onChangeText={onChange} error={errors.tenure?.message} keyboardType="numeric" />
      )} />

      <View style={styles.unitRow}>
        {(['years', 'months'] as TenureUnit[]).map((unit) => (
          <Pressable key={unit} style={[styles.unitChip, { borderColor: colors.border, backgroundColor: tenureUnit === unit ? colors.primaryLight : colors.surface }, tenureUnit === unit && { borderColor: colors.primary }]} onPress={() => setTenureUnit(unit)}>
            <Text style={[typography.bodySmall, tenureUnit === unit && { color: colors.primary, fontWeight: '600' }]}>{unit.charAt(0).toUpperCase() + unit.slice(1)}</Text>
          </Pressable>
        ))}
      </View>

      <AppButton title="Calculate EMI" onPress={handleSubmit(onSubmit)} iconLeft="calculator-outline" fullWidth />
      <AppButton title="Clear" onPress={() => { reset(); setResult(null); }} variant="secondary" fullWidth />

      {result ? (
        <>
          <ToolResultHero
            icon="wallet-outline"
            label="Monthly EMI"
            value={formatRupee(result.monthlyEmi)}
            subtitle="Your fixed monthly payment"
          />
          <AppCard style={styles.resultCard}>
            <Text style={typography.h3}>Loan breakdown</Text>
            <Text style={typography.bodySmall}>
              EMI is your fixed monthly payment. Total payment includes principal plus interest over the full tenure.
            </Text>
            {[
              { label: 'Total interest', value: formatRupee(result.totalInterest) },
              { label: 'Total payment', value: formatRupee(result.totalPayment), highlight: true },
            ].map((row) => (
              <View key={row.label} style={[styles.resultRow, { borderBottomColor: colors.border }]}>
                <Text style={typography.bodySmall}>{row.label}</Text>
                <Text style={row.highlight ? [typography.h3, { color: colors.primary }] : typography.label}>{row.value}</Text>
              </View>
            ))}
          </AppCard>
        </>
      ) : null}
    </ToolScreenLayout>
  );
}

const styles = StyleSheet.create({
  unitRow: { flexDirection: 'row', gap: spacing.sm },
  unitChip: { flex: 1, alignItems: 'center', paddingVertical: spacing.sm, borderRadius: 16, borderWidth: 1 },
  resultCard: { gap: spacing.md },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: StyleSheet.hairlineWidth },
});
