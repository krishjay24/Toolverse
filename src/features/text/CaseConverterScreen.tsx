import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { ToolScreenLayout } from '@/components/tools/ToolScreenLayout';
import { useToolTracking } from '@/hooks/useToolTracking';
import { useTheme, spacing, radius, createTypography } from '@/theme';
import {
  toUpperCaseText,
  toLowerCaseText,
  toTitleCase,
  toSentenceCase,
  toCamelCase,
  toSnakeCase,
  toKebabCase,
  getTextStats,
} from '@/utils/textTools';
import { copyToClipboard, showCopiedAlert } from '@/utils/clipboard';

type CaseType = 'uppercase' | 'lowercase' | 'titlecase' | 'sentencecase' | 'camelcase' | 'snakecase' | 'kebabcase';

interface CaseOption {
  id: CaseType;
  label: string;
  shortLabel: string;
  example: string;
}

const CASE_OPTIONS: CaseOption[] = [
  { id: 'uppercase', label: 'UPPERCASE', shortLabel: 'Upper', example: 'HELLO WORLD' },
  { id: 'lowercase', label: 'lowercase', shortLabel: 'Lower', example: 'hello world' },
  { id: 'titlecase', label: 'Title Case', shortLabel: 'Title', example: 'Hello World' },
  { id: 'sentencecase', label: 'Sentence case', shortLabel: 'Sentence', example: 'Hello world' },
  { id: 'camelcase', label: 'camelCase', shortLabel: 'Camel', example: 'helloWorld' },
  { id: 'snakecase', label: 'snake_case', shortLabel: 'Snake', example: 'hello_world' },
  { id: 'kebabcase', label: 'kebab-case', shortLabel: 'Kebab', example: 'hello-world' },
];

function convertText(text: string, caseType: CaseType): string {
  switch (caseType) {
    case 'uppercase':
      return toUpperCaseText(text);
    case 'lowercase':
      return toLowerCaseText(text);
    case 'titlecase':
      return toTitleCase(text);
    case 'sentencecase':
      return toSentenceCase(text);
    case 'camelcase':
      return toCamelCase(text);
    case 'snakecase':
      return toSnakeCase(text);
    case 'kebabcase':
      return toKebabCase(text);
    default:
      return text;
  }
}

export function CaseConverterScreen() {
  const [inputText, setInputText] = useState('hello world');
  const [selectedCase, setSelectedCase] = useState<CaseType>('titlecase');

  const trackAction = useToolTracking('case-converter');
  const { colors } = useTheme();
  const typography = createTypography(colors);

  const outputText = useMemo(() => {
    if (!inputText.trim()) return '';
    return convertText(inputText, selectedCase);
  }, [inputText, selectedCase]);

  const stats = useMemo(() => getTextStats(inputText), [inputText]);

  const selectedOption = CASE_OPTIONS.find((opt) => opt.id === selectedCase);

  const handleCaseSelect = (caseType: CaseType) => {
    setSelectedCase(caseType);
    trackAction(`Selected ${caseType}`);
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
    setSelectedCase('titlecase');
  };

  return (
    <ToolScreenLayout title="Case Converter" subtitle="Convert text between different cases">
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
            placeholder="Enter text to convert..."
          />
        </View>
        {stats.characters > 0 && (
          <Text style={[typography.caption, { color: colors.textSecondary, marginTop: spacing.sm }]}>
            {stats.characters} characters • {stats.words} words • {stats.lines} lines
          </Text>
        )}
      </View>

      {/* Case Conversion Buttons */}
      <View style={styles.caseGrid}>
        {CASE_OPTIONS.map((option) => (
          <Pressable
            key={option.id}
            onPress={() => handleCaseSelect(option.id)}
            style={[
              styles.caseButton,
              {
                backgroundColor:
                  selectedCase === option.id ? colors.primary : colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Text
              style={[
                typography.caption,
                {
                  color:
                    selectedCase === option.id
                      ? '#FFFFFF'
                      : colors.textSecondary,
                  fontWeight: selectedCase === option.id ? '600' : '400',
                },
              ]}
            >
              {option.shortLabel}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Example Helper */}
      {selectedOption && (
        <View style={[styles.exampleCard, { backgroundColor: colors.primaryLight }]}>
          <Text style={[typography.caption, { color: colors.primary, marginBottom: spacing.xs }]}>
            Example:
          </Text>
          <Text style={[typography.bodySmall, { color: colors.primary, fontFamily: 'monospace' }]}>
            {selectedOption.example}
          </Text>
        </View>
      )}

      {/* Output Result */}
      {inputText.trim() ? (
        <>
          <View
            style={[styles.resultCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <View style={[styles.resultTopBar, { backgroundColor: colors.primary }]} />
            <View style={styles.resultContent}>
              <Text
                style={[
                  typography.bodySmall,
                  { color: colors.textSecondary, marginBottom: spacing.sm },
                ]}
              >
                {selectedOption?.label}
              </Text>
              <Text
                style={[
                  styles.resultText,
                  {
                    color: colors.textPrimary,
                    fontFamily: 'monospace',
                  },
                ]}
              >
                {outputText}
              </Text>
              <Text
                style={[
                  typography.caption,
                  { color: colors.textSecondary, marginTop: spacing.sm },
                ]}
              >
                {outputText.length} characters
              </Text>
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
        <View
          style={[
            styles.emptyState,
            { backgroundColor: colors.primaryLight },
          ]}
        >
          <Text
            style={[
              typography.label,
              { color: colors.primary, marginBottom: spacing.sm },
            ]}
          >
            📝 Empty Text
          </Text>
          <Text
            style={[typography.bodySmall, { color: colors.primary }]}
          >
            Enter text above and select a conversion style to see the result.
          </Text>
        </View>
      )}

      <AppButton
        title="Clear"
        onPress={handleClear}
        variant="secondary"
        fullWidth
      />
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
    minHeight: 100,
  },
  caseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  caseButton: {
    flex: 1,
    minWidth: '30%',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: radius.button,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  exampleCard: {
    borderRadius: radius.card,
    padding: spacing.base,
    gap: spacing.xs,
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
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  emptyState: {
    borderRadius: radius.card,
    padding: spacing.base,
  },
});
