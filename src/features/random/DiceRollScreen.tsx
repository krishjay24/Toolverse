import { useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { StatGrid } from '@/components/tools/StatGrid';
import { ToolScreenLayout } from '@/components/tools/ToolScreenLayout';
import { useToolTracking } from '@/hooks/useToolTracking';
import { useTheme, spacing, radius, createTypography } from '@/theme';
import { rollDice, limitHistory } from '@/utils/randomTools';

// Dot positions [top, left] for a 90×90 face, 13px dot diameter
const DOT_POSITIONS: Record<number, Array<[number, number]>> = {
  1: [[38, 38]],
  2: [[16, 61], [61, 16]],
  3: [[16, 61], [38, 38], [61, 16]],
  4: [[16, 16], [16, 61], [61, 16], [61, 61]],
  5: [[16, 16], [16, 61], [38, 38], [61, 16], [61, 61]],
  6: [[16, 16], [16, 61], [38, 16], [38, 61], [61, 16], [61, 61]],
};

interface DiceFaceProps {
  value: number;
  faceColor: string;
  dotColor: string;
  isRolling: boolean;
}

function DiceFace({ value, faceColor, dotColor, isRolling }: DiceFaceProps) {
  const dots = isRolling ? [] : (DOT_POSITIONS[value] ?? []);
  return (
    <View style={[styles.diceFace, { backgroundColor: faceColor }]}>
      {isRolling ? (
        <Text style={[styles.rollingMark, { color: dotColor }]}>⋯</Text>
      ) : (
        dots.map(([top, left], i) => (
          <View key={i} style={[styles.dot, { top, left, backgroundColor: dotColor }]} />
        ))
      )}
    </View>
  );
}

export function DiceRollScreen() {
  const [diceCount, setDiceCount] = useState<1 | 2>(1);
  const [result, setResult] = useState<number[] | null>(null);
  const [history, setHistory] = useState<{ dice: number[]; total: number }[]>([]);
  const [isRolling, setIsRolling] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const trackAction = useToolTracking('dice-roll');
  const { colors, isDark } = useTheme();
  const typography = createTypography(colors);

  const diceFaceColor = isDark ? '#1E3A5F' : '#2563EB';

  const handleRoll = () => {
    if (isRolling) return;
    const newResult = rollDice(diceCount);
    setIsRolling(true);
    shakeAnim.setValue(0);
    scaleAnim.setValue(1);

    Animated.parallel([
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 14, duration: 55, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -14, duration: 55, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 55, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 55, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 6, duration: 55, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -6, duration: 55, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 55, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.18, duration: 200, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 280, useNativeDriver: true }),
      ]),
    ]).start(() => {
      setIsRolling(false);
      setResult(newResult);
      const total = newResult.reduce((a, b) => a + b, 0);
      setHistory((prev) => limitHistory([...prev, { dice: newResult, total }]));
      trackAction(`Roll ${diceCount} dice: ${newResult.join(', ')}`);
    });
  };

  const handleReset = () => {
    if (isRolling) return;
    setResult(null);
    setHistory([]);
  };

  const resultStats = useMemo(() => {
    if (!result) return null;
    return { total: result.reduce((a, b) => a + b, 0) };
  }, [result]);

  // Show placeholder dice (value=1) before first roll, real result after
  const displayValues = result ?? Array.from({ length: diceCount }, () => 1);

  return (
    <ToolScreenLayout title="Dice Roll" subtitle="Roll one or two dice instantly.">

      {/* Dice Count Selector */}
      <View style={[styles.selectorCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[typography.label, { color: colors.textPrimary, marginBottom: spacing.sm }]}>
          Number of Dice
        </Text>
        <View style={styles.selectorRow}>
          {([1, 2] as const).map((n) => (
            <AppButton
              key={n}
              title={n === 1 ? '1 Die' : '2 Dice'}
              onPress={() => setDiceCount(n)}
              variant={diceCount === n ? 'primary' : 'secondary'}
            />
          ))}
        </View>
      </View>

      {/* Dice Area */}
      <View style={[styles.diceArea, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Animated.View
          style={[
            styles.diceRow,
            { transform: [{ translateX: shakeAnim }, { scale: scaleAnim }] },
          ]}
        >
          {displayValues.map((val, i) => (
            <DiceFace
              key={i}
              value={val}
              faceColor={diceFaceColor}
              dotColor="#FFFFFF"
              isRolling={isRolling}
            />
          ))}
        </Animated.View>

        {diceCount === 2 && !isRolling && result ? (
          <Text style={[typography.h2, styles.totalText, { color: colors.primary }]}>
            Total: {resultStats?.total}
          </Text>
        ) : null}

        <Text style={[typography.bodySmall, { color: colors.textSecondary, marginTop: spacing.sm }]}>
          {isRolling
            ? 'Rolling...'
            : result
            ? `You rolled ${result.join(' and ')}!`
            : 'Tap Roll Dice to start'}
        </Text>
      </View>

      {/* Stats */}
      {history.length > 0 && resultStats ? (
        <StatGrid
          items={[
            { label: 'Total Rolls', value: history.length },
            { label: 'Last Total', value: resultStats.total },
            { label: 'Highest', value: Math.max(...history.map((h) => h.total)) },
          ]}
        />
      ) : null}

      {/* History */}
      {history.length > 0 ? (
        <AppCard>
          <Text style={[typography.label, { marginBottom: spacing.sm }]}>Last 10 Rolls</Text>
          <View style={styles.historyList}>
            {history.map((item, idx) => (
              <View
                key={idx}
                style={[styles.historyItem, { backgroundColor: colors.surfaceContainer, borderColor: colors.border }]}
              >
                <Text style={[typography.caption, { color: colors.textPrimary, fontWeight: '700' }]}>
                  {item.dice.length > 1 ? `${item.dice.join(' + ')} = ${item.total}` : `${item.total}`}
                </Text>
              </View>
            ))}
          </View>
        </AppCard>
      ) : null}

      {/* Buttons */}
      <AppButton
        title={isRolling ? 'Rolling...' : 'Roll Dice'}
        onPress={handleRoll}
        fullWidth
        disabled={isRolling}
      />
      {history.length > 0 && (
        <AppButton title="Reset" onPress={handleReset} variant="secondary" fullWidth />
      )}
    </ToolScreenLayout>
  );
}

const styles = StyleSheet.create({
  selectorCard: {
    borderRadius: radius.card,
    borderWidth: 1,
    padding: spacing.base,
  },
  selectorRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  diceArea: {
    borderRadius: radius.card,
    borderWidth: 1,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.base,
    alignItems: 'center',
    gap: spacing.sm,
  },
  diceRow: {
    flexDirection: 'row',
    gap: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diceFace: {
    width: 90,
    height: 90,
    borderRadius: 16,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  dot: {
    position: 'absolute',
    width: 13,
    height: 13,
    borderRadius: 6.5,
  },
  rollingMark: {
    fontSize: 30,
    lineHeight: 90,
    textAlign: 'center',
    fontWeight: '700',
    width: 90,
  },
  totalText: {
    fontWeight: '800',
    marginTop: spacing.sm,
  },
  historyList: {
    gap: spacing.xs,
  },
  historyItem: {
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
});




