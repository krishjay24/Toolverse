/**
 * NATIVE-ONLY AdMob SDK — loaded via dynamic import from adBridge.ts.
 *
 * EXPO GO: This file is never imported (isNativeAdMobAvailable() === false).
 * NATIVE BUILD: Banner + interstitial ads use the real Google Mobile Ads SDK.
 *
 * Do not add static imports of this file anywhere in the Expo Go code path.
 */

import mobileAds, {
  AdEventType,
  BannerAd,
  BannerAdSize,
  InterstitialAd,
} from 'react-native-google-mobile-ads';
import {
  getBannerUnitId,
  getInterstitialUnitId,
  INTERSTITIAL_COOLDOWN_MS,
} from '@/constants/ads';

export const bannerUnitId = getBannerUnitId();
const interstitialUnitId = getInterstitialUnitId();

let interstitial: InterstitialAd | null = null;
let isInterstitialLoaded = false;
let lastInterstitialShownAt = 0;

export function initializeAdMob(): void {
  mobileAds()
    .initialize()
    .then(() => {
      preloadInterstitialAd();
    })
    .catch(() => {
      // Ads must never crash the app.
    });
}

export function preloadInterstitialAd(): void {
  try {
    interstitial = InterstitialAd.createForAdRequest(interstitialUnitId);
    interstitial.addAdEventListener(AdEventType.LOADED, () => {
      isInterstitialLoaded = true;
    });
    interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      isInterstitialLoaded = false;
      preloadInterstitialAd();
    });
    interstitial.addAdEventListener(AdEventType.ERROR, () => {
      isInterstitialLoaded = false;
      // Retry so a single failed load does not permanently disable interstitials.
      setTimeout(() => {
        preloadInterstitialAd();
      }, 5_000);
    });
    interstitial.load();
  } catch {
    isInterstitialLoaded = false;
  }
}

/**
 * Show interstitial after a successful tool action only.
 * Respects cooldown so ads are not shown too frequently.
 */
export function showInterstitialAfterAction(): void {
  try {
    const now = Date.now();
    if (now - lastInterstitialShownAt < INTERSTITIAL_COOLDOWN_MS) {
      return;
    }
    if (interstitial && isInterstitialLoaded) {
      interstitial.show();
      isInterstitialLoaded = false;
      lastInterstitialShownAt = now;
    }
  } catch {
    // Never block user flow if ads fail.
  }
}

export { BannerAd, BannerAdSize };
