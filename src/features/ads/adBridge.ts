import Constants, { ExecutionEnvironment } from 'expo-constants';

/**
 * Runtime bridge between Expo Go (placeholders) and native AdMob SDK.
 *
 * Expo Go reports executionEnvironment === 'storeClient' and does NOT include
 * RNGoogleMobileAdsModule — never import adMob.native.ts in that case.
 */

export type NativeAdMobModule = typeof import('./adMob.native');

let nativeModuleCache: NativeAdMobModule | null | undefined;

export function isNativeAdMobAvailable(): boolean {
  return Constants.executionEnvironment !== ExecutionEnvironment.StoreClient;
}

export async function loadNativeAdMobModule(): Promise<NativeAdMobModule | null> {
  if (!isNativeAdMobAvailable()) {
    return null;
  }
  if (nativeModuleCache !== undefined) {
    return nativeModuleCache;
  }
  try {
    nativeModuleCache = await import('./adMob.native');
    return nativeModuleCache;
  } catch {
    nativeModuleCache = null;
    return null;
  }
}
