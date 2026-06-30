import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '@/components/ui/AppButton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ImagePreviewCard } from '@/components/tools/ImagePreviewCard';
import { ToolScreenLayout } from '@/components/tools/ToolScreenLayout';
import { useToolTracking } from '@/hooks/useToolTracking';
import { useTheme, spacing, radius, createTypography } from '@/theme';
import { CompressionQuality, getCompressionValue } from '@/utils/calculations';
import {
  calculateSavingsPercent,
  formatFileSize,
  getFileSizeFromUri,
} from '@/utils/formatters';
import { saveImageToGallery, showSaveResult } from '@/utils/media';

const QUALITY_OPTIONS: { id: CompressionQuality; label: string; desc: string }[] = [
  { id: 'low', label: 'Low', desc: '~30%' },
  { id: 'medium', label: 'Medium', desc: '~70%' },
  { id: 'high', label: 'High', desc: '~95%' },
];

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

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
      allowsEditing: false,
    });
    if (result.canceled || !result.assets[0]) return;

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
      setSuccess(`Compressed — saved ${savings}%`);
      trackAction(`Saved ${savings}%`);
    } catch {
      setError('Compression failed. Try another image.');
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async () => {
    if (!compressedUri) return;
    setDownloading(true);
    setError(null);
    const result = await saveImageToGallery(compressedUri);
    showSaveResult(result);
    setDownloading(false);
  };

  const savings = compressedUri ? calculateSavingsPercent(originalSize, compressedSize) : 0;

  return (
    <ToolScreenLayout title="Image Compressor" subtitle="Reduce file size locally">
      {!originalUri ? (
        <Pressable
          onPress={pickImage}
          style={[styles.uploadArea, { backgroundColor: colors.primaryLight, borderColor: colors.primary + '40' }]}
        >
          <View style={[styles.uploadIcon, { backgroundColor: colors.surface }]}>
            <Ionicons name="cloud-upload-outline" size={32} color={colors.primary} />
          </View>
          <Text style={[typography.label, { color: colors.primary }]}>Pick Image to Compress</Text>
          <Text style={[typography.bodySmall, { color: colors.textSecondary, textAlign: 'center' }]}>
            Fast, high-quality, local processing
          </Text>
        </Pressable>
      ) : (
        <>
          {/* Before/after comparison */}
          <View style={styles.compareRow}>
            <View style={[styles.compareCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <ImagePreviewCard
                title="Original"
                uri={originalUri}
                fileSize={originalSize}
                width={imageWidth}
                height={imageHeight}
                accent={colors.warning}
              />
            </View>

            {compressedUri ? (
              <View style={[styles.compareCard, { backgroundColor: colors.surface, borderColor: colors.primary + '40' }]}>
                <View style={[styles.savingsBadge, { backgroundColor: colors.success }]}>
                  <Text style={[typography.caption, { color: '#FFFFFF', fontWeight: '700' }]}>
                    -{savings}%
                  </Text>
                </View>
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
              </View>
            ) : (
              <View style={[styles.compareCard, styles.emptyCompare, { backgroundColor: colors.surfaceContainer, borderColor: colors.border, borderStyle: 'dashed' }]}>
                <Ionicons name="image-outline" size={32} color={colors.textSecondary} />
                <Text style={[typography.bodySmall, { color: colors.textSecondary, textAlign: 'center' }]}>
                  Preview after{'\n'}compression
                </Text>
              </View>
            )}
          </View>

          {/* Size compare bar */}
          {compressedUri && originalSize > 0 && compressedSize > 0 ? (
            <View style={[styles.sizeBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.sizeBarItem}>
                <Text style={[typography.caption, { color: colors.textSecondary }]}>Before</Text>
                <Text style={[typography.label, { color: colors.textPrimary }]}>{formatFileSize(originalSize)}</Text>
              </View>
              <View style={[styles.arrowIcon, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="arrow-forward" size={16} color={colors.primary} />
              </View>
              <View style={styles.sizeBarItem}>
                <Text style={[typography.caption, { color: colors.textSecondary }]}>After</Text>
                <Text style={[typography.label, { color: colors.success }]}>{formatFileSize(compressedSize)}</Text>
              </View>
            </View>
          ) : null}

          {/* Quality selector */}
          <View style={[styles.qualityCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[typography.label, { color: colors.textPrimary, marginBottom: spacing.sm }]}>
              Compression Quality
            </Text>
            <View style={[styles.qualityRow, { backgroundColor: colors.background }]}>
              {QUALITY_OPTIONS.map((opt) => (
                <Pressable
                  key={opt.id}
                  style={[
                    styles.qualityChip,
                    quality === opt.id && { backgroundColor: colors.primary },
                  ]}
                  onPress={() => setQuality(opt.id)}
                >
                  <Text style={[
                    typography.label,
                    { fontSize: 13 },
                    quality === opt.id ? { color: '#FFFFFF' } : { color: colors.textSecondary },
                  ]}>
                    {opt.label}
                  </Text>
                  <Text style={[
                    typography.caption,
                    quality === opt.id ? { color: 'rgba(255,255,255,0.75)' } : { color: colors.textSecondary },
                  ]}>
                    {opt.desc}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {error ? (
            <Text style={[typography.bodySmall, { color: colors.error }]}>{error}</Text>
          ) : null}

          {success ? (
            <Text style={[typography.label, { color: colors.success, textAlign: 'center' }]}>{success}</Text>
          ) : null}

          <AppButton
            title="Compress Image"
            onPress={compressImage}
            loading={loading}
            iconLeft="contract-outline"
            fullWidth
          />

          {compressedUri ? (
            <AppButton
              title="Download Compressed"
              onPress={downloadImage}
              loading={downloading}
              variant="secondary"
              iconLeft="download-outline"
              fullWidth
            />
          ) : null}

          <View style={styles.secondaryActions}>
            <View style={styles.halfBtn}>
              <AppButton title="Pick Another" onPress={pickImage} variant="secondary" fullWidth />
            </View>
            <View style={styles.halfBtn}>
              <AppButton title="Reset" onPress={reset} variant="ghost" fullWidth />
            </View>
          </View>
        </>
      )}
    </ToolScreenLayout>
  );
}

const styles = StyleSheet.create({
  uploadArea: {
    borderRadius: radius.card,
    borderWidth: 2,
    borderStyle: 'dashed',
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
  uploadIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compareRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  compareCard: {
    flex: 1,
    borderRadius: radius.card,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  savingsBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  emptyCompare: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
    minHeight: 120,
  },
  sizeBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    padding: spacing.base,
  },
  sizeBarItem: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  arrowIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qualityCard: {
    borderRadius: radius.card,
    borderWidth: 1,
    padding: spacing.base,
  },
  qualityRow: {
    flexDirection: 'row',
    borderRadius: 999,
    padding: spacing.xs,
    gap: spacing.xs,
  },
  qualityChip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: 999,
    gap: 2,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  halfBtn: {
    flex: 1,
  },
});
