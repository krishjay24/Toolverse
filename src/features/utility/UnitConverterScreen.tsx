import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppInput } from '@/components/ui/AppInput';
import { ToolInsightBanner } from '@/components/tools/ToolInsightBanner';
import { ToolResultHero } from '@/components/tools/ToolResultHero';
import { ToolScreenLayout } from '@/components/tools/ToolScreenLayout';
import { useToolTracking } from '@/hooks/useToolTracking';
import { useTheme, spacing, createTypography } from '@/theme';
import {
  convertLength,
  convertTemperature,
  convertWeight,
  LengthUnit,
  TempUnit,
  WeightUnit,
} from '@/utils/calculations';
import { formatNumber } from '@/utils/formatters';

type ConverterType = 'length' | 'weight' | 'temperature';

const LENGTH_UNITS: LengthUnit[] = ['m', 'km', 'cm', 'ft', 'mile'];
const WEIGHT_UNITS: WeightUnit[] = ['kg', 'g', 'lb', 'oz'];
const TEMP_UNITS: TempUnit[] = ['c', 'f', 'k'];

const TYPE_META: Record<ConverterType, { label: string; icon: keyof typeof Ionicons.glyphMap }> = {
  length: { label: 'Length', icon: 'resize-outline' },
  weight: { label: 'Weight', icon: 'barbell-outline' },
  temperature: { label: 'Temperature', icon: 'thermometer-outline' },
};

export function UnitConverterScreen() {
  const [type, setType] = useState<ConverterType>('length');
  const [value, setValue] = useState('1');
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('km');
  const [result, setResult] = useState<number | null>(null);
  const trackAction = useToolTracking('unit-converter');
  const { colors } = useTheme();
  const typography = createTypography(colors);

  const units =
    type === 'length' ? LENGTH_UNITS : type === 'weight' ? WEIGHT_UNITS : TEMP_UNITS;

  const switchType = (t: ConverterType) => {
    setType(t);
    if (t === 'length') {
      setFromUnit('m');
      setToUnit('km');
    } else if (t === 'weight') {
      setFromUnit('kg');
      setToUnit('g');
    } else {
      setFromUnit('c');
      setToUnit('f');
    }
    setResult(null);
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setResult(null);
  };

  const convert = () => {
    const num = Number(value);
    if (Number.isNaN(num)) {
      return;
    }
    let res = 0;
    if (type === 'length') {
      res = convertLength(num, fromUnit as LengthUnit, toUnit as LengthUnit);
    } else if (type === 'weight') {
      res = convertWeight(num, fromUnit as WeightUnit, toUnit as WeightUnit);
    } else {
      res = convertTemperature(num, fromUnit as TempUnit, toUnit as TempUnit);
    }
    setResult(res);
    trackAction(`${fromUnit} → ${toUnit}`);
  };

  const handleClear = () => {
    setValue('1');
    setResult(null);
  };

  return (
    <ToolScreenLayout title="Unit Converter" subtitle="Length, weight & temperature">
      <ToolInsightBanner
        icon="swap-horizontal-outline"
        title="Quick conversions"
        description="Pick a category, enter a value, and get an instant result."
      />
      <View style={styles.typeRow}>
        {(Object.keys(TYPE_META) as ConverterType[]).map((t) => (
          <Pressable
            key={t}
            onPress={() => switchType(t)}
            style={[
              styles.typeChip,
              {
                borderColor: type === t ? colors.primary : colors.border,
                backgroundColor: type === t ? colors.primaryLight : colors.surface,
              },
            ]}
          >
            <Ionicons
              name={TYPE_META[t].icon}
              size={16}
              color={type === t ? colors.primary : colors.textSecondary}
            />
            <Text style={[typography.bodySmall, type === t && { color: colors.primary, fontWeight: '600' }]}>
              {TYPE_META[t].label}
            </Text>
          </Pressable>
        ))}
      </View>

      <AppInput label="Value" value={value} onChangeText={setValue} keyboardType="numeric" />

      <AppCard style={styles.converterCard}>
        <Text style={typography.label}>From</Text>
        <View style={styles.units}>
          {units.map((u) => (
            <AppButton
              key={u}
              title={u.toUpperCase()}
              size="sm"
              variant={fromUnit === u ? 'primary' : 'secondary'}
              onPress={() => setFromUnit(u)}
            />
          ))}
        </View>

        <Pressable onPress={swapUnits} style={[styles.swapBtn, { backgroundColor: colors.primaryLight }]}>
          <Ionicons name="swap-vertical" size={22} color={colors.primary} />
        </Pressable>

        <Text style={typography.label}>To</Text>
        <View style={styles.units}>
          {units.map((u) => (
            <AppButton
              key={u}
              title={u.toUpperCase()}
              size="sm"
              variant={toUnit === u ? 'primary' : 'secondary'}
              onPress={() => setToUnit(u)}
            />
          ))}
        </View>
      </AppCard>

      <AppButton title="Convert" onPress={convert} fullWidth iconLeft="swap-horizontal-outline" />
      <AppButton title="Clear" onPress={handleClear} variant="secondary" fullWidth />

      {result !== null ? (
        <ToolResultHero
          icon="checkmark-circle-outline"
          label={`${value} ${fromUnit.toUpperCase()} equals`}
          value={`${formatNumber(result, 4)} ${toUnit.toUpperCase()}`}
        />
      ) : null}
    </ToolScreenLayout>
  );
}

const styles = StyleSheet.create({
  typeRow: { flexDirection: 'row', gap: spacing.sm },
  typeChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.sm,
    borderRadius: 16,
    borderWidth: 1,
  },
  converterCard: { gap: spacing.sm },
  units: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  swapBtn: {
    alignSelf: 'center',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
