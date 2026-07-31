import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { BannerAdBox } from '@/components/ads/BannerAdBox';
import { spacing } from '@/theme';

interface DashboardAdSlotProps {
  visible?: boolean;
}

function DashboardAdSlotComponent({ visible = true }: DashboardAdSlotProps) {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <BannerAdBox />
    </View>
  );
}

export const DashboardAdSlot = memo(DashboardAdSlotComponent);

const styles = StyleSheet.create({
  wrapper: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
    width: '100%',
  },
});