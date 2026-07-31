export const radius = {
  card: 22,
  button: 22,
  input: 16,
  tabBar: 24,
  icon: 16,
  sm: 8,
  full: 999,
} as const;

export type RadiusKey = keyof typeof radius;
