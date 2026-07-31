import { useMemo, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Svg, G, Path, Circle, Text as SvgText } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppInput } from '@/components/ui/AppInput';
import { ToolScreenLayout } from '@/components/tools/ToolScreenLayout';
import { useToolTracking } from '@/hooks/useToolTracking';
import { useTheme, spacing, radius, createTypography } from '@/theme';
import { parseLines, limitHistory } from '@/utils/randomTools';

// ── Config ────────────────────────────────────────────────────────────────────

const SEGMENT_COLORS = [
  '#EF4444', '#F97316', '#EAB308', '#22C55E',
  '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899',
  '#14B8A6', '#F59E0B',
];
const MIN_ITEMS = 2;
const MAX_ITEMS = 12;
const SPIN_LAPS = 5; // full rotations before landing

// ── SVG helpers ───────────────────────────────────────────────────────────────

/** Convert an angle (0 = top/north, clockwise) to SVG x/y coordinates. */
function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/** Build an SVG "M cx cy L ... A ... Z" pie-slice path. */
function slicePath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const s = polarToXY(cx, cy, r, startDeg);
  const e = polarToXY(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M${cx},${cy} L${s.x.toFixed(3)},${s.y.toFixed(3)} A${r},${r},0,${large},1,${e.x.toFixed(3)},${e.y.toFixed(3)} Z`;
}

function clamp(s: string, max: number): string {
  return s.length > max ? s.slice(0, max - 1) + '…' : s;
}

// ── Screen ────────────────────────────────────────────────────────────────────

export function SpinWheelScreen() {
  const [optionsText, setOptionsText] = useState('Option 1\nOption 2\nOption 3\nOption 4');
  const [isSpinning, setIsSpinning] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [error, setError] = useState('');

  const spinAnim = useRef(new Animated.Value(0)).current;
  const totalAngle = useRef(0); // running total rotation in degrees

  const trackAction = useToolTracking('spin-wheel');
  const { colors, isDark } = useTheme();
  const typography = createTypography(colors);
  const { width } = useWindowDimensions();

  const options = useMemo(() => parseLines(optionsText).slice(0, MAX_ITEMS), [optionsText]);

  // ── Wheel geometry (computed from screen width) ──────────────────────────
  const wheelSize = Math.min(width - spacing.screen * 2, 320);
  const cx = wheelSize / 2;
  const cy = wheelSize / 2;
  const outerR = wheelSize / 2 - 4;
  const innerR = 30; // center button radius

  // Show placeholder segments when not enough items to prevent blank wheel
  const displayOptions = options.length >= MIN_ITEMS ? options : ['?', '?', '?', '?'];
  const n = displayOptions.length;
  const segAngle = 360 / n;

  const fontSize = n <= 4 ? 13 : n <= 7 ? 11 : 9;
  const maxChars = n <= 4 ? 10 : n <= 7 ? 7 : 5;

  // ── Spin logic ───────────────────────────────────────────────────────────
  const handleSpin = () => {
    if (isSpinning) return;
    setError('');

    if (options.length < MIN_ITEMS) {
      setError(`Add at least ${MIN_ITEMS} options to spin.`);
      return;
    }

    // Pick winner before animation
    const winnerIdx = Math.floor(Math.random() * n);
    const winnerMidAngle = winnerIdx * segAngle + segAngle / 2;

    // Calculate how many additional degrees to rotate so the pointer (0° = top)
    // lands on the midpoint of the winner segment
    const prevNorm = ((totalAngle.current % 360) + 360) % 360;
    const targetNorm = (360 - winnerMidAngle + 360) % 360;
    let additional = (targetNorm - prevNorm + 360) % 360;
    if (additional < 20) additional += 360; // ensure a meaningful arc

    const finalAngle = totalAngle.current + SPIN_LAPS * 360 + additional;
    totalAngle.current = finalAngle;

    setIsSpinning(true);
    setSelected(null);

    Animated.timing(spinAnim, {
      toValue: finalAngle,
      duration: 3200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      const winner = options[winnerIdx];
      setSelected(winner);
      setHistory((prev) => limitHistory([...prev, winner]));
      setIsSpinning(false);
      trackAction(`Spun: ${winner}`);
    });
  };

  const handleReset = () => {
    if (isSpinning) return;
    setSelected(null);
    setHistory([]);
    setError('');
    spinAnim.setValue(0);
    totalAngle.current = 0;
  };

  // Interpolate raw degree value → CSS rotate string (extrapolate handles >360)
  const rotate = spinAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
    extrapolate: 'extend',
  });

  const rimColor = isDark ? '#1E293B' : '#CBD5E1';
  const centerRingColor = isDark ? '#0F172A' : '#FFFFFF';

  return (
    <ToolScreenLayout title="Spin Wheel" subtitle="Spin to pick an option.">

      <AppInput
        label="Options (one per line, 2–12 items)"
        value={optionsText}
        onChangeText={(t) => {
          setOptionsText(t);
          setError('');
          setSelected(null);
        }}
        multiline
        placeholder={'Option 1\nOption 2\nOption 3\nOption 4'}
      />

      {/* Error */}
      {error ? (
        <View style={[styles.errorCard, { backgroundColor: colors.errorLight, borderColor: colors.error + '55' }]}>
          <Text style={[typography.bodySmall, { color: colors.error }]}>{error}</Text>
        </View>
      ) : null}

      {/* ── Wheel area ─────────────────────────────────────────────────────── */}
      <View style={styles.wheelContainer}>
        {/* Fixed red pointer (downward triangle) at top of wheel */}
        <View style={styles.pointer} />

        {/* Wheel with absolute-positioned center button overlay */}
        <View style={[styles.wheelOuter, { width: wheelSize, height: wheelSize }]}>
          <Animated.View style={{ transform: [{ rotate }] }}>
            <Svg width={wheelSize} height={wheelSize}>
              {/* Outer rim ring */}
              <Circle cx={cx} cy={cy} r={outerR + 4} fill={rimColor} />

              {/* Pie segments */}
              {displayOptions.map((label, i) => {
                const startDeg = i * segAngle;
                const endDeg = (i + 1) * segAngle;
                const midDeg = startDeg + segAngle / 2;
                const tp = polarToXY(cx, cy, outerR * 0.63, midDeg);
                // Convert 0=top-clockwise to SVG rotation angle
                const textRot = midDeg - 90;

                return (
                  <G key={i}>
                    <Path
                      d={slicePath(cx, cy, outerR, startDeg, endDeg)}
                      fill={SEGMENT_COLORS[i % SEGMENT_COLORS.length]}
                    />
                    {/* White divider lines between segments */}
                    <Path
                      d={slicePath(cx, cy, outerR, startDeg, endDeg)}
                      fill="none"
                      stroke="rgba(255,255,255,0.35)"
                      strokeWidth={1.5}
                    />
                    <SvgText
                      x={tp.x}
                      y={tp.y}
                      fontSize={fontSize}
                      fontWeight="bold"
                      fill="#FFFFFF"
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      transform={`rotate(${textRot},${tp.x.toFixed(2)},${tp.y.toFixed(2)})`}
                    >
                      {clamp(label, maxChars)}
                    </SvgText>
                  </G>
                );
              })}

              {/* Center ring (not-spinning visual) */}
              <Circle cx={cx} cy={cy} r={innerR + 5} fill={centerRingColor} />
              <Circle cx={cx} cy={cy} r={innerR} fill={colors.primary} />
            </Svg>
          </Animated.View>

          {/* Non-animated center tap button layered above the SVG */}
          <Pressable
            onPress={handleSpin}
            disabled={isSpinning || options.length < MIN_ITEMS}
            style={[
              styles.centerBtn,
              {
                width: innerR * 2,
                height: innerR * 2,
                borderRadius: innerR,
                top: cy - innerR,
                left: cx - innerR,
              },
            ]}
          >
            <Ionicons
              name={isSpinning ? 'ellipsis-horizontal' : 'play'}
              size={20}
              color="#FFFFFF"
            />
          </Pressable>
        </View>
      </View>

      {/* ── Result card ─────────────────────────────────────────────────────── */}
      {selected && !isSpinning ? (
        <View style={[styles.resultCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.resultBar, { backgroundColor: colors.primary }]} />
          <View style={styles.resultInner}>
            <Text style={[typography.bodySmall, { color: colors.textSecondary, textAlign: 'center' }]}>
              🎯 Selected
            </Text>
            <Text style={[styles.resultText, { color: colors.primary }]} numberOfLines={2}>
              {selected}
            </Text>
          </View>
        </View>
      ) : null}

      {/* ── History ──────────────────────────────────────────────────────────── */}
      {history.length > 0 ? (
        <AppCard>
          <Text style={[typography.label, { marginBottom: spacing.sm }]}>Last 10 Spins</Text>
          <View style={styles.historyRow}>
            {history.map((item, idx) => (
              <View
                key={idx}
                style={[styles.historyChip, { backgroundColor: colors.surfaceContainer, borderColor: colors.border }]}
              >
                <Text
                  style={[typography.caption, { color: colors.textPrimary, fontWeight: '600' }]}
                  numberOfLines={1}
                >
                  {item}
                </Text>
              </View>
            ))}
          </View>
        </AppCard>
      ) : null}

      {/* ── Buttons ──────────────────────────────────────────────────────────── */}
      <AppButton
        title={isSpinning ? 'Spinning...' : 'SPIN'}
        onPress={handleSpin}
        disabled={isSpinning || options.length < MIN_ITEMS}
        fullWidth
        iconLeft="refresh-outline"
      />
      {(selected || history.length > 0) && !isSpinning ? (
        <AppButton title="Reset" onPress={handleReset} variant="secondary" fullWidth />
      ) : null}

    </ToolScreenLayout>
  );
}

const styles = StyleSheet.create({
  wheelContainer: {
    alignItems: 'center',
    paddingBottom: spacing.sm,
  },
  pointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 22,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#EF4444',
    zIndex: 10,
    marginBottom: -2,
  },
  wheelOuter: {
    position: 'relative',
  },
  centerBtn: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  errorCard: {
    borderRadius: radius.card,
    borderWidth: 1,
    padding: spacing.base,
  },
  resultCard: {
    borderRadius: radius.card,
    borderWidth: 1,
    overflow: 'hidden',
  },
  resultBar: {
    height: 4,
  },
  resultInner: {
    padding: spacing.base,
    alignItems: 'center',
    gap: spacing.xs,
  },
  resultText: {
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  historyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  historyChip: {
    borderRadius: radius.button,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    maxWidth: 130,
  },
});




