import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { ImagePreviewCard } from '@/components/tools/ImagePreviewCard';
import { ToolInsightBanner } from '@/components/tools/ToolInsightBanner';
import { ToolScreenLayout } from '@/components/tools/ToolScreenLayout';
import { useToolTracking } from '@/hooks/useToolTracking';
import { useTheme, spacing, createTypography } from '@/theme';
import { CompressionQuality, getCompressionValue } from '@/utils/calculations';
import {
  calculateSavingsPercent,
  formatFileSize,
  getFileSizeFromUri,
} from '@/utils/formatters';
import { saveImageToGallery, showSaveResult } from '@/utils/media';

const QUALITY_OPTIONS: { id: CompressionQuality; label: string }[] = [
  { id: 'low', label: 'Low' },
  { id: 'medium', label: 'Medium' },
  { id: 'high', label: 'High' },
];

const QUALITY_LABELS: Record<CompressionQuality, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export function ImageCompressorScreen() {
  const [originalUri, setOriginalUri] = useState<string | null>(null);
  const [compressedUri, setCompressedUri] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [quality, setQuality] = useState<CompressionQuality>('medium');
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const trackAction = useToolTracking('image-compressor');
  const { colors } = useTheme();
  const typography = createTypography(colors);

  const reset = () => {
    setOriginalUri(null);
    setCompressedUri(null);
    setOriginalSize(0);
    setCompressedSize(0);
    setImageWidth(0);
    setImageHeight(0);
    setError(null);
    setSuccess(null);
  };

  const pickImage = async () => {
    setError(null);
    setSuccess(null);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError('Photo library permission is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 1 });
    if (result.canceled || !result.assets[0]) {
      return;
    }

    const asset = result.assets[0];
    const size = asset.fileSize ?? (await getFileSizeFromUri(asset.uri));
    setOriginalUri(asset.uri);
    setOriginalSize(size);
    setImageWidth(asset.width ?? 0);
    setImageHeight(asset.height ?? 0);
    setCompressedUri(null);
    setCompressedSize(0);
  };

  const compressImage = async () => {
    if (!originalUri) {
      setError('Pick an image before compressing.');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await manipulateAsync(originalUri, [], {
        compress: getCompressionValue(quality),
        format: SaveFormat.JPEG,
      });
      const size = await getFileSizeFromUri(result.uri);
      setCompressedUri(result.uri);
      setCompressedSize(size);
      const savings = calculateSavingsPercent(originalSize, size);
      setSuccess(`Compressed with ${QUALITY_LABELS[quality]} quality — saved ${savings}%`);
      trackAction(`Saved ${savings}%`);
    } catch {
      setError('Compression failed. Try another image.');
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async () => {
    if (!compressedUri) {
      return;
    }
    setDownloading(true);
    setError(null);
    const result = await saveImageToGallery(compressedUri);
    showSaveResult(result);
    setDownloading(false);
  };

  const savings = compressedUri ? calculateSavingsPercent(originalSize, compressedSize) : 0;

  return (
    <ToolScreenLayout title="Image Compressor" subtitle="Reduce file size locally">
      <ToolInsightBanner
        icon="images-outline"
        title="Compress on your device"
        description="Pick an image, choose quality, then download the compressed file."
      />

      {!originalUri ? (
        <>
          <EmptyState
            icon="image-outline"
            title="No image selected"
            description="Choose a photo from your gallery to start compressing."
            actionTitle="Pick image"
            onAction={pickImage}
          />
        </>
      ) : (
        <>
          <ImagePreviewCard
            title="Original"
            uri={originalUri}
            fileSize={originalSize}
            width={imageWidth}
            height={imageHeight}
            accent={colors.warning}
          />

          <Text style={typography.label}>Compression quality</Text>
          <View style={styles.qualityRow}>
            {QUALITY_OPTIONS.map((option) => (
              <View key={option.id} style={styles.qualityItem}>
                <AppButton
                  title={option.label}
                  onPress={() => setQuality(option.id)}
                  variant={quality === option.id ? 'primary' : 'secondary'}
                  size="sm"
                  fullWidth
                />
              </View>
            ))}
          </View>

          <AppButton
            title="Compress image"
            onPress={compressImage}
            loading={loading}
            iconLeft="contract-outline"
            fullWidth
          />
          <AppButton title="Pick another image" onPress={pickImage} variant="secondary" fullWidth />
          <AppButton title="Reset" onPress={reset} variant="ghost" fullWidth />
        </>
      )}

      {error ? <Text style={[typography.bodySmall, { color: colors.error }]}>{error}</Text> : null}

      {compressedUri ? (
        <AppCard style={styles.resultCard}>
          {success ? (
            <Text style={[typography.label, { color: colors.success }]}>{success}</Text>
          ) : null}
          <ImagePreviewCard
            title="Compressed"
            uri={compressedUri}
            fileSize={compressedSize}
            width={imageWidth}
            height={imageHeight}
            badge={`${savings}% smaller`}
            badgeColor={colors.success}
            accent={colors.success}
          />

          {originalSize > 0 && compressedSize > 0 ? (
            <View style={[styles.compareBar, { backgroundColor: colors.background }]}>
              <View style={styles.compareItem}>
                <Text style={typography.caption}>Before</Text>
                <Text style={typography.label}>{formatFileSize(originalSize)}</Text>
              </View>
              <Text style={[typography.h3, { color: colors.primary }]}>→</Text>
              <View style={styles.compareItem}>
                <Text style={typography.caption}>After</Text>
                <Text style={[typography.label, { color: colors.success }]}>
                  {formatFileSize(compressedSize)}
                </Text>
              </View>
            </View>
          ) : null}

          <AppButton
            title="Download"
            onPress={downloadImage}
            loading={downloading}
            iconLeft="download-outline"
            fullWidth
          />
        </AppCard>
      ) : null}
    </ToolScreenLayout>
  );
}

const styles = StyleSheet.create({
  qualityRow: { flexDirection: 'row', gap: spacing.sm },
  qualityItem: { flex: 1 },
  resultCard: { gap: spacing.sm },
  compareBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 16,
    padding: spacing.base,
  },
  compareItem: { alignItems: 'center', gap: 2 },
});
