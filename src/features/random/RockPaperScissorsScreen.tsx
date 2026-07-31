import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { StatGrid } from '@/components/tools/StatGrid';
import { ToolScreenLayout } from '@/components/tools/ToolScreenLayout';
import { useToolTracking } from '@/hooks/useToolTracking';
import { useTheme, spacing, radius, createTypography } from '@/theme';
import { playRockPaperScissors, type RpsChoice } from '@/utils/randomTools';

export function RockPaperScissorsScreen() {
  const [score, setScore] = useState({ wins: 0, losses: 0, draws: 0 });
  const [lastResult, setLastResult] = useState<any>(null);

  const trackAction = useToolTracking('rock-paper-scissors');
  const { colors } = useTheme();
  const typography = createTypography(colors);

  const choices: { id: RpsChoice; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { id: 'rock', label: 'Rock', icon: 'radio-button-off-outline' },
    { id: 'paper', label: 'Paper', icon: 'document-outline' },
    { id: 'scissors', label: 'scissors', icon: 'cut-outline' },
  ];

  const handlePlay = (userChoice: RpsChoice) => {
    const result = playRockPaperScissors(userChoice);
    setLastResult(result);

    setScore((prev) => ({
      ...prev,
      [result.result === 'draw' ? 'draws' : result.result === 'win' ? 'wins' : 'losses']:
        prev[result.result === 'draw' ? 'draws' : result.result === 'win' ? 'wins' : 'losses'] + 1,
    }));

    trackAction(`Played ${userChoice}: ${result.result}`);
  };

  const handleResetScore = () => {
    setScore({ wins: 0, losses: 0, draws: 0 });
    setLastResult(null);
  };

  const getResultColor = () => {
    if (!lastResult) return colors.textSecondary;
    if (lastResult.result === 'win') return colors.success;
    if (lastResult.result === 'lose') return colors.error;
    return colors.warning;
  };

  const getResultText = () => {
    if (!lastResult) return '';
    if (lastResult.result === 'win') return 'You Win! 🎉';
    if (lastResult.result === 'lose') return 'You Lose 😔';
    return 'Draw! 🤝';
  };

  return (
    <ToolScreenLayout
      title="Rock Paper Scissors"
      subtitle="Play a quick classic mini game."
    >
      {/* Choice Buttons */}
      <View style={styles.choicesContainer}>
        {choices.map((choice) => (
          <Pressable
            key={choice.id}
            onPress={() => handlePlay(choice.id)}
            style={[
              styles.choiceButton,
              {
                backgroundColor: colors.primaryLight,
                borderColor: colors.primary,
              },
            ]}
          >
            <Ionicons name={choice.icon} size={40} color={colors.primary} />
            <Text style={[typography.label, { color: colors.primary, marginTop: spacing.sm }]}>
              {choice.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Result */}
      {lastResult && (
        <AppCard style={[styles.resultCard, { backgroundColor: getResultColor() + '15' }] as any}>
          <View style={styles.resultContent}>
            <View style={styles.choiceComparison}>
              <View style={styles.choiceBox}>
                <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>Your Choice</Text>
                <Ionicons
                  name={choices.find((c) => c.id === lastResult.userChoice)?.icon || 'help-outline'}
                  size={32}
                  color={colors.primary}
                  style={{ marginTop: spacing.sm }}
                />
              </View>
              <Text style={[typography.label, { color: colors.textSecondary }]}>vs</Text>
              <View style={styles.choiceBox}>
                <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>Computer</Text>
                <Ionicons
                  name={choices.find((c) => c.id === lastResult.appChoice)?.icon || 'help-outline'}
                  size={32}
                  color={colors.warning}
                  style={{ marginTop: spacing.sm }}
                />
              </View>
            </View>
            <Text
              style={[
                typography.h2,
                {
                  color: getResultColor(),
                  textAlign: 'center',
                  marginTop: spacing.base,
                },
              ]}
            >
              {getResultText()}
            </Text>
          </View>
        </AppCard>
      )}

      {/* Score */}
      {score.wins + score.losses + score.draws > 0 && (
        <StatGrid
          items={[
            { label: 'Wins', value: score.wins },
            { label: 'Losses', value: score.losses },
            { label: 'Draws', value: score.draws },
          ]}
        />
      )}

      {score.wins + score.losses + score.draws > 0 && (
        <AppButton title="Reset Score" onPress={handleResetScore} variant="secondary" fullWidth />
      )}
    </ToolScreenLayout>
  );
}

const styles = StyleSheet.create({
  choicesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: spacing.base,
    gap: spacing.sm,
  },
  choiceButton: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 2,
    padding: spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultCard: {
    borderRadius: 16,
    padding: spacing.base,
  },
  resultContent: {
    gap: spacing.base,
  },
  choiceComparison: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  choiceBox: {
    alignItems: 'center',
  },
});




