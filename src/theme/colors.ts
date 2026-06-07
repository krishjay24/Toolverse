export interface ThemeColors {
  primary: string;
  primaryLight: string;
  background: string;
  surface: string;
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
  primary: '#2563EB',
  primaryLight: '#DBEAFE',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  success: '#16A34A',
  successLight: '#DCFCE7',
  warning: '#F59E0B',
  error: '#DC2626',
  errorLight: '#FEE2E2',
  overlay: 'rgba(15, 23, 42, 0.4)',
};

export const darkColors: ThemeColors = {
  primary: '#3B82F6',
  primaryLight: '#1E3A5F',
  background: '#0F172A',
  surface: '#1E293B',
  textPrimary: '#F8FAFC',
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
