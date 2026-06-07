import { useCallback, useState } from 'react';
import {
  Linking,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { ToolActionRow } from '@/components/tools/ToolActionRow';
import { ToolInsightBanner } from '@/components/tools/ToolInsightBanner';
import { ToolScreenLayout } from '@/components/tools/ToolScreenLayout';
import { useToolTracking } from '@/hooks/useToolTracking';
import { useTheme, spacing, createTypography } from '@/theme';
import { copyToClipboard, showCopiedAlert } from '@/utils/clipboard';

function isUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

export function QrScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedValue, setScannedValue] = useState<string | null>(null);
  const [openedLink, setOpenedLink] = useState(false);
  const trackAction = useToolTracking('qr-scanner');
  const { colors } = useTheme();
  const typography = createTypography(colors);

  const handleBarCodeScanned = useCallback(
    async (result: BarcodeScanningResult) => {
      if (scannedValue || !result.data) {
        return;
      }
      setScannedValue(result.data);
      trackAction(result.data.slice(0, 80));

      if (isUrl(result.data)) {
        const canOpen = await Linking.canOpenURL(result.data);
        if (canOpen) {
          await Linking.openURL(result.data);
          setOpenedLink(true);
        }
      }
    },
    [scannedValue, trackAction],
  );

  const handleScanAgain = () => {
    setScannedValue(null);
    setOpenedLink(false);
  };

  const handleShare = async () => {
    if (scannedValue) {
      await Share.share({ message: scannedValue });
    }
  };

  const handleCopy = async () => {
    if (scannedValue && (await copyToClipboard(scannedValue))) {
      showCopiedAlert();
    }
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

  if (scannedValue) {
    const url = isUrl(scannedValue);
    return (
      <ToolScreenLayout title="Scan result" subtitle="QR code decoded">
        {url && openedLink ? (
          <ToolInsightBanner
            icon="open-outline"
            title="Link opened"
            description="The scanned URL was opened in your browser. Copy or share it below if needed."
          />
        ) : null}
        <AppCard style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <View style={[styles.typeBadge, { backgroundColor: url ? colors.primaryLight : colors.background }]}>
              <Ionicons
                name={url ? 'link-outline' : 'document-text-outline'}
                size={16}
                color={colors.primary}
              />
              <Text style={[typography.caption, { color: colors.primary, fontWeight: '600' }]}>
                {url ? 'URL detected' : 'Text content'}
              </Text>
            </View>
          </View>
          <TextInput
            style={[typography.body, styles.resultInput, { color: colors.textPrimary, borderColor: colors.border }]}
            value={scannedValue}
            editable={false}
            multiline
            selectTextOnFocus
          />
          <ToolActionRow onCopy={handleCopy} onShare={handleShare} />
          {url ? (
            <AppButton title="Open link again" onPress={handleOpenLink} iconLeft="open-outline" fullWidth />
          ) : null}
          <AppButton title="Scan again" onPress={handleScanAgain} variant="ghost" fullWidth />
        </AppCard>
      </ToolScreenLayout>
    );
  }

  return (
    <ToolScreenLayout title="QR Scanner" subtitle="Point at a QR code">
      <ToolInsightBanner
        icon="scan-outline"
        title="Auto-open links"
        description="URLs open instantly in your browser. Text codes show copy & share options."
      />
      <View style={styles.scannerFrame}>
        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={handleBarCodeScanned}
        />
        <View style={styles.overlay}>
          <View style={[styles.scanBox, { borderColor: colors.primary }]} />
          <View style={[styles.corner, styles.cornerTL, { borderColor: colors.primary }]} />
          <View style={[styles.corner, styles.cornerTR, { borderColor: colors.primary }]} />
          <View style={[styles.corner, styles.cornerBL, { borderColor: colors.primary }]} />
          <View style={[styles.corner, styles.cornerBR, { borderColor: colors.primary }]} />
        </View>
      </View>
      <Text style={[typography.bodySmall, styles.hint]}>Align the QR code within the frame</Text>
    </ToolScreenLayout>
  );
}

const CORNER = 24;
const styles = StyleSheet.create({
  scannerFrame: {
    height: 340,
    borderRadius: 20,
    overflow: 'hidden',
  },
  camera: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanBox: {
    width: 230,
    height: 230,
    borderWidth: 1,
    borderRadius: 20,
    opacity: 0.3,
  },
  corner: {
    position: 'absolute',
    width: CORNER,
    height: CORNER,
    borderWidth: 3,
  },
  cornerTL: { top: '28%', left: '18%', borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 8 },
  cornerTR: { top: '28%', right: '18%', borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 8 },
  cornerBL: { bottom: '28%', left: '18%', borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 8 },
  cornerBR: { bottom: '28%', right: '18%', borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 8 },
  hint: { textAlign: 'center' },
  resultCard: { gap: spacing.md },
  resultHeader: { flexDirection: 'row' },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  resultInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing.md,
    minHeight: 80,
    textAlignVertical: 'top',
  },
});
