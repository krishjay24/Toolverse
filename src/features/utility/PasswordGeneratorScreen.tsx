import { useState } from 'react';
import { Pressable, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppInput } from '@/components/ui/AppInput';
import { ToolActionRow } from '@/components/tools/ToolActionRow';
import { ToolInsightBanner } from '@/components/tools/ToolInsightBanner';
import { ToolScreenLayout } from '@/components/tools/ToolScreenLayout';
import { useToolTracking } from '@/hooks/useToolTracking';
import { useTheme, spacing, createTypography } from '@/theme';
import { copyToClipboard, showCopiedAlert } from '@/utils/clipboard';
import { generatePassword } from '@/utils/calculations';

const STRENGTH_LABELS = ['Weak', 'Fair', 'Good', 'Strong', 'Very strong'];

function getStrength(password: string, length: number): number {
  let score = 0;
  if (length >= 12) score++;
  if (length >= 16) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(score, STRENGTH_LABELS.length - 1);
}

export function PasswordGeneratorScreen() {
  const [length, setLength] = useState('16');
  const [options, setOptions] = useState({ upper: true, lower: true, numbers: true, symbols: true });
  const [password, setPassword] = useState('');
  const trackAction = useToolTracking('password-generator');
  const { colors } = useTheme();
  const typography = createTypography(colors);

  const toggle = (key: keyof typeof options) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const generate = () => {
    const len = Math.min(32, Math.max(8, Number(length) || 16));
    const result = generatePassword(len, options);
    setPassword(result);
    trackAction(`${len} chars`);
  };

  const handleCopy = async () => {
    if (password && (await copyToClipboard(password))) {
      showCopiedAlert();
    }
  };

  const handleShare = async () => {
    if (password) {
      await Share.share({ message: password });
    }
  };

  const strength = password ? getStrength(password, password.length) : 0;
  const strengthColors = [colors.error, colors.warning, colors.warning, colors.success, colors.success];

  return (
    <ToolScreenLayout title="Password Generator" subtitle="Secure random passwords">
      <ToolInsightBanner
        icon="shield-checkmark-outline"
        title="Stay secure"
        description="Mix uppercase, numbers, and symbols for a stronger password."
      />
      <AppInput label="Length (8–32)" value={length} onChangeText={setLength} keyboardType="numeric" />
      <View style={styles.options}>
        {([
          ['upper', 'ABC', 'Uppercase'],
          ['lower', 'abc', 'Lowercase'],
          ['numbers', '123', 'Numbers'],
          ['symbols', '!@#', 'Symbols'],
        ] as const).map(([key, preview, label]) => (
          <Pressable key={key} onPress={() => toggle(key)} style={[styles.option, { borderColor: options[key] ? colors.primary : colors.border, backgroundColor: options[key] ? colors.primaryLight : colors.surface }]}>
            <Text style={[typography.caption, { fontWeight: '700' }, options[key] && { color: colors.primary }]}>{preview}</Text>
            <Text style={[typography.caption, options[key] && { color: colors.primary }]}>{label}</Text>
          </Pressable>
        ))}
      </View>
      <AppButton title="Generate password" onPress={generate} fullWidth iconLeft="key-outline" />
      <AppButton
        title="Reset"
        onPress={() => setPassword('')}
        variant="secondary"
        fullWidth
      />

      {password ? (
        <AppCard style={styles.result}>
          <View style={styles.strengthRow}>
            <Ionicons name="lock-closed-outline" size={18} color={strengthColors[strength]} />
            <Text style={[typography.label, { color: strengthColors[strength] }]}>
              {STRENGTH_LABELS[strength]}
            </Text>
            <View style={styles.strengthBars}>
              {STRENGTH_LABELS.map((_, i) => (
                <View
                  key={i}
                  style={[styles.strengthBar, { backgroundColor: i <= strength ? strengthColors[strength] : colors.border }]}
                />
              ))}
            </View>
          </View>
          <TextInput style={[typography.body, styles.password, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.background }]} value={password} editable={false} selectTextOnFocus multiline />
          <ToolActionRow onCopy={handleCopy} onShare={handleShare} copyLabel="Copy" shareLabel="Share" />
        </AppCard>
      ) : null}
    </ToolScreenLayout>
  );
}

const styles = StyleSheet.create({
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  option: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, alignItems: 'center', minWidth: '22%', gap: 2 },
  result: { gap: spacing.md },
  strengthRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  strengthBars: { flex: 1, flexDirection: 'row', gap: 4 },
  strengthBar: { flex: 1, height: 4, borderRadius: 2 },
  password: { borderWidth: 1, borderRadius: 12, padding: spacing.md, minHeight: 52, fontFamily: 'monospace' },
});
