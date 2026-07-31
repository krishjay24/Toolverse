import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { ToolScreenLayout } from '@/components/tools/ToolScreenLayout';
import { useToolTracking } from '@/hooks/useToolTracking';
import { useTheme, spacing, radius, createTypography } from '@/theme';
import { calculateDiscount } from '@/utils/calculations';
import { formatRupee } from '@/utils/formatters';

function cleanNumber(value: string): number {
  const numeric = value.replace(/[^0-9.]/g, '');
  return Number(numeric) || 0;
}

export function DiscountCalculatorScreen() {
  const [originalPriceText, setOriginalPriceText] = useState('1000');
  const [discountPercentText, setDiscountPercentText] = useState('20');
  const [error, setError] = useState<string | null>(null);

  const trackAction = useToolTracking('discount-calculator');
  const { colors } = useTheme();
  const typography = createTypography(colors);

  const originalPrice = cleanNumber(originalPriceText);
  const discountPercent = cleanNumber(discountPercentText);

  const result = useMemo(() => {
    if (originalPrice > 0 && discountPercent >= 0 && discountPercent <= 100) {
      return calculateDiscount(originalPrice, discountPercent);
    }
    return null;
  }, [originalPrice, discountPercent]);

  const handleCalculate = () => {
    // Validation
    if (!originalPriceText.trim() || !discountPercentText.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    const price = cleanNumber(originalPriceText);
    const discount = cleanNumber(discountPercentText);

    if (price <= 0) {
      setError('Original price must be greater than 0.');
      return;
    }

    if (discount < 0 || discount > 100) {
      setError('Discount percentage must be between 0 and 100.');
      return;
    }

    setError(null);
    if (result) {
      trackAction(`Discount: ${discount}%, Saved: ${formatRupee(result.savings)}`);
    }
  };

  const handleClear = () => {
    setOriginalPriceText('1000');
    setDiscountPercentText('20');
    setError(null);
  };

  return (
    <ToolScreenLayout title="Discount Calculator" subtitle="Calculate final price after discount">
      <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <AppInput
          label="Original Price"
          value={originalPriceText}
          onChangeText={setOriginalPriceText}
          keyboardType="numeric"
          prefix="₹"
          placeholder="1000"
          helperText="Enter the original price"
          error={error ?? undefined}
        />

        <AppInput
          label="Discount Percentage"
          value={discountPercentText}
          onChangeText={setDiscountPercentText}
          keyboardType="numeric"
          suffix="%"
          placeholder="20"
          helperText="Enter discount from 0 to 100"
          error={error ? undefined : undefined}
        />
      </View>

      <AppButton title="Calculate" onPress={handleCalculate} fullWidth iconLeft="calculator-outline" />

      {result && error === null ? (
        <>
          {/* Main Result Card - Final Price */}
          <View style={[styles.resultCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.resultTopBar, { backgroundColor: colors.primary }]} />
            <View style={styles.resultContent}>
              <Text style={[typography.bodySmall, { color: colors.textSecondary, textAlign: 'center' }]}>
                Final Price
              </Text>
              <Text style={[styles.finalPrice, { color: colors.primary }]}>
                {formatRupee(result.finalPrice)}
              </Text>
              <Text
                style={[typography.caption, { color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xs }]}
              >
                After {result.discountPercent}% discount
              </Text>
            </View>
          </View>

          {/* Breakdown Cards */}
          <View style={styles.breakdownContainer}>
            <View style={[styles.breakdownCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[typography.caption, { color: colors.textSecondary, marginBottom: spacing.xs }]}>
                Discount Amount
              </Text>
              <Text style={[styles.breakdownValue, { color: '#F59E0B' }]}>
                {formatRupee(result.discountAmount)}
              </Text>
            </View>

            <View style={[styles.breakdownCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[typography.caption, { color: colors.textSecondary, marginBottom: spacing.xs }]}>
                You Save
              </Text>
              <Text style={[styles.breakdownValue, { color: '#16A34A' }]}>
                {formatRupee(result.savings)}
              </Text>
            </View>
          </View>

          {/* Summary Card */}
          <View style={[styles.summaryCard, { backgroundColor: colors.primaryLight }]}>
            <View style={styles.summaryRow}>
              <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>Original Price</Text>
              <Text style={[typography.label, { color: colors.textPrimary }]}>
                {formatRupee(result.originalPrice)}
              </Text>
            </View>
            <View
              style={[
                styles.summaryRow,
                { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm, marginTop: spacing.sm },
              ]}
            >
              <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>Final Price</Text>
              <Text style={[typography.label, { color: colors.primary, fontWeight: '700' }]}>
                {formatRupee(result.finalPrice)}
              </Text>
            </View>
          </View>

          {/* Disclaimer */}
          <View style={[styles.disclaimerCard, { backgroundColor: colors.border + '15' }]}>
            <Text style={[typography.caption, { color: colors.textSecondary, fontStyle: 'italic' }]}>
              Prices are calculated based on the discount percentage applied to the original price. Additional taxes or fees may apply.
            </Text>
          </View>

          <AppButton title="Clear" onPress={handleClear} variant="secondary" fullWidth />
        </>
      ) : null}
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
  resultTopBar: {
    height: 4,
  },
  resultContent: {
    padding: spacing.base,
    alignItems: 'center',
    gap: spacing.xs,
  },
  finalPrice: {
    fontSize: 42,
    fontWeight: '800',
    lineHeight: 46,
    letterSpacing: -0.5,
  },
  breakdownContainer: {
    flexDirection: 'row',
    gap: spacing.base,
  },
  breakdownCard: {
    flex: 1,
    borderRadius: radius.card,
    borderWidth: 1,
    padding: spacing.base,
  },
  breakdownValue: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  summaryCard: {
    borderRadius: radius.card,
    padding: spacing.base,
    gap: spacing.base,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  disclaimerCard: {
    borderRadius: radius.card,
    padding: spacing.base,
  },
});
