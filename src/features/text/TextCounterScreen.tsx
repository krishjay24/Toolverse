import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppInput } from '@/components/ui/AppInput';
import { StatGrid } from '@/components/tools/StatGrid';
import { ToolInsightBanner } from '@/components/tools/ToolInsightBanner';
import { ToolScreenLayout } from '@/components/tools/ToolScreenLayout';
import { useToolTracking } from '@/hooks/useToolTracking';
import { useTheme, spacing, createTypography } from '@/theme';
import { analyzeText } from '@/utils/calculations';

const STAT_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Characters: 'text-outline',
  'Without spaces': 'remove-outline',
  Words: 'book-outline',
  Lines: 'reorder-four-outline',
  Sentences: 'chatbubble-outline',
  Paragraphs: 'reader-outline',
};

export function TextCounterScreen() {
  const [text, setText] = useState('');
  const trackAction = useToolTracking('text-counter');
  const { colors } = useTheme();
  const typography = createTypography(colors);
  const stats = useMemo(() => analyzeText(text), [text]);

  const rows = [
    { label: 'Characters', value: stats.characters },
    { label: 'Without spaces', value: stats.charactersNoSpaces },
    { label: 'Words', value: stats.words },
    { label: 'Lines', value: stats.lines },
    { label: 'Sentences', value: stats.sentences },
    { label: 'Paragraphs', value: stats.paragraphs },
  ];

  const topStats = [
    { value: stats.words, label: 'Words' },
    { value: stats.characters, label: 'Chars' },
    { value: stats.paragraphs, label: 'Paragraphs' },
  ];

  const handleClear = () => setText('');

  const handleAnalyze = () => {
    if (text.trim()) {
      trackAction(`Checked ${stats.words} words`);
    }
  };

  return (
    <ToolScreenLayout title="Text Counter" subtitle="Analyze any text instantly">
      <ToolInsightBanner
        icon="document-text-outline"
        title="Live analysis"
        description="Stats update as you type — perfect for essays, tweets, and captions."
      />
      <AppInput
        label="Your text"
        value={text}
        onChangeText={setText}
        multiline
        placeholder="Paste or type text here..."
      />
      <AppButton title="Log stats" onPress={handleAnalyze} iconLeft="analytics-outline" fullWidth />
      <AppButton title="Clear" onPress={handleClear} variant="secondary" fullWidth />

      {text.length > 0 ? (
        <>
          <StatGrid items={topStats} />
          <AppCard style={styles.stats}>
            {rows.map((row) => (
              <View key={row.label} style={[styles.statRow, { borderBottomColor: colors.border }]}>
                <View style={styles.statLabel}>
                  <Ionicons name={STAT_ICONS[row.label]} size={16} color={colors.primary} />
                  <Text style={typography.bodySmall}>{row.label}</Text>
                </View>
                <Text style={[typography.label, { color: colors.primary }]}>
                  {row.value.toLocaleString()}
                </Text>
              </View>
            ))}
          </AppCard>
        </>
      ) : (
        <AppCard style={styles.emptyHint}>
          <Text style={[typography.bodySmall, { textAlign: 'center' }]}>
            Start typing to see word count, character count, and more.
          </Text>
        </AppCard>
      )}
    </ToolScreenLayout>
  );
}

const styles = StyleSheet.create({
  stats: { gap: 0 },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  statLabel: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  emptyHint: { alignItems: 'center', paddingVertical: spacing.xl },
});
