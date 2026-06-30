export interface ThemeColors {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  background: string;
  surface: string;
  surfaceContainer: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  success: string;
  successLight: string;
  warning: string;
  error: string;
  errorLight: string;
  overlay: string;
}

export const lightColors: ThemeColors = {
  primary: '#0B5CFF',
  primaryDark: '#0046CC',
  primaryLight: '#EAF1FF',
  background: '#F7F8FC',
  surface: '#FFFFFF',
  surfaceContainer: '#F0F4FF',
  textPrimary: '#111827',
  textSecondary: '#64748B',
  border: '#D7DCE8',
  success: '#16A34A',
  successLight: '#DCFCE7',
  warning: '#F59E0B',
  error: '#DC2626',
  errorLight: '#FEE2E2',
  overlay: 'rgba(15, 23, 42, 0.4)',
};

export const darkColors: ThemeColors = {
  primary: '#4D7EFF',
  primaryDark: '#0046CC',
  primaryLight: '#1A2E5A',
  background: '#0F172A',
  surface: '#1E293B',
  surfaceContainer: '#162035',
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  border: '#334155',
  success: '#22C55E',
  successLight: '#14532D',
  warning: '#FBBF24',
  error: '#EF4444',
  errorLight: '#450A0A',
  overlay: 'rgba(0, 0, 0, 0.6)',
};

/** @deprecated Use useTheme().colors instead */
export const colors = lightColors;

export type ColorKey = keyof ThemeColors;
