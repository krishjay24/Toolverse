import { TextStyle } from 'react-native';
import type { ThemeColors } from './colors';

export function createTypography(colors: ThemeColors) {
  return {
    h1: {
      fontSize: 28,
      fontWeight: '700',
      lineHeight: 34,
      color: colors.textPrimary,
      letterSpacing: -0.5,
    } satisfies TextStyle,
    h2: {
      fontSize: 22,
      fontWeight: '700',
      lineHeight: 28,
      color: colors.textPrimary,
      letterSpacing: -0.3,
    } satisfies TextStyle,
    h3: {
      fontSize: 20,
      fontWeight: '700',
      lineHeight: 26,
      color: colors.textPrimary,
    } satisfies TextStyle,
    body: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
      color: colors.textPrimary,
    } satisfies TextStyle,
    bodySmall: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
      color: colors.textSecondary,
    } satisfies TextStyle,
    label: {
      fontSize: 14,
      fontWeight: '600',
      lineHeight: 20,
      color: colors.textPrimary,
    } satisfies TextStyle,
    caption: {
      fontSize: 12,
      fontWeight: '500',
      lineHeight: 16,
      color: colors.textMuted,
    } satisfies TextStyle,
    button: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 22,
      color: colors.surface,
    } satisfies TextStyle,
  } as const;
}

export type Typography = ReturnType<typeof createTypography>;

/** Static light typography for legacy StyleSheet modules */
import { lightColors } from './colors';
export const typography = createTypography(lightColors);
