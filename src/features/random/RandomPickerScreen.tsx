import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppInput } from '@/components/ui/AppInput';
import { ToolScreenLayout } from '@/components/tools/ToolScreenLayout';
import { useToolTracking } from '@/hooks/useToolTracking';
import { useTheme, spacing, radius, createTypography } from '@/theme';
import { parseLines, pickRandomItem, limitHistory } from '@/utils/randomTools';

export function RandomPickerScreen() {
  const [itemsText, setItemsText] = useState('');
  const [picked, setPicked] = useState<string | null>(null);
  const [removePicked, setRemovePicked] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [error, setError] = useState('');

  const trackAction = useToolTracking('random-picker');
  const { colors } = useTheme();
  const typography = createTypography(colors);

  const items = useMemo(() => parseLines(itemsText), [itemsText]);

  const handlePick = () => {
    setError('');
    if (items.length < 2) {
      setError('Add at least 2 items.');
      return;
    }

    const picked = pickRandomItem(items);
    if (!picked) {
      setError('Could not pick an item.');
      return;
    }

    setPicked(picked);
    setHistory((prev) => limitHistory([...prev, picked]));

    if (removePicked) {
      setItemsText((prev) =>
        parseLines(prev)
          .filter((item) => item !== picked)
          .join('\n')
      );
    }

    trackAction(`Picked: ${picked}`);
  };

  const handleClear = () => {
    setItemsText('');
    setPicked(null);
    setHistory([]);
    setError('');
  };

  const remaining = items.length;

  return (
    <ToolScreenLayout
      title="Random Picker"
      subtitle="Pick one item from your list."
    >
      <AppInput
        label="Items (one per line)"
        value={itemsText}
        onChangeText={setItemsText}
        multiline
        placeholder="Pizza&#10;Biryani&#10;Dosa&#10;Burger"
      />

      {/* Remove Picked Toggle */}
      <AppCard style={[styles.toggleCard, { backgroundColor: colors.primaryLight }] as any}>
        <Text style={[typography.label, { color: colors.primary, marginBottom: spacing.sm }]}>
          Remove Picked Item
        </Text>
        <View style={styles.toggleButtons}>
          <AppButton
            title="No"
            onPress={() => setRemovePicked(false)}
            variant={!removePicked ? 'primary' : 'secondary'}
          />
          <AppButton
            title="Yes"
            onPress={() => setRemovePicked(true)}
            variant={removePicked ? 'primary' : 'secondary'}
          />
        </View>
      </AppCard>

      {/* Error */}
      {error && (
        <AppCard style={[styles.errorCard, { backgroundColor: colors.errorLight }] as any}>
          <Text style={[typography.bodySmall, { color: colors.error }]}>{error}</Text>
        </AppCard>
      )}

      {/* Picked Result */}
      {picked && (
        <AppCard style={[styles.resultCard, { backgroundColor: colors.successLight }] as any}>
          <Text style={[typography.bodySmall, { color: colors.success }]}>Picked Item</Text>
          <Text
            style={[
              typography.h1,
              {
                color: colors.success,
                marginTop: spacing.sm,
                textAlign: 'center',
              },
            ]}
          >
            {picked}
          </Text>
        </AppCard>
      )}

      {/* Stats */}
      {remaining > 0 && (
        <AppCard style={[styles.statsCard, { backgroundColor: colors.surface }] as any}>
          <Text style={[typography.label, { textAlign: 'center' }]}>
            {remaining} item{remaining !== 1 ? 's' : ''} remaining
          </Text>
        </AppCard>
      )}

      {/* History */}
      {history.length > 0 && (
        <AppCard>
          <Text style={[typography.label, { marginBottom: spacing.sm }]}>Pick History</Text>
          {history.map((item, idx) => (
            <Text key={idx} style={[typography.bodySmall, { marginBottom: spacing.xs }]}>
              {idx + 1}. {item}
            </Text>
          ))}
        </AppCard>
      )}

      <AppButton
        title="Pick Random"
        onPress={handlePick}
        disabled={remaining < 2}
        fullWidth
      />
      {itemsText && (
        <AppButton title="Clear" onPress={handleClear} variant="secondary" fullWidth />
      )}
    </ToolScreenLayout>
  );
}

const styles = StyleSheet.create({
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
  statsCard: {
    borderRadius: 16,
    padding: spacing.base,
  },
});




