import { useMemo, useState } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppInput } from '@/components/ui/AppInput';
import { ToolScreenLayout } from '@/components/tools/ToolScreenLayout';
import { useToolTracking } from '@/hooks/useToolTracking';
import { useTheme, spacing, radius, createTypography } from '@/theme';
import { parseLines, splitIntoTeams } from '@/utils/randomTools';

function cleanNumber(input: string): number {
  const cleaned = input.replace(/[^\d]/g, '');
  return parseInt(cleaned, 10) || 0;
}

export function TeamSplitterScreen() {
  const [namesText, setNamesText] = useState('');
  const [teamCount, setTeamCount] = useState('2');
  const [teams, setTeams] = useState<string[][] | null>(null);
  const [error, setError] = useState('');

  const trackAction = useToolTracking('team-splitter');
  const { colors } = useTheme();
  const typography = createTypography(colors);

  const names = useMemo(() => parseLines(namesText), [namesText]);

  const handleSplitTeams = () => {
    setError('');
    
    if (names.length < 2) {
      setError('Add at least 2 names.');
      return;
    }

    const count = cleanNumber(teamCount);
    
    if (count < 2) {
      setError('Team count must be at least 2.');
      return;
    }

    if (count > names.length) {
      setError(`Cannot create ${count} teams with only ${names.length} names.`);
      return;
    }

    const result = splitIntoTeams(names, count);
    setTeams(result);
    trackAction(`Split ${names.length} names into ${count} teams`);
  };

  const handleShuffleAgain = () => {
    if (names.length >= 2) {
      const count = cleanNumber(teamCount);
      const result = splitIntoTeams(names, Math.min(count, names.length));
      setTeams(result);
    }
  };

  const handleClear = () => {
    setNamesText('');
    setTeams(null);
    setError('');
  };

  const teamColors = [colors.primary, colors.success, colors.warning];

  return (
    <ToolScreenLayout
      title="Team Splitter"
      subtitle="Split names into random teams."
    >
      <AppInput
        label="Names (one per line)"
        value={namesText}
        onChangeText={setNamesText}
        multiline
        placeholder="Alice&#10;Bob&#10;Charlie&#10;Diana"
      />

      <AppInput
        label="Number of Teams"
        value={teamCount}
        onChangeText={setTeamCount}
        keyboardType="decimal-pad"
        placeholder="2"
      />

      {/* Error */}
      {error && (
        <AppCard style={[styles.errorCard, { backgroundColor: colors.errorLight }] as any}>
          <Text style={[typography.bodySmall, { color: colors.error }]}>{error}</Text>
        </AppCard>
      )}

      {/* Teams Display */}
      {teams && (
        <View style={styles.teamsContainer}>
          {teams.map((team, idx) => (
            <AppCard
              key={idx}
              style={[
                styles.teamCard,
                {
                  backgroundColor: (teamColors[idx % teamColors.length] + '15'),
                  borderLeftColor: teamColors[idx % teamColors.length],
                  borderLeftWidth: 4,
                },
              ] as any}
            >
              <Text
                style={[
                  typography.label,
                  { color: teamColors[idx % teamColors.length], marginBottom: spacing.sm },
                ]}
              >
                Team {idx + 1}
              </Text>
              {team.map((name, nameIdx) => (
                <Text key={nameIdx} style={[typography.body, { marginBottom: spacing.xs }]}>
                  {nameIdx + 1}. {name}
                </Text>
              ))}
            </AppCard>
          ))}
        </View>
      )}

      <AppButton
        title="Split Teams"
        onPress={handleSplitTeams}
        disabled={names.length < 2}
        fullWidth
      />
      {teams && (
        <AppButton
          title="Shuffle Again"
          onPress={handleShuffleAgain}
          variant="secondary"
          fullWidth
        />
      )}
      {namesText && (
        <AppButton title="Clear" onPress={handleClear} variant="secondary" fullWidth />
      )}
    </ToolScreenLayout>
  );
}

const styles = StyleSheet.create({
  errorCard: {
    borderRadius: 16,
    padding: spacing.base,
  },
  teamsContainer: {
    gap: spacing.base,
  },
  teamCard: {
    borderRadius: 16,
    padding: spacing.base,
  },
});




