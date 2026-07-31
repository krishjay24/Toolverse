export interface ThemeColors {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  background: string;
  surface: string;
  surfaceContainer: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  success: string;
  successLight: string;
  warning: string;
  error: string;
  errorLight: string;
  purple: string;
  teal: string;
  overlay: string;
}

export const lightColors: ThemeColors = {
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  primaryLight: '#DBEAFE',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceContainer: '#F1F5F9',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  border: '#E2E8F0',
  success: '#10B981',
  successLight: '#DCFCE7',
  warning: '#F59E0B',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  purple: '#8B5CF6',
  teal: '#14B8A6',
  overlay: 'rgba(15, 23, 42, 0.4)',
};

export const darkColors: ThemeColors = {
  primary: '#3B82F6',
  primaryDark: '#1D4ED8',
  primaryLight: '#172554',
  background: '#020617',
  surface: '#0F172A',
  surfaceContainer: '#1E293B',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  border: '#1E293B',
  success: '#22C55E',
  successLight: '#14532D',
  warning: '#F59E0B',
  error: '#F87171',
  errorLight: '#450A0A',
  purple: '#A855F7',
  teal: '#2DD4BF',
  overlay: 'rgba(0, 0, 0, 0.6)',
};

/** @deprecated Use useTheme().colors instead */
export const colors = lightColors;

export type ColorKey = keyof ThemeColors;
