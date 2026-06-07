import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppInput } from '@/components/ui/AppInput';
import { ToolInsightBanner } from '@/components/tools/ToolInsightBanner';
import { ToolResultHero } from '@/components/tools/ToolResultHero';
import { ToolScreenLayout } from '@/components/tools/ToolScreenLayout';
import { useToolTracking } from '@/hooks/useToolTracking';
import { useTheme, spacing, createTypography } from '@/theme';
import { calculateBmi } from '@/utils/calculations';

const CATEGORIES = [
  { range: '< 18.5', label: 'Underweight', color: '#3B82F6' },
  { range: '18.5 – 24.9', label: 'Normal', color: '#16A34A' },
  { range: '25 – 29.9', label: 'Overweight', color: '#F59E0B' },
  { range: '30+', label: 'Obese', color: '#DC2626' },
];

export function BmiCalculatorScreen() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ReturnType<typeof calculateBmi> | null>(null);
  const trackAction = useToolTracking('bmi-calculator');
  const { colors } = useTheme();
  const typography = createTypography(colors);

  const calculate = () => {
    const w = Number(weight);
    const h = Number(height);
    if (!w || w <= 0 || !h || h <= 0) {
      setError('Enter valid weight and height.');
      return;
    }
    setError(null);
    const res = calculateBmi(w, h);
    setResult(res);
    trackAction(`BMI ${res.bmi.toFixed(1)}`);
  };

  const activeCategory = result
    ? CATEGORIES.find((c) => c.label === result.category) ?? CATEGORIES[1]
    : null;

  return (
    <ToolScreenLayout title="BMI Calculator" subtitle="Body mass index check">
      <ToolInsightBanner
        icon="fitness-outline"
        title="Know your range"
        description="Enter weight in kg and height in cm to get your BMI category instantly."
      />
      <AppInput label="Weight" value={weight} onChangeText={setWeight} keyboardType="numeric" suffix="kg" placeholder="70" error={error ?? undefined} />
      <AppInput label="Height" value={height} onChangeText={setHeight} keyboardType="numeric" suffix="cm" placeholder="175" />
      <AppButton title="Calculate BMI" onPress={calculate} fullWidth iconLeft="fitness-outline" />
      <AppButton title="Clear" onPress={() => { setWeight(''); setHeight(''); setResult(null); setError(null); }} variant="secondary" fullWidth />

      {result && activeCategory ? (
        <>
          <ToolResultHero
            icon="body-outline"
            label="Your BMI"
            value={result.bmi.toFixed(1)}
            subtitle={result.category}
          />
          <Text style={[typography.bodySmall, styles.disclaimer]}>
            This is a general estimate and not medical advice.
          </Text>
          <AppCard style={styles.categories}>
            <Text style={typography.label}>BMI categories</Text>
            {CATEGORIES.map((cat) => (
              <View
                key={cat.label}
                style={[
                  styles.catRow,
                  { borderBottomColor: colors.border },
                  cat.label === result.category && { backgroundColor: colors.primaryLight, borderRadius: 12, marginHorizontal: -8, paddingHorizontal: 8 },
                ]}
              >
                <View style={[styles.dot, { backgroundColor: cat.color }]} />
                <Text style={typography.bodySmall}>{cat.range}</Text>
                <Text style={[typography.label, cat.label === result.category && { color: colors.primary }]}>
                  {cat.label}
                </Text>
              </View>
            ))}
          </AppCard>
        </>
      ) : null}
    </ToolScreenLayout>
  );
}

const styles = StyleSheet.create({
  disclaimer: { textAlign: 'center' },
  categories: { gap: spacing.sm },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
});
