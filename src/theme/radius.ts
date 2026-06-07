export const radius = {
  card: 20,
  button: 16,
  input: 16,
  tabBar: 24,
  sm: 8,
  full: 999,
} as const;

export type RadiusKey = keyof typeof radius;
