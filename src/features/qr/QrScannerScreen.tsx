import { useCallback, useState } from 'react';
import {
  Linking,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '@/components/ui/AppButton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ToolScreenLayout } from '@/components/tools/ToolScreenLayout';
import { useToolTracking } from '@/hooks/useToolTracking';
import { useTheme, spacing, radius, createTypography } from '@/theme';
import { copyToClipboard, showCopiedAlert } from '@/utils/clipboard';

function isUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

export function QrScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedValue, setScannedValue] = useState<string | null>(null);
  const [torch, setTorch] = useState(false);
  const trackAction = useToolTracking('qr-scanner');
  const { colors } = useTheme();
  const typography = createTypography(colors);
  const { width: screenWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const frameSize = Math.min(screenWidth * 0.65, 260);

  const handleBarCodeScanned = useCallback(
    async (result: BarcodeScanningResult) => {
      if (scannedValue || !result.data) return;
      setScannedValue(result.data);
      trackAction(result.data.slice(0, 80));

      if (isUrl(result.data) && (await Linking.canOpenURL(result.data))) {
        await Linking.openURL(result.data);
      }
    },
    [scannedValue, trackAction],
  );

  const handleScanAgain = () => setScannedValue(null);

  const handleShare = async () => {
    if (scannedValue) await Share.share({ message: scannedValue });
  };

  const handleCopy = async () => {
    if (scannedValue && (await copyToClipboard(scannedValue))) showCopiedAlert();
  };

  const handleOpenLink = async () => {
    if (scannedValue && isUrl(scannedValue) && (await Linking.canOpenURL(scannedValue))) {
      await Linking.openURL(scannedValue);
    }
  };

  if (!permission) {
    return (
      <ToolScreenLayout title="QR Scanner">
        <EmptyState icon="camera-outline" title="Checking camera" description="Verifying permissions..." />
      </ToolScreenLayout>
    );
  }

  if (!permission.granted) {
    return (
      <ToolScreenLayout title="QR Scanner">
        <EmptyState
          icon="camera-outline"
          title="Camera access needed"
          description="Allow camera access to scan QR codes on your device."
          actionTitle="Grant permission"
          onAction={requestPermission}
        />
      </ToolScreenLayout>
    );
  }

  return (
    <View style={styles.screen}>
      {/* Full-screen camera */}
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        enableTorch={torch}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={scannedValue ? undefined : handleBarCodeScanned}
      />

      {/* Dark overlay with cutout effect */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.overlayTop} />
        <View style={styles.overlayMiddleRow}>
          <View style={[styles.overlaySide, { flex: (screenWidth - frameSize) / 2 / screenWidth }]} />
          <View style={[styles.frameBox, { width: frameSize, height: frameSize }]}>
            <View style={[styles.corner, styles.cornerTL, { borderColor: colors.primary }]} />
            <View style={[styles.corner, styles.cornerTR, { borderColor: colors.primary }]} />
            <View style={[styles.corner, styles.cornerBL, { borderColor: colors.primary }]} />
            <View style={[styles.corner, styles.cornerBR, { borderColor: colors.primary }]} />
          </View>
          <View style={[styles.overlaySide, { flex: (screenWidth - frameSize) / 2 / screenWidth }]} />
        </View>
        <View style={styles.overlayBottom} />
      </View>

      {/* Top bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable
          style={[styles.circleBtn, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
          onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/home')}
        >
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.instructionTitle}>QR Scanner</Text>
        <View style={styles.torchGalleryRow}>
          <Pressable
            style={[styles.circleBtn, { backgroundColor: torch ? colors.primary : 'rgba(0,0,0,0.5)' }]}
            onPress={() => setTorch((t) => !t)}
          >
            <Ionicons name={torch ? 'flash' : 'flash-outline'} size={20} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>

      {/* Instruction text */}
      <View style={[styles.instructionWrap, { top: '25%' }]} pointerEvents="none">
        <Text style={styles.instructionTitle}>Scan QR Code</Text>
        <Text style={styles.instructionSub}>Align the QR code within the frame</Text>
      </View>

      {/* Auto-focus status */}
      <View style={styles.actionRow} pointerEvents="none">
        <View style={[styles.scanStatusPill, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <Ionicons name="radio-button-on" size={10} color={scannedValue ? colors.success : '#FFFFFF'} />
          <Text style={styles.scanStatusText}>
            {scannedValue ? 'Scanned' : 'Auto-focusing...'}
          </Text>
        </View>
      </View>

      {/* Result bottom sheet */}
      {scannedValue ? (
        <View style={[styles.resultSheet, { backgroundColor: colors.surface }]}>
          <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />

          <View style={styles.sheetHeader}>
            <View style={[styles.sheetIconCircle, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="qr-code-outline" size={20} color={colors.primary} />
            </View>
            <Text style={[typography.h3, { flex: 1 }]}>Scan Result</Text>
            <Pressable onPress={handleScanAgain} hitSlop={8}>
              <Ionicons name="close-outline" size={24} color={colors.textSecondary} />
            </Pressable>
          </View>

          <View style={[styles.resultBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={[typography.caption, { color: colors.textSecondary, marginBottom: 4 }]}>
              Decoded Content
            </Text>
            <Text style={[typography.label, { color: colors.primary }]} numberOfLines={3}>
              {scannedValue}
            </Text>
          </View>

          <View style={styles.sheetActions}>
            {isUrl(scannedValue) ? (
              <AppButton
                title="Open Link"
                onPress={handleOpenLink}
                iconLeft="open-outline"
                fullWidth
              />
            ) : null}
            <View style={styles.sheetSecondaryRow}>
              <View style={styles.sheetActionHalf}>
                <AppButton title="Copy" onPress={handleCopy} variant="secondary" iconLeft="copy-outline" fullWidth />
              </View>
              <View style={styles.sheetActionHalf}>
                <AppButton title="Share" onPress={handleShare} variant="secondary" iconLeft="share-outline" fullWidth />
              </View>
            </View>
            <AppButton title="Scan Again" onPress={handleScanAgain} variant="ghost" fullWidth />
          </View>
        </View>
      ) : null}
    </View>
  );
}

const CORNER_SIZE = 28;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlayTop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  overlayMiddleRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  overlaySide: {
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  frameBox: {
    position: 'relative',
  },
  overlayBottom: {
    flex: 2,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderWidth: 3,
  },
  cornerTL: {
    top: 0, left: 0,
    borderRightWidth: 0, borderBottomWidth: 0,
    borderTopLeftRadius: 8,
  },
  cornerTR: {
    top: 0, right: 0,
    borderLeftWidth: 0, borderBottomWidth: 0,
    borderTopRightRadius: 8,
  },
  cornerBL: {
    bottom: 0, left: 0,
    borderRightWidth: 0, borderTopWidth: 0,
    borderBottomLeftRadius: 8,
  },
  cornerBR: {
    bottom: 0, right: 0,
    borderLeftWidth: 0, borderTopWidth: 0,
    borderBottomRightRadius: 8,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screen,
    paddingBottom: spacing.base,
  },
  torchGalleryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  instructionWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: spacing.xs,
  },
  instructionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  instructionSub: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    fontWeight: '400',
  },
  actionRow: {
    position: 'absolute',
    bottom: 360,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  circleBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  scanStatusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  resultSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.screen,
    paddingBottom: 40,
    gap: spacing.base,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.sm,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  sheetIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultBox: {
    borderWidth: 1,
    borderRadius: radius.card,
    padding: spacing.base,
  },
  sheetActions: {
    gap: spacing.sm,
  },
  sheetSecondaryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  sheetActionHalf: {
    flex: 1,
  },
});
