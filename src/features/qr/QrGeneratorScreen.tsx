import { useRef, useState } from 'react';
import { Share, StyleSheet, Text, View } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import QRCode from 'react-native-qrcode-svg';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppInput } from '@/components/ui/AppInput';
import { ToolActionRow } from '@/components/tools/ToolActionRow';
import { ToolInsightBanner } from '@/components/tools/ToolInsightBanner';
import { ToolScreenLayout } from '@/components/tools/ToolScreenLayout';
import { useToolTracking } from '@/hooks/useToolTracking';
import { useTheme, createTypography } from '@/theme';
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
    if (generatedValue) {
      await Share.share({ message: generatedValue });
    }
  };

  const handleCopy = async () => {
    if (generatedValue && (await copyToClipboard(generatedValue))) {
      showCopiedAlert();
    }
  };

  const handleShareQrImage = () => {
    if (!qrRef.current) {
      return;
    }
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
      <ToolInsightBanner
        icon="flash-outline"
        title="Create in seconds"
        description="Enter any text or URL. Share the code or copy the content when ready."
      />
      <AppInput
        label="Text or URL"
        placeholder="https://example.com"
        value={value}
        onChangeText={setValue}
        error={error}
        helperText="Works with links, plain text, and short messages."
        multiline
        autoCapitalize="none"
      />
      <AppButton title="Generate QR" onPress={handleGenerate} fullWidth iconLeft="qr-code-outline" />
      <AppButton title="Clear" onPress={handleClear} variant="secondary" fullWidth />

      {generatedValue ? (
        <AppCard style={styles.previewCard}>
          <Text style={typography.label}>Your QR code</Text>
          <View style={[styles.qrWrap, { borderColor: colors.border, backgroundColor: colors.surface }]}>
            <QRCode
              value={generatedValue}
              size={220}
              color={colors.textPrimary}
              backgroundColor={colors.surface}
              getRef={(ref: QrCodeRef) => { qrRef.current = ref; }}
            />
          </View>
          <Text style={[typography.bodySmall, styles.previewValue]} numberOfLines={3}>
            {generatedValue}
          </Text>
          <ToolActionRow onShare={handleShareText} onCopy={handleCopy} shareLabel="Share text" copyLabel="Copy" />
          <AppButton
            title="Share QR image"
            onPress={handleShareQrImage}
            loading={sharingQr}
            variant="secondary"
            iconLeft="share-outline"
            fullWidth
          />
        </AppCard>
      ) : null}
    </ToolScreenLayout>
  );
}

const styles = StyleSheet.create({
  previewCard: { alignItems: 'center', gap: 12 },
  qrWrap: { padding: 20, borderRadius: 20, borderWidth: 1 },
  previewValue: { textAlign: 'center' },
});
