import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Alert, Platform } from 'react-native';

const { StorageAccessFramework } = FileSystem;

const DOWNLOADS_DIR_KEY = '@toolverse/downloads_directory_uri';

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

async function saveWithShareSheet(
  uri: string,
  mimeType: string,
): Promise<{ success: boolean; message: string }> {
  if (!(await Sharing.isAvailableAsync())) {
    return { success: false, message: 'Sharing is not available on this device.' };
  }

  await Sharing.shareAsync(uri, {
    mimeType,
    dialogTitle: 'Save image',
  });
  return {
    success: true,
    message: 'Use Save or Save to Files to keep the image on your device.',
  };
}

export async function saveImageToGallery(
  uri: string,
  _albumName = 'Toolverse',
  mimeType = 'image/jpeg',
): Promise<{ success: boolean; message: string }> {
  if (Platform.OS === 'android') {
    return saveToAndroidDownloads(uri, mimeType);
  }

  return saveWithShareSheet(uri, mimeType);
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
