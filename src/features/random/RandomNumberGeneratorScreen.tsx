import { useMemo, useState } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppInput } from '@/components/ui/AppInput';
import { ToolScreenLayout } from '@/components/tools/ToolScreenLayout';
import { useToolTracking } from '@/hooks/useToolTracking';
import { useTheme, spacing, radius, createTypography } from '@/theme';
import { generateRandomNumbers } from '@/utils/randomTools';

function cleanNumber(input: string): number {
  const cleaned = input.replace(/[^\d.-]/g, '');
  return parseInt(cleaned, 10) || 0;
}

export function RandomNumberGeneratorScreen() {
  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');
  const [count, setCount] = useState('5');
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const [result, setResult] = useState<number[] | null>(null);
  const [error, setError] = useState('');

  const trackAction = useToolTracking('random-number-generator');
  const { colors } = useTheme();
  const typography = createTypography(colors);

  const handleGenerate = () => {
    setError('');
    const minNum = cleanNumber(min);
    const maxNum = cleanNumber(max);
    const countNum = cleanNumber(count);

    if (minNum === maxNum) {
      setError('Min and Max must be different.');
      return;
    }

    if (countNum < 1 || countNum > 1000) {
      setError('Quantity must be between 1 and 1000.');
      return;
    }

    const range = Math.abs(maxNum - minNum) + 1;
    if (!allowDuplicates && countNum > range) {
      setError(`Cannot generate ${countNum} unique numbers in range ${Math.min(minNum, maxNum)}-${Math.max(minNum, maxNum)}.`);
      return;
    }

    const numbers = generateRandomNumbers(minNum, maxNum, countNum, allowDuplicates);
    setResult(numbers);
    trackAction(`Generated ${countNum} numbers from ${Math.min(minNum, maxNum)}-${Math.max(minNum, maxNum)}`);
  };

  const handleClear = () => {
    setResult(null);
    setError('');
  };

  const resultText = result?.join(', ') || '';

  return (
    <ToolScreenLayout
      title="Random Number"
      subtitle="Generate random numbers in a range."
    >
      <AppCard
        style={{
          borderWidth: 1,
          borderRadius: radius.card,
          borderColor: colors.border,
          padding: spacing.base,
          gap: spacing.md,
          backgroundColor: colors.surface,
        }}
      >
        <AppInput
          label="Minimum"
          value={min}
          onChangeText={setMin}
          keyboardType="decimal-pad"
          placeholder="1"
        />
        <AppInput
          label="Maximum"
          value={max}
          onChangeText={setMax}
          keyboardType="decimal-pad"
          placeholder="100"
        />
        <AppInput
          label="Quantity"
          value={count}
          onChangeText={setCount}
          keyboardType="decimal-pad"
          placeholder="5"
        />
      </AppCard>

      {/* Duplicates Toggle */}
      <AppCard
        style={{
          backgroundColor: colors.primaryLight,
          borderRadius: radius.card,
          padding: spacing.base,
        }}
      >
        <Text style={[typography.label, { color: colors.primary, marginBottom: spacing.sm }]}>
          Allow Duplicates
        </Text>
        <View style={styles.toggleButtons}>
          <AppButton
            title="No"
            onPress={() => setAllowDuplicates(false)}
            variant={!allowDuplicates ? 'primary' : 'secondary'}
          />
          <AppButton
            title="Yes"
            onPress={() => setAllowDuplicates(true)}
            variant={allowDuplicates ? 'primary' : 'secondary'}
          />
        </View>
      </AppCard>

      {/* Error */}
      {error && (
        <AppCard
          style={{
            backgroundColor: colors.errorLight,
            borderRadius: radius.card,
            padding: spacing.base,
          }}
        >
          <Text style={[typography.bodySmall, { color: colors.error }]}>{error}</Text>
        </AppCard>
      )}

      {/* Result */}
      {result && (
        <AppCard
          style={{
            backgroundColor: colors.primaryLight,
            borderRadius: radius.card,
            padding: spacing.base,
          }}
        >
          <Text style={[typography.label, { color: colors.primary, marginBottom: spacing.sm }]}>
            Generated Numbers
          </Text>
          <Text style={[typography.body, { color: colors.primary, textAlign: 'center' }]}>
            {resultText}
          </Text>
        </AppCard>
      )}

      <AppButton title="Generate" onPress={handleGenerate} fullWidth />
      {result && (
        <AppButton title="Clear" onPress={handleClear} variant="secondary" fullWidth />
      )}
    </ToolScreenLayout>
  );
}

const styles = StyleSheet.create({
  inputCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: spacing.base,
    gap: spacing.md,
  },
  toggleCard: {
    borderRadius: 16,
    padding: spacing.base,
  },
  toggleButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  errorCard: {
    borderRadius: 16,
    padding: spacing.base,
  },
  resultCard: {
    borderRadius: 16,
    padding: spacing.base,
  },
});



