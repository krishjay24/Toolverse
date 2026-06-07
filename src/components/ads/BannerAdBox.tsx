import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { BannerAd as BannerAdType, BannerAdSize as BannerAdSizeType } from 'react-native-google-mobile-ads';
import { AdPlaceholder } from './AdPlaceholder';
import { isNativeAdMobAvailable, loadNativeAdMobModule } from '@/features/ads/adBridge';
import { spacing } from '@/theme';

/**
 * Banner ad slot — Expo Go safe.
 *
 * EXPO GO: Renders AdPlaceholder. No native SDK import.
 * NATIVE BUILD: Loads BannerAd dynamically (Home + Tools screens only).
 *
 * Unit IDs: test ads in __DEV__, production IDs in release builds.
 * See src/constants/ads.ts
 */

type BannerAdComponent = typeof BannerAdType;
type BannerAdSizeEnum = typeof BannerAdSizeType;

export function BannerAdBox() {
  const [nativeAd, setNativeAd] = useState<{
    BannerAd: BannerAdComponent;
    BannerAdSize: BannerAdSizeEnum;
    unitId: string;
  } | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!isNativeAdMobAvailable()) {
      return;
    }
    loadNativeAdMobModule()
      .then((mod) => {
        if (!mod) {
          setFailed(true);
          return;
        }
        setNativeAd({
          BannerAd: mod.BannerAd,
          BannerAdSize: mod.BannerAdSize,
          unitId: mod.bannerUnitId,
        });
      })
      .catch(() => setFailed(true));
  }, []);

  if (!isNativeAdMobAvailable() || failed || !nativeAd) {
    return (
      <View style={styles.wrapper}>
        <AdPlaceholder />
      </View>
    );
  }

  const { BannerAd, BannerAdSize, unitId } = nativeAd;

  return (
    <View style={styles.wrapper}>
      <BannerAd
        unitId={unitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        onAdFailedToLoad={() => setFailed(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginVertical: spacing.sm,
    width: '100%',
  },
});
