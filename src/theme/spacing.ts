export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  /** Screen-level horizontal padding per design spec (20px) */
  screen: 20,
  /** Standard section gap (24px) */
  section: 24,
} as const;

export type SpacingKey = keyof typeof spacing;
