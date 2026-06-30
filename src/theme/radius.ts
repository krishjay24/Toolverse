export const radius = {
  card: 20,
  button: 28,
  input: 16,
  tabBar: 24,
  icon: 14,
  sm: 8,
  full: 999,
} as const;

export type RadiusKey = keyof typeof radius;
