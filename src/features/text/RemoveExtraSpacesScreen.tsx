import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { ToolScreenLayout } from '@/components/tools/ToolScreenLayout';
import { useToolTracking } from '@/hooks/useToolTracking';
import { useTheme, spacing, radius, createTypography } from '@/theme';
import {
  normalizeSpaces,
  removeEmptyLines,
  trimLines,
  cleanText,
  getTextStats,
} from '@/utils/textTools';
import { copyToClipboard, showCopiedAlert } from '@/utils/clipboard';

type CleaningMode = 'normalize' | 'removeEmpty' | 'trimLines' | 'cleanAll';

interface CleaningOption {
  id: CleaningMode;
  label: string;
  description: string;
  apply: (text: string) => string;
}

const CLEANING_OPTIONS: CleaningOption[] = [
  {
    id: 'normalize',
    label: 'Extra Spaces',
    description: 'Remove multiple spaces between words',
    apply: normalizeSpaces,
  },
  {
    id: 'removeEmpty',
    label: 'Empty Lines',
    description: 'Remove empty or whitespace-only lines',
    apply: removeEmptyLines,
  },
  {
    id: 'trimLines',
    label: 'Trim Lines',
    description: 'Remove leading/trailing spaces from each line',
    apply: trimLines,
  },
  {
    id: 'cleanAll',
    label: 'Clean All',
    description: 'Apply all cleaning options',
    apply: cleanText,
  },
];

export function RemoveExtraSpacesScreen() {
  const [inputText, setInputText] = useState('Hello      world\n\n\nToolverse     app\n  ');
  const [selectedMode, setSelectedMode] = useState<CleaningMode>('cleanAll');

  const trackAction = useToolTracking('remove-extra-spaces');
  const { colors } = useTheme();
  const typography = createTypography(colors);

  const selectedOption = CLEANING_OPTIONS.find((opt) => opt.id === selectedMode)!;

  const outputText = useMemo(() => {
    if (!inputText) return '';
    return selectedOption.apply(inputText);
  }, [inputText, selectedMode]);

  const inputStats = getTextStats(inputText);
  const outputStats = getTextStats(outputText);
  const removedCharacters = inputStats.characters - outputStats.characters;

  const handleModeSelect = (mode: CleaningMode) => {
    setSelectedMode(mode);
  };

  const handleCopy = async () => {
    if (outputText.trim()) {
      const success = await copyToClipboard(outputText);
      if (success) {
        showCopiedAlert();
        trackAction('Copied result');
      }
    }
  };

  const handleClear = () => {
    setInputText('');
    setSelectedMode('cleanAll');
  };

  return (
    <ToolScreenLayout
      title="Remove Extra Spaces"
      subtitle="Clean extra spaces and empty lines from text"
    >
      {/* Input Text Area */}
      <View style={[styles.inputCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[typography.label, { color: colors.textSecondary, marginBottom: spacing.sm }]}>
          Input Text
        </Text>
        <View
          style={[styles.textInput, { backgroundColor: colors.background, borderColor: colors.border }]}
        >
          <AppInput
            value={inputText}
            onChangeText={setInputText}
            multiline
            placeholder="Enter text to clean..."
          />
        </View>
        {inputText.length > 0 && (
          <Text style={[typography.caption, { color: colors.textSecondary, marginTop: spacing.sm }]}>
            {inputStats.characters} characters • {inputStats.lines} lines
          </Text>
        )}
      </View>

      {/* Cleaning Mode Buttons */}
      <View style={styles.modeGrid}>
        {CLEANING_OPTIONS.map((option) => (
          <Pressable
            key={option.id}
            onPress={() => handleModeSelect(option.id)}
            style={[
              styles.modeButton,
              {
                backgroundColor: selectedMode === option.id ? colors.primary : colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Text
              style={[
                typography.caption,
                {
                  color: selectedMode === option.id ? '#FFFFFF' : colors.textSecondary,
                  fontWeight: selectedMode === option.id ? '600' : '400',
                },
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Mode Description */}
      <View style={[styles.descriptionCard, { backgroundColor: colors.primaryLight }]}>
        <Text style={[typography.bodySmall, { color: colors.primary }]}>
          {selectedOption.description}
        </Text>
      </View>

      {/* Before/After Stats */}
      {inputText.trim() ? (
        <>
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[typography.caption, { color: colors.textSecondary }]}>Original</Text>
              <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                {inputStats.characters}
              </Text>
              <Text style={[typography.caption, { color: colors.textSecondary, fontSize: 11 }]}>
                characters
              </Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[typography.caption, { color: colors.textSecondary }]}>Cleaned</Text>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {outputStats.characters}
              </Text>
              <Text style={[typography.caption, { color: colors.textSecondary, fontSize: 11 }]}>
                characters
              </Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[typography.caption, { color: colors.textSecondary }]}>Removed</Text>
              <Text style={[styles.statValue, { color: '#F59E0B' }]}>
                {removedCharacters}
              </Text>
              <Text style={[typography.caption, { color: colors.textSecondary, fontSize: 11 }]}>
                characters
              </Text>
            </View>
          </View>

          {/* Output Result */}
          <View
            style={[styles.resultCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <View style={[styles.resultTopBar, { backgroundColor: colors.primary }]} />
            <View style={styles.resultContent}>
              <Text style={[typography.bodySmall, { color: colors.textSecondary, marginBottom: spacing.sm }]}>
                Cleaned Text
              </Text>
              <Text
                style={[
                  styles.resultText,
                  {
                    color: colors.textPrimary,
                  },
                ]}
              >
                {outputText}
              </Text>
              <View style={styles.resultStats}>
                <Text style={[typography.caption, { color: colors.textSecondary }]}>
                  {outputStats.characters} characters • {outputStats.lines} lines
                </Text>
              </View>
            </View>
          </View>

          <AppButton
            title="Copy Result"
            onPress={handleCopy}
            fullWidth
            iconLeft="copy-outline"
            variant="secondary"
          />
        </>
      ) : (
        <View style={[styles.emptyState, { backgroundColor: colors.primaryLight }]}>
          <Text style={[typography.label, { color: colors.primary, marginBottom: spacing.sm }]}>
            📝 Empty Text
          </Text>
          <Text style={[typography.bodySmall, { color: colors.primary }]}>
            Enter text to clean extra spaces.
          </Text>
        </View>
      )}

      <AppButton title="Clear" onPress={handleClear} variant="secondary" fullWidth />
    </ToolScreenLayout>
  );
}

const styles = StyleSheet.create({
  inputCard: {
    borderRadius: radius.card,
    borderWidth: 1,
    padding: spacing.base,
  },
  textInput: {
    borderRadius: radius.button,
    borderWidth: 1,
    padding: spacing.sm,
    minHeight: 130,
  },
  modeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  modeButton: {
    flex: 1,
    minWidth: '45%',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: radius.button,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  descriptionCard: {
    borderRadius: radius.card,
    padding: spacing.base,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    borderRadius: radius.card,
    borderWidth: 1,
    padding: spacing.base,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginVertical: spacing.xs,
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
  },
  resultText: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.1,
  },
  resultStats: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  emptyState: {
    borderRadius: radius.card,
    padding: spacing.base,
  },
});
