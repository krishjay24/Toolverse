import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '@/components/ui/AppButton';
import { ToolScreenLayout } from '@/components/tools/ToolScreenLayout';
import { useToolTracking } from '@/hooks/useToolTracking';
import { useTheme, spacing, radius, createTypography } from '@/theme';
import { analyzePasswordStrength } from '@/utils/passwordStrength';

function getStrengthColor(strength: string): string {
  switch (strength) {
    case 'Very Weak':
      return '#DC2626';
    case 'Weak':
      return '#F59E0B';
    case 'Medium':
      return '#EAB308';
    case 'Strong':
      return '#84CC16';
    case 'Very Strong':
      return '#16A34A';
    default:
      return '#9CA3AF';
  }
}

export function PasswordStrengthCheckerScreen() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const trackAction = useToolTracking('password-strength-checker');
  const { colors } = useTheme();
  const typography = createTypography(colors);

  const result = useMemo(() => {
    return analyzePasswordStrength(password);
  }, [password]);

  const strengthColor = getStrengthColor(result.label);

  const handleClear = () => {
    setPassword('');
    setShowPassword(false);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    // Track if user completes password (debounced in real app, but simple for now)
    if (text.length >= 8) {
      trackAction(`Password length: ${text.length}`);
    }
  };

  return (
    <ToolScreenLayout title="Password Strength" subtitle="Check password strength and security suggestions">
      {/* Password Input */}
      <View style={[styles.inputCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[typography.label, { color: colors.textSecondary, marginBottom: spacing.sm }]}>
          Password
        </Text>
        <View
          style={[
            styles.passwordInputContainer,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
        >
          <TextInput
            style={[typography.body, { flex: 1, paddingHorizontal: spacing.base }]}
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry={!showPassword}
            placeholder="Enter password..."
            placeholderTextColor={colors.textSecondary}
            maxLength={128}
          />
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            style={[styles.toggleButton, { paddingHorizontal: spacing.sm }]}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.textSecondary}
            />
          </Pressable>
        </View>
      </View>

      {/* Security Note */}
      <View style={[styles.securityNote, { backgroundColor: colors.primaryLight }]}>
        <Text style={[typography.caption, { color: colors.primary }]}>
          🔒 Your password is checked only on your device and is not stored.
        </Text>
      </View>

      {password.length > 0 ? (
        <>
          {/* Strength Meter */}
          <View
            style={[styles.resultCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <View style={[styles.resultTopBar, { backgroundColor: strengthColor }]} />
            <View style={styles.resultContent}>
              <View style={styles.strengthHeader}>
                <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>Strength</Text>
                <View
                  style={[
                    styles.strengthBadge,
                    { backgroundColor: strengthColor + '20' },
                  ]}
                >
                  <Text
                    style={[
                      typography.label,
                      { color: strengthColor, fontSize: 12 },
                    ]}
                  >
                    {result.label}
                  </Text>
                </View>
              </View>

              {/* Progress Bar */}
              <View
                style={[
                  styles.progressBar,
                  { backgroundColor: colors.border, overflow: 'hidden' },
                ]}
              >
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${result.percentage}%`,
                      backgroundColor: strengthColor,
                    },
                  ]}
                />
              </View>

              <View style={styles.scoreInfo}>
                <Text
                  style={[typography.caption, { color: colors.textSecondary }]}
                >
                  Score: {Math.round(result.score)}/100
                </Text>
              </View>
            </View>
          </View>

          {/* Checks Checklist */}
          <View
            style={[styles.checksCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Text style={[typography.label, { marginBottom: spacing.sm }]}>Security Checks</Text>
            {result.checks.map((check, index) => (
              <View
                key={index}
                style={[
                  styles.checkRow,
                  { borderBottomColor: colors.border },
                  index === result.checks.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <Ionicons
                  name={check.passed ? 'checkmark-circle' : 'close-circle'}
                  size={18}
                  color={check.passed ? '#16A34A' : '#D1D5DB'}
                  style={{ marginRight: spacing.sm }}
                />
                <Text
                  style={[
                    typography.bodySmall,
                    {
                      color: check.passed ? colors.textPrimary : colors.textSecondary,
                      flex: 1,
                      opacity: check.passed ? 1 : 0.6,
                    },
                  ]}
                >
                  {check.label}
                </Text>
              </View>
            ))}
          </View>

          {/* Suggestions */}
          {result.suggestions.length > 0 && (
            <View
              style={[
                styles.suggestionsCard,
                { backgroundColor: strengthColor + '15' },
              ]}
            >
              <Text
                style={[
                  typography.label,
                  { color: strengthColor, marginBottom: spacing.sm },
                ]}
              >
                💡 Suggestions
              </Text>
              {result.suggestions.map((suggestion, index) => (
                <Text
                  key={index}
                  style={[
                    typography.bodySmall,
                    {
                      color: strengthColor,
                      marginBottom: index < result.suggestions.length - 1 ? spacing.xs : 0,
                    },
                  ]}
                >
                  • {suggestion}
                </Text>
              ))}
            </View>
          )}
        </>
      ) : (
        <View style={[styles.emptyState, { backgroundColor: colors.primaryLight }]}>
          <Text style={[typography.label, { color: colors.primary, marginBottom: spacing.sm }]}>
            🔐 Password Strength Analyzer
          </Text>
          <Text style={[typography.bodySmall, { color: colors.primary }]}>
            Enter a password above to see strength analysis, security checks, and improvement suggestions.
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
  passwordInputContainer: {
    borderRadius: radius.button,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 0,
  },
  toggleButton: {
    padding: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  securityNote: {
    borderRadius: radius.card,
    padding: spacing.base,
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
    gap: spacing.sm,
  },
  strengthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  strengthBadge: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xs,
    borderRadius: 999,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  scoreInfo: {
    alignItems: 'center',
  },
  checksCard: {
    borderRadius: radius.card,
    borderWidth: 1,
    padding: spacing.base,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  suggestionsCard: {
    borderRadius: radius.card,
    padding: spacing.base,
  },
  emptyState: {
    borderRadius: radius.card,
    padding: spacing.base,
  },
});
