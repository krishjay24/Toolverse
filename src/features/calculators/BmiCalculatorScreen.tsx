import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { ToolScreenLayout } from '@/components/tools/ToolScreenLayout';
import { useToolTracking } from '@/hooks/useToolTracking';
import { useTheme, spacing, radius, createTypography } from '@/theme';
import { calculateBmi } from '@/utils/calculations';

const CATEGORIES = [
  { range: '< 18.5', label: 'Underweight', color: '#3B82F6', segment: 0.25 },
  { range: '18.5 – 24.9', label: 'Normal', color: '#16A34A', segment: 0.2 },
  { range: '25 – 29.9', label: 'Overweight', color: '#F59E0B', segment: 0.2 },
  { range: '≥ 30', label: 'Obese', color: '#DC2626', segment: 0.35 },
];

function getBmiMarkerPosition(bmi: number): number {
  if (bmi < 18.5) return Math.min((bmi / 18.5) * 25, 24);
  if (bmi < 25) return 25 + ((bmi - 18.5) / 6.5) * 20;
  if (bmi < 30) return 45 + ((bmi - 25) / 5) * 20;
  return Math.min(65 + ((bmi - 30) / 10) * 35, 98);
}

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

  const markerPos = result ? getBmiMarkerPosition(result.bmi) : null;

  return (
    <ToolScreenLayout title="BMI Calculator" subtitle="Body mass index check">
      {/* Input cards */}
      <View style={[styles.inputCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[typography.label, { color: colors.textSecondary }]}>Height (cm)</Text>
        <AppInput
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
          suffix="cm"
          placeholder="170"
          error={error ?? undefined}
        />
      </View>

      <View style={[styles.inputCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[typography.label, { color: colors.textSecondary }]}>Weight (kg)</Text>
        <AppInput
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
          suffix="kg"
          placeholder="70"
        />
      </View>

      <AppButton title="Calculate BMI" onPress={calculate} fullWidth iconLeft="fitness-outline" />

      {result && activeCategory ? (
        <>
          {/* Result hero */}
          <View style={[styles.resultCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.resultTopBar, { backgroundColor: colors.primary }]} />
            <View style={styles.resultContent}>
              <Text style={[typography.bodySmall, { color: colors.textSecondary, textAlign: 'center' }]}>
                Your BMI is
              </Text>
              <View style={styles.bmiValueRow}>
                <Text style={[styles.bmiValue, { color: colors.primary }]}>
                  {result.bmi.toFixed(1)}
                </Text>
                <Text style={[typography.bodySmall, { color: colors.textSecondary, alignSelf: 'flex-end', marginBottom: 4 }]}>
                  {' '}kg/m²
                </Text>
              </View>
              <View style={[styles.categoryPill, { backgroundColor: activeCategory.color + '20' }]}>
                <View style={[styles.categoryDot, { backgroundColor: activeCategory.color }]} />
                <Text style={[typography.label, { color: activeCategory.color }]}>
                  {result.category}
                </Text>
              </View>

              {/* BMI scale bar */}
              <View style={styles.scaleContainer}>
                <View style={styles.scaleBar}>
                  {CATEGORIES.map((cat) => (
                    <View
                      key={cat.label}
                      style={[styles.scaleSegment, { flex: cat.segment, backgroundColor: cat.color }]}
                    />
                  ))}
                  {markerPos !== null ? (
                    <View
                      style={[
                        styles.marker,
                        { left: `${markerPos}%` as any, borderColor: colors.surface },
                      ]}
                    />
                  ) : null}
                </View>
                <View style={styles.scaleLabels}>
                  <Text style={[typography.caption, { color: colors.textSecondary }]}>18.5</Text>
                  <Text style={[typography.caption, { color: colors.textSecondary }]}>25</Text>
                  <Text style={[typography.caption, { color: colors.textSecondary }]}>30</Text>
                </View>
              </View>

              <Text style={[typography.bodySmall, { color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm }]}>
                Maintaining a healthy BMI supports overall wellness. Combine balanced nutrition with regular activity.
              </Text>
              <Text style={[typography.caption, { color: colors.textSecondary, textAlign: 'center', fontStyle: 'italic' }]}>
                For reference only. Consult a health professional for clinical advice.
              </Text>
            </View>
          </View>

          {/* Categories reference */}
          <View style={[styles.refCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[typography.label, { marginBottom: spacing.sm }]}>BMI Categories</Text>
            {CATEGORIES.map((cat) => (
              <View
                key={cat.label}
                style={[
                  styles.catRow,
                  { borderBottomColor: colors.border },
                  cat.label === result.category && {
                    backgroundColor: cat.color + '12',
                    borderRadius: 10,
                    marginHorizontal: -spacing.sm,
                    paddingHorizontal: spacing.sm,
                  },
                ]}
              >
                <View style={[styles.catDot, { backgroundColor: cat.color }]} />
                <Text style={typography.bodySmall}>{cat.range}</Text>
                <Text style={[typography.label, { marginLeft: 'auto' as any, color: cat.label === result.category ? cat.color : colors.textPrimary }]}>
                  {cat.label}
                </Text>
              </View>
            ))}
          </View>

          <AppButton
            title="Clear"
            onPress={() => { setWeight(''); setHeight(''); setResult(null); setError(null); }}
            variant="secondary"
            fullWidth
          />
        </>
      ) : null}
    </ToolScreenLayout>
  );
}

const styles = StyleSheet.create({
  inputCard: {
    borderRadius: radius.card,
    borderWidth: 1,
    padding: spacing.base,
    gap: spacing.sm,
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
    gap: spacing.sm,
  },
  bmiValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  bmiValue: {
    fontSize: 48,
    fontWeight: '800',
    lineHeight: 52,
    letterSpacing: -1,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xs,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  scaleContainer: {
    width: '100%',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  scaleBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'visible',
    position: 'relative',
  },
  scaleSegment: {
    height: '100%',
  },
  marker: {
    position: 'absolute',
    top: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    marginLeft: -8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
  },
  refCard: {
    borderRadius: radius.card,
    borderWidth: 1,
    padding: spacing.base,
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  catDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
