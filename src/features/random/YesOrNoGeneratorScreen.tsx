import { useState } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppInput } from '@/components/ui/AppInput';
import { ToolScreenLayout } from '@/components/tools/ToolScreenLayout';
import { useToolTracking } from '@/hooks/useToolTracking';
import { useTheme, spacing, radius, createTypography } from '@/theme';
import { getYesNoMaybeAnswer, limitHistory, type YesNoMode } from '@/utils/randomTools';

export function YesOrNoGeneratorScreen() {
  const [question, setQuestion] = useState('');
  const [mode, setMode] = useState<YesNoMode>('yes-no');
  const [result, setResult] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const trackAction = useToolTracking('yes-or-no-generator');
  const { colors } = useTheme();
  const typography = createTypography(colors);

  const handleGetAnswer = () => {
    const answer = getYesNoMaybeAnswer(mode);
    setResult(answer);
    setHistory((prev) => limitHistory([...prev, answer]));
    trackAction(`Answer: ${answer}`);
  };

  const handleClear = () => {
    setQuestion('');
    setResult(null);
    setHistory([]);
  };

  return (
    <ToolScreenLayout
      title="Yes or No"
      subtitle="Get a quick random answer."
    >
      {/* Question Input */}
      <AppInput
        label="Question (Optional)"
        value={question}
        onChangeText={setQuestion}
        placeholder="Ask a question..."
        multiline
      />

      {/* Mode Selector */}
      <AppCard style={[styles.modeCard, { backgroundColor: colors.primaryLight }] as any}>
        <Text style={[typography.label, { color: colors.primary, marginBottom: spacing.sm }]}>
          Mode
        </Text>
        <View style={styles.modeButtons}>
          <AppButton
            title="Yes/No"
            onPress={() => setMode('yes-no')}
            variant={mode === 'yes-no' ? 'primary' : 'secondary'}
          />
          <AppButton
            title="Yes/No/Maybe"
            onPress={() => setMode('yes-no-maybe')}
            variant={mode === 'yes-no-maybe' ? 'primary' : 'secondary'}
          />
        </View>
      </AppCard>

      {/* Result */}
      {result && (
        <AppCard style={[styles.resultCard, { backgroundColor: colors.success + '15' }] as any}>
          {question && (
            <Text style={[typography.bodySmall, { color: colors.textSecondary, marginBottom: spacing.sm }]}>
              Q: {question}
            </Text>
          )}
          <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>Answer</Text>
          <Text
            style={[
              typography.h1,
              {
                color: colors.success,
                textAlign: 'center',
                marginTop: spacing.base,
              },
            ]}
          >
            {result}
          </Text>
        </AppCard>
      )}

      {/* History */}
      {history.length > 0 && (
        <AppCard>
          <Text style={[typography.label, { marginBottom: spacing.sm }]}>Last 10 Answers</Text>
          <View style={styles.historyContainer}>
            {history.map((answer, idx) => (
              <View key={idx} style={[styles.historyItem, { backgroundColor: colors.surface }] as any}>
                <Text style={[typography.caption, { color: colors.textSecondary }]}>
                  {answer}
                </Text>
              </View>
            ))}
          </View>
        </AppCard>
      )}

      <AppButton title="Get Answer" onPress={handleGetAnswer} fullWidth />
      {history.length > 0 && (
        <AppButton title="Reset" onPress={handleClear} variant="secondary" fullWidth />
      )}
    </ToolScreenLayout>
  );
}

const styles = StyleSheet.create({
  modeCard: {
    borderRadius: 16,
    padding: spacing.base,
  },
  modeButtons: {
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




