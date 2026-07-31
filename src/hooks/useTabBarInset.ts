import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from '@/theme';

export function useTabBarInset(): number {
  const insets = useSafeAreaInsets();
  return Math.max(insets.bottom, spacing.base);
}
