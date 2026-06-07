import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as FileSystem from 'expo-file-system/legacy';
import { Alert, Platform } from 'react-native';

const { StorageAccessFramework } = FileSystem;

const DOWNLOADS_DIR_KEY = '@toolverse/downloads_directory_uri';

function isExpoGo(): boolean {
  return Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
}

async function writeImageToSafDirectory(
  directoryUri: string,
  sourceUri: string,
  mimeType: string,
): Promise<void> {
  const base64 = await FileSystem.readAsStringAsync(sourceUri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const fileName = `toolverse-image-${Date.now()}`;
  const destUri = await StorageAccessFramework.createFileAsync(
    directoryUri,
    fileName,
    mimeType,
  );
  await StorageAccessFramework.writeAsStringAsync(destUri, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });
}

async function getCachedDownloadsDirectory(): Promise<string | null> {
  return AsyncStorage.getItem(DOWNLOADS_DIR_KEY);
}

async function cacheDownloadsDirectory(directoryUri: string): Promise<void> {
  await AsyncStorage.setItem(DOWNLOADS_DIR_KEY, directoryUri);
}

async function requestDownloadsDirectoryOnce(): Promise<string | null> {
  const cached = await getCachedDownloadsDirectory();
  if (cached) {
    return cached;
  }

  const downloadsUri = StorageAccessFramework.getUriForDirectoryInRoot('Download');
  const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync(downloadsUri);
  if (!permissions.granted) {
    return null;
  }

  await cacheDownloadsDirectory(permissions.directoryUri);
  return permissions.directoryUri;
}

/**
 * Saves to Downloads via Storage Access Framework.
 * The Downloads folder is remembered after the first grant — no repeated folder picker.
 */
async function saveToAndroidDownloads(
  sourceUri: string,
  mimeType: string,
): Promise<{ success: boolean; message: string }> {
  const isFirstSetup = !(await getCachedDownloadsDirectory());

  try {
    const directoryUri = await requestDownloadsDirectoryOnce();
    if (!directoryUri) {
      return {
        success: false,
        message: 'Allow Downloads access once. After that, images save automatically.',
      };
    }

    await writeImageToSafDirectory(directoryUri, sourceUri, mimeType);
    return {
      success: true,
      message: isFirstSetup
        ? 'Image saved to Downloads. Future saves will not ask again.'
        : 'Image saved to Downloads.',
    };
  } catch {
    await AsyncStorage.removeItem(DOWNLOADS_DIR_KEY);
    try {
      const directoryUri = await requestDownloadsDirectoryOnce();
      if (!directoryUri) {
        return { success: false, message: 'Could not access Downloads folder.' };
      }
      await writeImageToSafDirectory(directoryUri, sourceUri, mimeType);
      return { success: true, message: 'Image saved to Downloads.' };
    } catch {
      return { success: false, message: 'Could not save image. Please try again.' };
    }
  }
}

/**
 * Standard app-style save via MediaStore (dev / production builds).
 * One-time photo permission — no folder picker. Not available in Expo Go.
 */
async function saveWithMediaLibrary(
  uri: string,
): Promise<{ success: boolean; message: string } | null> {
  if (isExpoGo()) {
    return null;
  }

  try {
    const MediaLibrary = await import('expo-media-library');
    const { status } = await MediaLibrary.requestPermissionsAsync(true, ['photo']);
    if (status !== 'granted') {
      return { success: false, message: 'Allow photo access to save images to your gallery.' };
    }

    await MediaLibrary.Asset.create(uri);
    return { success: true, message: 'Image saved to your gallery.' };
  } catch {
    return null;
  }
}

export async function saveImageToGallery(
  uri: string,
  _albumName = 'Toolverse',
  mimeType = 'image/jpeg',
): Promise<{ success: boolean; message: string }> {
  const galleryResult = await saveWithMediaLibrary(uri);
  if (galleryResult?.success) {
    return galleryResult;
  }
  if (galleryResult && !galleryResult.success) {
    return galleryResult;
  }

  if (Platform.OS === 'android') {
    return saveToAndroidDownloads(uri, mimeType);
  }

  return {
    success: false,
    message: galleryResult?.message ?? 'Could not save the image.',
  };
}

export async function saveBase64ImageToGallery(
  base64: string,
  filename: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const fileUri = `${FileSystem.cacheDirectory}${filename}`;
    await FileSystem.writeAsStringAsync(fileUri, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return saveImageToGallery(fileUri);
  } catch {
    return { success: false, message: 'Could not prepare the image for saving.' };
  }
}

export function showSaveResult(result: { success: boolean; message: string }) {
  Alert.alert(result.success ? 'Downloaded' : 'Download failed', result.message);
}
