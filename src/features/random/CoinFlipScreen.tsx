import { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { StatGrid } from '@/components/tools/StatGrid';
import { ToolScreenLayout } from '@/components/tools/ToolScreenLayout';
import { useToolTracking } from '@/hooks/useToolTracking';
import { useTheme, spacing, radius, createTypography } from '@/theme';
import { flipCoin, limitHistory, type CoinResult } from '@/utils/randomTools';

const HEADS_COLOR = '#F59E0B';
const TAILS_COLOR = '#64748B';

export function CoinFlipScreen() {
  const [result, setResult] = useState<CoinResult | null>(null);
  const [displayResult, setDisplayResult] = useState<CoinResult | null>(null);
  const [history, setHistory] = useState<CoinResult[]>([]);
  const [stats, setStats] = useState({ heads: 0, tails: 0 });
  const [isFlipping, setIsFlipping] = useState(false);

  const flipAnim = useRef(new Animated.Value(0)).current;
  const trackAction = useToolTracking('coin-flip');
  const { colors } = useTheme();
  const typography = createTypography(colors);

  // scaleX: 1 → 0 (first half) → 1 (second half)
  // Face switches while edge-on (scaleX ≈ 0), preventing mirrored text
  const scaleX = flipAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [1, 0.01, 1],
  });

  const handleFlip = () => {
    if (isFlipping) return;
    const newResult = flipCoin();
    setIsFlipping(true);
    flipAnim.setValue(0);

    Animated.timing(flipAnim, { toValue: 1, duration: 270, useNativeDriver: true }).start(() => {
      // Switch face content while the coin is "edge on"
      setDisplayResult(newResult);
      Animated.timing(flipAnim, { toValue: 2, duration: 270, useNativeDriver: true }).start(() => {
        setIsFlipping(false);
        setResult(newResult);
        setHistory((prev) => limitHistory([...prev, newResult]));
        setStats((prev) => ({
          ...prev,
          [newResult.toLowerCase()]: prev[newResult.toLowerCase() as 'heads' | 'tails'] + 1,
        }));
        trackAction(`Flip: ${newResult}`);
      });
    });
  };

  const handleReset = () => {
    if (isFlipping) return;
    setResult(null);
    setDisplayResult(null);
    setHistory([]);
    setStats({ heads: 0, tails: 0 });
  };

  const totalFlips = stats.heads + stats.tails;
  const headsPercent = totalFlips > 0 ? Math.round((stats.heads / totalFlips) * 100) : 0;
  const coinBg =
    displayResult === 'Heads' ? HEADS_COLOR
    : displayResult === 'Tails' ? TAILS_COLOR
    : colors.border;

  return (
    <ToolScreenLayout title="Coin Flip" subtitle="Flip a coin for quick decisions.">

      {/* Coin */}
      <View style={styles.coinArea}>
        <Pressable onPress={handleFlip} disabled={isFlipping} style={styles.coinTouchable}>
          <Animated.View style={[styles.coin, { backgroundColor: coinBg }, { transform: [{ scaleX }] }]}>
            {isFlipping ? (
              <Text style={styles.coinGlyph}>◌</Text>
            ) : displayResult ? (
              <>
                <Text style={styles.coinLetter}>{displayResult === 'Heads' ? 'H' : 'T'}</Text>
                <Text style={styles.coinSubLabel}>{displayResult}</Text>
              </>
            ) : (
              <Text style={styles.coinGlyph}>?</Text>
            )}
          </Animated.View>
        </Pressable>
        <Text style={[typography.bodySmall, styles.coinCaption, { color: colors.textSecondary }]}>
          {isFlipping
            ? 'Flipping...'
            : displayResult
            ? `${displayResult}!`
            : 'Tap the coin or press Flip'}
        </Text>
      </View>

      {/* Stats */}
      {totalFlips > 0 && (
        <StatGrid
          items={[
            { label: 'Total Flips', value: totalFlips },
            { label: 'Heads', value: `${stats.heads} (${headsPercent}%)` },
            { label: 'Tails', value: `${stats.tails} (${100 - headsPercent}%)` },
          ]}
        />
      )}

      {/* History */}
      {history.length > 0 && (
        <AppCard>
          <Text style={[typography.label, { marginBottom: spacing.sm }]}>Last 10 Flips</Text>
          <View style={styles.historyRow}>
            {history.map((flip, idx) => (
              <View
                key={idx}
                style={[
                  styles.historyBadge,
                  {
                    backgroundColor: flip === 'Heads' ? HEADS_COLOR + '28' : TAILS_COLOR + '28',
                    borderColor: flip === 'Heads' ? HEADS_COLOR + '55' : TAILS_COLOR + '55',
                  },
                ]}
              >
                <Text
                  style={[
                    typography.caption,
                    { color: flip === 'Heads' ? HEADS_COLOR : TAILS_COLOR, fontWeight: '700' },
                  ]}
                >
                  {flip === 'Heads' ? 'H' : 'T'}
                </Text>
              </View>
            ))}
          </View>
        </AppCard>
      )}

      {/* Buttons */}
      <AppButton
        title={isFlipping ? 'Flipping...' : 'Flip Coin'}
        onPress={handleFlip}
        fullWidth
        disabled={isFlipping}
      />
      {totalFlips > 0 && (
        <AppButton title="Reset" onPress={handleReset} variant="secondary" fullWidth />
      )}
    </ToolScreenLayout>
  );
}

const styles = StyleSheet.create({
  coinArea: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  coinTouchable: {
    borderRadius: 70,
  },
  coin: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 6,
  },
  coinGlyph: {
    fontSize: 52,
    color: '#FFFFFF',
    lineHeight: 58,
    fontWeight: '300',
  },
  coinLetter: {
    fontSize: 54,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 58,
  },
  coinSubLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  coinCaption: {
    marginTop: spacing.base,
    textAlign: 'center',
  },
  historyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  historyBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});




