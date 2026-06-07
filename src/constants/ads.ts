/**
 * AdMob configuration for Toolverse.
 *
 * EXPO GO:
 * - Placeholder ads only. Native SDK is never loaded at runtime.
 *
 * NATIVE BUILD (expo run:android / EAS AAB):
 * - __DEV__ → Google test ad unit IDs (safe while developing).
 * - Production release → real Toolverse AdMob unit IDs below.
 *
 * app.json androidAppId must match ADMOB_APP_ID_ANDROID.
 */

// Google official test unit IDs — used only when __DEV__ is true.
export const TEST_BANNER_ID = 'ca-app-pub-3940256099942544/6300978111';
export const TEST_INTERSTITIAL_ID = 'ca-app-pub-3940256099942544/1033173712';

// Real Toolverse production ad unit IDs — used in release builds only.
export const PRODUCTION_BANNER_ID = 'ca-app-pub-7250284876062440/3858925935';
export const PRODUCTION_INTERSTITIAL_ID = 'ca-app-pub-7250284876062440/3170180707';

/** Must match app.json → react-native-google-mobile-ads → androidAppId */
export const ADMOB_APP_ID_ANDROID = 'ca-app-pub-7250284876062440~2450475494';

/** iOS app ID — replace when shipping iOS */
export const ADMOB_APP_ID_IOS = 'ca-app-pub-3940256099942544~1458002511';

/** Minimum gap between interstitial ads (ms) — avoids showing ads too often. */
export const INTERSTITIAL_COOLDOWN_MS = 90_000;

export function getBannerUnitId(): string {
  return __DEV__ ? TEST_BANNER_ID : PRODUCTION_BANNER_ID;
}

export function getInterstitialUnitId(): string {
  return __DEV__ ? TEST_INTERSTITIAL_ID : PRODUCTION_INTERSTITIAL_ID;
}
