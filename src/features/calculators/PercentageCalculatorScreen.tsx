import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppInput } from '@/components/ui/AppInput';
import { ToolInsightBanner } from '@/components/tools/ToolInsightBanner';
import { ToolResultHero } from '@/components/tools/ToolResultHero';
import { ToolScreenLayout } from '@/components/tools/ToolScreenLayout';
import { useToolTracking } from '@/hooks/useToolTracking';
import { useTheme, spacing, createTypography } from '@/theme';
import { calculatePercentage, PercentageMode } from '@/utils/calculations';
import { formatNumber } from '@/utils/formatters';

import type { Ionicons } from '@expo/vector-icons';

const MODES: { id: PercentageMode; label: string; hint: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'of', label: 'X% of Y', hint: 'A = percent, B = number', icon: 'calculator-outline' },
  { id: 'isWhatPercent', label: 'X is % of Y', hint: 'What % is A of B?', icon: 'help-circle-outline' },
  { id: 'increase', label: 'Increase', hint: 'Increase A by B%', icon: 'trending-up-outline' },
  { id: 'decrease', label: 'Decrease', hint: 'Decrease A by B%', icon: 'trending-down-outline' },
];

export function PercentageCalculatorScreen() {
  const [mode, setMode] = useState<PercentageMode>('of');
  const [valueA, setValueA] = useState('');
  const [valueB, setValueB] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const trackAction = useToolTracking('percentage-calculator');
  const { colors } = useTheme();
  const typography = createTypography(colors);

  const calculate = () => {
    const a = Number(valueA);
    const b = Number(valueB);
    if (Number.isNaN(a) || Number.isNaN(b)) {
      return;
    }
    const res = calculatePercentage(mode, a, b);
    setResult(res);
    trackAction(`${formatNumber(res)}`);
  };

  const activeMode = MODES.find((m) => m.id === mode)!;
  const resultText = result !== null
    ? mode === 'isWhatPercent' ? `${formatNumber(result)}%` : formatNumber(result)
    : '';

  return (
    <ToolScreenLayout title="Percentage Calculator" subtitle="Quick percentage math">
      <ToolInsightBanner
        icon="analytics-outline"
        title="Four modes, one tool"
        description="Switch calculation type below and enter your two values."
      />
      <View style={styles.modes}>
        {MODES.map((m) => (
          <Pressable key={m.id} onPress={() => { setMode(m.id); setResult(null); }} style={[styles.modeChip, { borderColor: mode === m.id ? colors.primary : colors.border, backgroundColor: mode === m.id ? colors.primaryLight : colors.surface }]}>
            <Text style={[typography.caption, mode === m.id && { color: colors.primary, fontWeight: '600' }]}>{m.label}</Text>
          </Pressable>
        ))}
      </View>
      <AppCard style={styles.hintCard}>
        <Text style={typography.label}>{activeMode.label}</Text>
        <Text style={typography.bodySmall}>{activeMode.hint}</Text>
      </AppCard>
      <AppInput label="Value A" value={valueA} onChangeText={setValueA} keyboardType="numeric" placeholder="Enter first value" />
      <AppInput label="Value B" value={valueB} onChangeText={setValueB} keyboardType="numeric" placeholder="Enter second value" />
      <AppButton title="Calculate" onPress={calculate} fullWidth iconLeft="analytics-outline" />

      {result !== null ? (
        <ToolResultHero
          icon={activeMode.icon}
          label="Result"
          value={resultText}
        />
      ) : null}
    </ToolScreenLayout>
  );
}

const styles = StyleSheet.create({
  modes: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  modeChip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  hintCard: { gap: 4 },
});
