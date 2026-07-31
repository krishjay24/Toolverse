import type { ViewStyle } from 'react-native';
import type { ThemeColors } from './colors';
import { spacing } from './spacing';

export type SemanticAccent = 'primary' | 'success' | 'warning' | 'error' | 'purple' | 'teal';

export const designTokens = {
  light: {
    screenBackground: '#F8FAFC',
    cardBackground: '#FFFFFF',
    border: '#E2E8F0',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
    primary: '#2563EB',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    purple: '#8B5CF6',
    teal: '#14B8A6',
    radius: {
      card: 22,
      button: 22,
      icon: 16,
    },
    spacing,
    shadows: {
      card: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      },
      button: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
      },
    },
  },
  dark: {
    screenBackground: '#020617',
    cardBackground: '#0F172A',
    border: '#1E293B',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    primary: '#3B82F6',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#F87171',
    purple: '#A855F7',
    teal: '#2DD4BF',
    radius: {
      card: 22,
      button: 22,
      icon: 16,
    },
    spacing,
    shadows: {
      card: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
      },
      button: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
      },
    },
  },
} as const;

export const semanticAccents = {
  primary: 'primary',
  success: 'success',
  warning: 'warning',
  error: 'error',
  purple: 'purple',
  teal: 'teal',
} as const satisfies Record<string, SemanticAccent>;

export const settingsRowAccents: Record<string, SemanticAccent> = {
  'App version': 'primary',
  'Clear history': 'error',
  'Rate Toolverse': 'warning',
  'Share Toolverse': 'teal',
  'Send Feedback': 'primary',
  'Suggest a Tool': 'warning',
  'Report an Issue': 'error',
  'Privacy Policy': 'success',
  'Terms and Conditions': 'purple',
  'Terms & Conditions': 'purple',
  'About Toolverse': 'primary',
  Developer: 'teal',
};

export function getSemanticAccentColor(colors: ThemeColors, accent: SemanticAccent) {
  switch (accent) {
    case 'success':
      return colors.success;
    case 'warning':
      return colors.warning;
    case 'error':
      return colors.error;
    case 'purple':
      return colors.purple;
    case 'teal':
      return colors.teal;
    case 'primary':
    default:
      return colors.primary;
  }
}

export function getSettingsRowAccent(label: string): SemanticAccent {
  return settingsRowAccents[label] ?? 'primary';
}

export function getSurfaceCardStyle(colors: ThemeColors, isDark: boolean): ViewStyle {
  return {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: isDark ? 0 : 2 },
    shadowOpacity: isDark ? 0 : 0.05,
    shadowRadius: isDark ? 0 : 8,
    elevation: isDark ? 0 : 2,
  };
}