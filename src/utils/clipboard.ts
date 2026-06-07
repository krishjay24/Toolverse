import * as Clipboard from 'expo-clipboard';
import { Alert } from 'react-native';

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await Clipboard.setStringAsync(text);
    return true;
  } catch {
    return false;
  }
}

export function showCopiedAlert() {
  Alert.alert('Copied', 'Content copied to clipboard.');
}
