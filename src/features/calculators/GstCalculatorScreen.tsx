import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppInput } from '@/components/ui/AppInput';
import { ToolInsightBanner } from '@/components/tools/ToolInsightBanner';
import { ToolScreenLayout } from '@/components/tools/ToolScreenLayout';
import { useToolTracking } from '@/hooks/useToolTracking';
import { useTheme, spacing, createTypography } from '@/theme';
import { calculateGstExclusive, calculateGstInclusive } from '@/utils/calculations';
import { formatRupee } from '@/utils/formatters';

const GST_RATES = [5, 12, 18, 28];

type GstMode = 'exclusive' | 'inclusive';

export function GstCalculatorScreen() {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('18');
  const [mode, setMode] = useState<GstMode>('exclusive');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ReturnType<typeof calculateGstExclusive> | null>(null);
  const trackAction = useToolTracking('gst-calculator');
  const { colors } = useTheme();
  const typography = createTypography(colors);

  const calculate = () => {
    const value = Number(amount);
    const gstRate = Number(rate);
    if (!value || value <= 0) {
      setError('Enter a valid amount.');
      return;
    }
    if (gstRate < 0 || gstRate > 100) {
      setError('Enter a valid GST rate.');
      return;
    }
    setError(null);
    const res = mode === 'exclusive' ? calculateGstExclusive(value, gstRate) : calculateGstInclusive(value, gstRate);
    setResult(res);
    trackAction(`${gstRate}% GST`);
  };

  return (
    <ToolScreenLayout title="GST Calculator" subtitle="Inclusive & exclusive amounts">
      <ToolInsightBanner
        icon="receipt-outline"
        title="Indian GST made easy"
        description="Add GST to a base amount or extract GST from an inclusive price."
      />
      <View style={styles.modeRow}>
        {(['exclusive', 'inclusive'] as GstMode[]).map((m) => (
          <Pressable key={m} onPress={() => setMode(m)} style={[styles.modeChip, { borderColor: mode === m ? colors.primary : colors.border, backgroundColor: mode === m ? colors.primaryLight : colors.surface }]}>
            <Text style={[typography.bodySmall, mode === m && { color: colors.primary, fontWeight: '600' }]}>
              {m === 'exclusive' ? 'Add GST' : 'Remove GST'}
            </Text>
          </Pressable>
        ))}
      </View>
      <AppInput label="Amount" value={amount} onChangeText={setAmount} keyboardType="numeric" prefix="₹" placeholder="10000" error={error ?? undefined} />
      <Text style={typography.label}>GST rate</Text>
      <View style={styles.rateRow}>
        {GST_RATES.map((r) => (
          <AppButton key={r} title={`${r}%`} size="sm" variant={rate === String(r) ? 'primary' : 'secondary'} onPress={() => setRate(String(r))} />
        ))}
      </View>
      <AppInput label="Custom rate (%)" value={rate} onChangeText={setRate} keyboardType="numeric" suffix="%" />
      <AppButton title="Calculate GST" onPress={calculate} fullWidth iconLeft="receipt-outline" />

      {result ? (
        <AppCard style={styles.result}>
          <View style={[styles.totalHighlight, { backgroundColor: colors.primaryLight }]}>
            <Text style={typography.bodySmall}>Total amount</Text>
            <Text style={[typography.h1, { color: colors.primary }]}>{formatRupee(result.totalAmount)}</Text>
          </View>
          <Row label="Base amount" value={formatRupee(result.baseAmount)} typography={typography} border={colors.border} />
          <Row label="GST amount" value={formatRupee(result.gstAmount)} typography={typography} border={colors.border} />
        </AppCard>
      ) : null}
    </ToolScreenLayout>
  );
}

function Row({
  label,
  value,
  typography,
  border,
}: {
  label: string;
  value: string;
  typography: ReturnType<typeof createTypography>;
  border: string;
}) {
  return (
    <View style={[styles.row, { borderBottomColor: border }]}>
      <Text style={typography.bodySmall}>{label}</Text>
      <Text style={typography.label}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  modeRow: { flexDirection: 'row', gap: spacing.sm },
  modeChip: { flex: 1, alignItems: 'center', paddingVertical: spacing.sm, borderRadius: 16, borderWidth: 1 },
  rateRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  result: { gap: spacing.sm },
  totalHighlight: { alignItems: 'center', borderRadius: 16, padding: spacing.base, gap: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: StyleSheet.hairlineWidth },
});
