import { useMemo, useState } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppInput } from '@/components/ui/AppInput';
import { ToolScreenLayout } from '@/components/tools/ToolScreenLayout';
import { useToolTracking } from '@/hooks/useToolTracking';
import { useTheme, spacing, radius, createTypography } from '@/theme';
import { createGuessNumberGame, checkGuess, type GuessGameState } from '@/utils/randomTools';

function cleanNumber(input: string): number {
  const cleaned = input.replace(/[^\d]/g, '');
  return parseInt(cleaned, 10) || 0;
}

export function GuessTheNumberScreen() {
  const [gameState, setGameState] = useState<GuessGameState | null>(null);
  const [guessInput, setGuessInput] = useState('');
  const [hint, setHint] = useState<string>('');
  const [error, setError] = useState('');

  const trackAction = useToolTracking('guess-the-number');
  const { colors } = useTheme();
  const typography = createTypography(colors);

  const handleNewGame = () => {
    const newGame = createGuessNumberGame(1, 100);
    setGameState(newGame);
    setGuessInput('');
    setHint('');
    setError('');
    trackAction('New game started');
  };

  const handleSubmitGuess = () => {
    setError('');
    setHint('');

    if (!gameState || gameState.isGameOver) {
      return;
    }

    const guess = cleanNumber(guessInput);

    if (guess < gameState.min || guess > gameState.max) {
      setError(`Please guess between ${gameState.min} and ${gameState.max}.`);
      return;
    }

    if (guess === 0) {
      setError('Please enter a valid number.');
      return;
    }

    const result = checkGuess(gameState.secret, guess);
    const newGuesses = [...gameState.guesses, guess];
    const newAttempts = gameState.attempts + 1;

    if (result === 'correct') {
      setHint(`Correct! 🎉 You guessed it in ${newAttempts} attempts!`);
      setGameState((prev) => prev ? { ...prev, isGameOver: true, guesses: newGuesses, attempts: newAttempts } : null);
      trackAction(`Game won in ${newAttempts} attempts`);
    } else {
      const hintText =
        result === 'low'
          ? `Too low! Guess higher. (Attempt ${newAttempts})`
          : `Too high! Guess lower. (Attempt ${newAttempts})`;
      setHint(hintText);
      setGameState((prev) =>
        prev ? { ...prev, guesses: newGuesses, attempts: newAttempts } : null
      );
    }

    setGuessInput('');
  };

  const isGameWon = gameState?.isGameOver;

  return (
    <ToolScreenLayout
      title="Guess the Number"
      subtitle="Guess the hidden number with hints."
    >
      {!gameState ? (
        <View style={[styles.centerCard, { backgroundColor: colors.primaryLight }] as any}>
          <Text style={[typography.h2, { color: colors.primary, textAlign: 'center', marginBottom: spacing.base }]}>
            🎯 Start a new game!
          </Text>
          <Text style={[typography.bodySmall, { color: colors.primary, textAlign: 'center' }]}>
            Guess a number between 1 and 100.
          </Text>
        </View>
      ) : (
        <>
          {/* Instruction */}
          <AppCard style={[styles.instructionCard, { backgroundColor: colors.primaryLight }] as any}>
            <Text style={[typography.label, { color: colors.primary }]}>
              Guess a number between {gameState.min} and {gameState.max}
            </Text>
          </AppCard>

          {/* Game Over State */}
          {isGameWon && (
            <AppCard style={[styles.successCard, { backgroundColor: colors.successLight }] as any}>
              <Text style={[typography.h1, { color: colors.success, textAlign: 'center' }]}>
                🎉 You Won!
              </Text>
              <Text style={[typography.body, { color: colors.success, textAlign: 'center', marginTop: spacing.sm }]}>
                Secret number: {gameState.secret}
              </Text>
              <Text style={[typography.bodySmall, { color: colors.success, textAlign: 'center', marginTop: spacing.sm }]}>
                Attempts: {gameState.attempts}
              </Text>
            </AppCard>
          )}

          {/* Guess Input */}
          {!isGameWon && (
            <AppInput
              label="Your Guess"
              value={guessInput}
              onChangeText={setGuessInput}
              keyboardType="decimal-pad"
              placeholder="50"
            />
          )}

          {/* Error */}
          {error && (
        <AppCard
          style={{
            backgroundColor: colors.errorLight,
            borderRadius: spacing.base,
            padding: spacing.base,
          }}
        >
          <Text style={[typography.bodySmall, { color: colors.error }]}>{error}</Text>
        </AppCard>
      )}

      {/* Hint */}
      {hint && (
        <AppCard
          style={{
            backgroundColor: colors.error + '15',
            borderRadius: spacing.base,
            padding: spacing.base,
          }}
        >
          <Text style={[typography.body, { color: colors.error, textAlign: 'center' }]}>
            {hint}
          </Text>
        </AppCard>
      )}

      {/* Attempts Count */}
      {gameState.attempts > 0 && (
        <AppCard
          style={{
            backgroundColor: colors.surface,
            borderRadius: spacing.base,
            padding: spacing.base,
          }}
        >
          <Text style={[typography.label, { textAlign: 'center' }]}>
            Attempts: {gameState.attempts}
          </Text>
        </AppCard>
      )}

      {/* Guesses History */}
      {gameState.guesses.length > 0 && (
        <AppCard>
          <Text style={[typography.label, { marginBottom: spacing.sm }]}>
            Your Guesses: {gameState.guesses.length}
          </Text>
          <View style={styles.guessesContainer}>
            {gameState.guesses.map((guess, idx) => (
              <View
                key={idx}
                style={[
                  styles.guessItem,
                  {
                    backgroundColor:
                      guess < gameState.secret
                        ? colors.warning + '20'
                        : guess > gameState.secret
                          ? colors.error + '20'
                          : colors.success + '20',
                  },
                ]}
              >
                <Text style={[typography.bodySmall, { textAlign: 'center' }]}>
                  {guess}
                  {guess < gameState.secret && ' ↑'}
                  {guess > gameState.secret && ' ↓'}
                </Text>
              </View>
            ))}
          </View>
        </AppCard>
      )}
        </>
      )}

      {/* Action Buttons */}
      {!gameState ? (
        <AppButton title="Start New Game" onPress={handleNewGame} fullWidth />
      ) : !isGameWon ? (
        <>
          <AppButton title="Submit Guess" onPress={handleSubmitGuess} fullWidth />
          <AppButton title="New Game" onPress={handleNewGame} variant="secondary" fullWidth />
        </>
      ) : (
        <AppButton title="Play Again" onPress={handleNewGame} fullWidth />
      )}
    </ToolScreenLayout>
  );
}

const styles = StyleSheet.create({
  centerCard: {
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
  },
  instructionCard: {
    borderRadius: 16,
    padding: spacing.base,
  },
  successCard: {
    borderRadius: 16,
    padding: spacing.base,
  },
  errorCard: {
    borderRadius: 16,
    padding: spacing.base,
  },
  hintCard: {
    borderRadius: 16,
    padding: spacing.base,
  },
  statsCard: {
    borderRadius: 16,
    padding: spacing.base,
  },
  guessesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  guessItem: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    minWidth: 40,
  },
});




