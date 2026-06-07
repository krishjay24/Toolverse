/**
 * Expo Go-safe ad facade — safe to import from hooks and screens.
 *
 * EXPO GO:
 * - isNativeAdMobAvailable() is false → all calls are no-ops.
 * - react-native-google-mobile-ads is never loaded → no RNGoogleMobileAdsModule crash.
 *
 * NATIVE BUILD:
 * - Dynamically loads adMob.native.ts and runs real interstitial logic.
 * - Interstitials show only after successful tool actions (useToolTracking).
 * - Cooldown enforced in adMob.native.ts (not on app open).
 */

import { isNativeAdMobAvailable, loadNativeAdMobModule } from './adBridge';

export function initializeAdMob(): void {
  if (!isNativeAdMobAvailable()) {
    return;
  }
  void loadNativeAdMobModule().then((mod) => mod?.initializeAdMob());
}

export function preloadInterstitialAd(): void {
  if (!isNativeAdMobAvailable()) {
    return;
  }
  void loadNativeAdMobModule().then((mod) => mod?.preloadInterstitialAd());
}

export function showInterstitialAfterAction(): void {
  if (!isNativeAdMobAvailable()) {
    return;
  }
  void loadNativeAdMobModule().then((mod) => mod?.showInterstitialAfterAction());
}
