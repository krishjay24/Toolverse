import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from '@/theme';

const TAB_BAR_BASE_HEIGHT = 72;

export function useTabBarInset(): number {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, spacing.base);
  return TAB_BAR_BASE_HEIGHT + bottomPadding;
}
