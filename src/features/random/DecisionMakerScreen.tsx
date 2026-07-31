import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppInput } from '@/components/ui/AppInput';
import { ToolScreenLayout } from '@/components/tools/ToolScreenLayout';
import { useToolTracking } from '@/hooks/useToolTracking';
import { useTheme, spacing, radius, createTypography } from '@/theme';
import { getDecisionAnswer, limitHistory, type DecisionMode } from '@/utils/randomTools';

export function DecisionMakerScreen() {
  const [question, setQuestion] = useState('');
  const [mode, setMode] = useState<DecisionMode>('yes-no');
  const [decision, setDecision] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const trackAction = useToolTracking('decision-maker');
  const { colors } = useTheme();
  const typography = createTypography(colors);

  const modes: { id: DecisionMode; label: string }[] = [
    { id: 'yes-no', label: 'Yes/No' },
    { id: 'yes-no-maybe', label: 'Yes/No/Maybe' },
    { id: 'do-it-wait', label: 'Do It/Wait' },
    { id: 'agree-disagree', label: 'Agree/Disagree' },
    { id: 'go-stop', label: 'Go/Stop' },
  ];

  const handleDecide = () => {
    const result = getDecisionAnswer(mode);
    setDecision(result);
    setHistory((prev) => limitHistory([...prev, result]));
    trackAction(`Decision: ${result}`);
  };

  const handleReset = () => {
    setQuestion('');
    setDecision(null);
    setHistory([]);
  };

  return (
    <ToolScreenLayout
      title="Decision Maker"
      subtitle="Make quick random decisions."
    >
      <AppInput
        label="Question (Optional)"
        value={question}
        onChangeText={setQuestion}
        multiline
        placeholder="Ask a question..."
      />

      {/* Mode Selector */}
      <AppCard style={{ backgroundColor: colors.surface, borderRadius: 16, padding: spacing.base, borderWidth: 1, borderColor: colors.border } as any}>
        <Text style={[typography.label, { marginBottom: spacing.sm }]}>Decision Mode</Text>
        <View style={styles.modesGrid}>
          {modes.map((m) => (
            <AppButton
              key={m.id}
              title={m.label}
              onPress={() => setMode(m.id)}
              variant={mode === m.id ? 'primary' : 'secondary'}
            />
          ))}
        </View>
      </AppCard>

      {/* Decision Result */}
      {decision && (
        <AppCard style={[styles.resultCard, { backgroundColor: colors.primaryLight }] as any}>
          {question && (
            <Text style={[typography.bodySmall, { color: colors.textSecondary, marginBottom: spacing.sm }]}>
              Q: {question}
            </Text>
          )}
          <Text style={[typography.bodySmall, { color: colors.primary }]}>Decision</Text>
          <Text
            style={[
              typography.h1,
              {
                color: colors.primary,
                textAlign: 'center',
                marginTop: spacing.sm,
              },
            ]}
          >
            {decision}
          </Text>
        </AppCard>
      )}

      {/* History */}
      {history.length > 0 && (
        <AppCard>
          <Text style={[typography.label, { marginBottom: spacing.sm }]}>Last 10 Decisions</Text>
          <View style={styles.historyContainer}>
            {history.map((dec, idx) => (
              <View key={idx} style={[styles.historyItem, { backgroundColor: colors.surface }] as any}>
                <Text style={[typography.caption, { color: colors.textSecondary }]}>
                  {dec}
                </Text>
              </View>
            ))}
          </View>
        </AppCard>
      )}

      <AppButton title="Decide" onPress={handleDecide} fullWidth />
      {history.length > 0 && (
        <AppButton title="Reset" onPress={handleReset} variant="secondary" fullWidth />
      )}
    </ToolScreenLayout>
  );
}

const styles = StyleSheet.create({
  modesCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: spacing.base,
  },
  modesGrid: {
    gap: spacing.sm,
  },
  resultCard: {
    borderRadius: 16,
    padding: spacing.base,
  },
  historyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  historyItem: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
});




