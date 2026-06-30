import { useRef, useState } from 'react';
import { Share, StyleSheet, Text, View } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import QRCode from 'react-native-qrcode-svg';
import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { ToolActionRow } from '@/components/tools/ToolActionRow';
import { ToolScreenLayout } from '@/components/tools/ToolScreenLayout';
import { useToolTracking } from '@/hooks/useToolTracking';
import { useTheme, spacing, radius, createTypography } from '@/theme';
import { showCopiedAlert, copyToClipboard } from '@/utils/clipboard';
import { qrContentSchema } from '@/utils/validators';

interface QrCodeRef {
  toDataURL: (callback: (dataUrl: string) => void) => void;
}

export function QrGeneratorScreen() {
  const [value, setValue] = useState('');
  const [generatedValue, setGeneratedValue] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [sharingQr, setSharingQr] = useState(false);
  const qrRef = useRef<QrCodeRef | null>(null);
  const trackAction = useToolTracking('qr-generator');
  const { colors } = useTheme();
  const typography = createTypography(colors);

  const handleGenerate = () => {
    const result = qrContentSchema.safeParse(value);
    if (!result.success) {
      setError(result.error.issues[0]?.message);
      return;
    }
    setError(undefined);
    setGeneratedValue(result.data);
    trackAction(`Created QR from text`);
  };

  const handleClear = () => {
    setValue('');
    setGeneratedValue('');
    setError(undefined);
  };

  const handleShareText = async () => {
    if (generatedValue) await Share.share({ message: generatedValue });
  };

  const handleCopy = async () => {
    if (generatedValue && (await copyToClipboard(generatedValue))) showCopiedAlert();
  };

  const handleShareQrImage = () => {
    if (!qrRef.current) return;
    setSharingQr(true);
    qrRef.current.toDataURL(async (dataUrl: string) => {
      try {
        const base64 = dataUrl.replace(/^data:image\/png;base64,/, '');
        const fileUri = `${FileSystem.cacheDirectory}toolverse-qr-${Date.now()}.png`;
        await FileSystem.writeAsStringAsync(fileUri, base64, {
          encoding: FileSystem.EncodingType.Base64,
        });
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, { mimeType: 'image/png', dialogTitle: 'Share QR code' });
        }
      } finally {
        setSharingQr(false);
      }
    });
  };

  return (
    <ToolScreenLayout title="QR Generator" subtitle="Create QR codes instantly">
      {/* Input section */}
      <View style={[styles.inputSection, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[typography.caption, { color: colors.primary, textTransform: 'uppercase', letterSpacing: 0.8 }]}>
          Content Source
        </Text>
        <AppInput
          label="URL or Text"
          placeholder="https://toolverse.app"
          value={value}
          onChangeText={setValue}
          error={error}
          helperText="Works with links, plain text, and short messages."
          multiline
          autoCapitalize="none"
        />
      </View>

      <AppButton title="Generate QR Code" onPress={handleGenerate} fullWidth iconLeft="qr-code-outline" />

      {generatedValue ? (
        <>
          {/* QR preview card */}
          <View style={[styles.previewCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.qrWrap, { backgroundColor: '#FFFFFF', borderColor: colors.border }]}>
              <QRCode
                value={generatedValue}
                size={220}
                color={colors.textPrimary}
                backgroundColor="#FFFFFF"
                getRef={(ref: QrCodeRef) => { qrRef.current = ref; }}
              />
            </View>

            {/* Format info row */}
            <View style={styles.formatRow}>
              <View style={[styles.formatChip, { backgroundColor: colors.background }]}>
                <Text style={[typography.caption, { color: colors.textSecondary }]}>Size</Text>
                <Text style={[typography.label, { color: colors.textPrimary, fontSize: 12 }]}>1024×1024</Text>
              </View>
              <View style={[styles.formatChip, { backgroundColor: colors.background }]}>
                <Text style={[typography.caption, { color: colors.textSecondary }]}>Format</Text>
                <Text style={[typography.label, { color: colors.textPrimary, fontSize: 12 }]}>PNG</Text>
              </View>
            </View>

            <Text style={[typography.bodySmall, { color: colors.textSecondary, textAlign: 'center' }]} numberOfLines={3}>
              {generatedValue}
            </Text>
          </View>

          <ToolActionRow onShare={handleShareText} onCopy={handleCopy} shareLabel="Share text" copyLabel="Copy" />
          <AppButton
            title="Share QR Image"
            onPress={handleShareQrImage}
            loading={sharingQr}
            variant="secondary"
            iconLeft="share-outline"
            fullWidth
          />
          <AppButton title="Clear" onPress={handleClear} variant="ghost" fullWidth />
        </>
      ) : null}

      {/* Tip */}
      <View style={[styles.tipBanner, { backgroundColor: colors.primaryLight }]}>
        <Text style={[typography.bodySmall, { color: colors.primary }]}>
          💡 Generated QR codes are automatically saved to your history for later access.
        </Text>
      </View>
    </ToolScreenLayout>
  );
}

const styles = StyleSheet.create({
  inputSection: {
    borderRadius: radius.card,
    borderWidth: 1,
    padding: spacing.base,
    gap: spacing.sm,
  },
  previewCard: {
    borderRadius: radius.card,
    borderWidth: 1,
    padding: spacing.base,
    alignItems: 'center',
    gap: spacing.base,
  },
  qrWrap: {
    padding: spacing.lg,
    borderRadius: radius.card,
    borderWidth: 1,
  },
  formatRow: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
  formatChip: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    gap: 2,
  },
  tipBanner: {
    borderRadius: radius.card,
    padding: spacing.base,
  },
});
