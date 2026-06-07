import { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppInput } from '@/components/ui/AppInput';
import { EmptyState } from '@/components/ui/EmptyState';
import { ImagePreviewCard } from '@/components/tools/ImagePreviewCard';
import { ToolInsightBanner } from '@/components/tools/ToolInsightBanner';
import { ToolScreenLayout } from '@/components/tools/ToolScreenLayout';
import { useToolTracking } from '@/hooks/useToolTracking';
import { useTheme, spacing, createTypography } from '@/theme';
import { formatFileSize, getFileSizeFromUri } from '@/utils/formatters';
import { saveImageToGallery, showSaveResult } from '@/utils/media';

const PRESETS = [
  { label: 'HD', width: 1280, height: 720 },
  { label: 'Square', width: 1080, height: 1080 },
  { label: 'Story', width: 1080, height: 1920 },
  { label: 'Thumb', width: 400, height: 400 },
];

export function ImageResizerScreen() {
  const [uri, setUri] = useState<string | null>(null);
  const [width, setWidth] = useState('800');
  const [height, setHeight] = useState('800');
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const [resizedUri, setResizedUri] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [newSize, setNewSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const trackAction = useToolTracking('image-resizer');
  const { colors } = useTheme();
  const typography = createTypography(colors);

  const reset = () => {
    setUri(null);
    setResizedUri(null);
    setOriginalSize(0);
    setNewSize(0);
    setError(null);
  };

  const pickImage = async () => {
    setError(null);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError('Photo library permission is required.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'] });
    if (result.canceled || !result.assets[0]) {
      return;
    }
    const asset = result.assets[0];
    const w = asset.width || 800;
    const h = asset.height || 800;
    setUri(asset.uri);
    setOriginalWidth(w);
    setOriginalHeight(h);
    setAspectRatio(w / h);
    setWidth(String(w));
    setHeight(String(h));
    setOriginalSize(asset.fileSize ?? (await getFileSizeFromUri(asset.uri)));
    setResizedUri(null);
  };

  const handleWidthChange = (value: string) => {
    setWidth(value);
    if (keepAspectRatio && aspectRatio > 0) {
      const w = Number(value);
      if (!Number.isNaN(w) && w > 0) {
        setHeight(String(Math.round(w / aspectRatio)));
      }
    }
    setResizedUri(null);
  };

  const handleHeightChange = (value: string) => {
    setHeight(value);
    if (keepAspectRatio && aspectRatio > 0) {
      const h = Number(value);
      if (!Number.isNaN(h) && h > 0) {
        setWidth(String(Math.round(h * aspectRatio)));
      }
    }
    setResizedUri(null);
  };

  const applyPreset = (w: number, h: number) => {
    setWidth(String(w));
    setHeight(String(h));
    setResizedUri(null);
  };

  const resize = async () => {
    if (!uri) {
      setError('Pick an image before resizing.');
      return;
    }
    const w = Number(width);
    const h = Number(height);
    if (!w || !h || w < 1 || h < 1) {
      setError('Enter valid width and height.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await manipulateAsync(
        uri,
        [{ resize: { width: w, height: h } }],
        { compress: 0.9, format: SaveFormat.JPEG },
      );
      const size = await getFileSizeFromUri(result.uri);
      setResizedUri(result.uri);
      setNewSize(size);
      trackAction(`${w}×${h}px`);
    } catch {
      setError('Resize failed. Try different dimensions.');
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async () => {
    if (!resizedUri) {
      return;
    }
    setDownloading(true);
    setError(null);
    const result = await saveImageToGallery(resizedUri);
    showSaveResult(result);
    setDownloading(false);
  };

  return (
    <ToolScreenLayout title="Image Resizer" subtitle="Resize to custom dimensions">
      <ToolInsightBanner
        icon="crop-outline"
        title="Resize for any screen"
        description="Use presets or custom pixels. Toggle aspect ratio to keep proportions."
      />

      {!uri ? (
        <EmptyState
          icon="image-outline"
          title="No image selected"
          description="Choose a photo from your gallery to resize."
          actionTitle="Pick image"
          onAction={pickImage}
        />
      ) : (
        <>
          <ImagePreviewCard
            title="Original"
            uri={uri}
            fileSize={originalSize}
            width={originalWidth}
            height={originalHeight}
            accent={colors.warning}
          />

          <Text style={typography.label}>Quick presets</Text>
          <View style={styles.presetRow}>
            {PRESETS.map((preset) => (
              <Pressable
                key={preset.label}
                onPress={() => applyPreset(preset.width, preset.height)}
                style={[styles.preset, { borderColor: colors.border, backgroundColor: colors.surface }]}
              >
                <Text style={typography.label}>{preset.label}</Text>
                <Text style={typography.caption}>
                  {preset.width}×{preset.height}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={[styles.aspectRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={typography.label}>Keep aspect ratio</Text>
            <Switch
              value={keepAspectRatio}
              onValueChange={setKeepAspectRatio}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={keepAspectRatio ? colors.primary : colors.textSecondary}
            />
          </View>

          <View style={styles.dimRow}>
            <View style={styles.dimInput}>
              <AppInput label="Width (px)" value={width} onChangeText={handleWidthChange} keyboardType="numeric" />
            </View>
            <View style={styles.dimInput}>
              <AppInput label="Height (px)" value={height} onChangeText={handleHeightChange} keyboardType="numeric" />
            </View>
          </View>

          <AppButton title="Resize image" onPress={resize} loading={loading} fullWidth iconLeft="resize-outline" />
          <AppButton title="Pick another image" onPress={pickImage} variant="secondary" fullWidth />
          <AppButton title="Reset" onPress={reset} variant="ghost" fullWidth />
        </>
      )}

      {error ? <Text style={[typography.bodySmall, { color: colors.error }]}>{error}</Text> : null}

      {resizedUri ? (
        <AppCard style={styles.resultCard}>
          <ImagePreviewCard
            title="Resized output"
            uri={resizedUri}
            fileSize={newSize}
            width={Number(width)}
            height={Number(height)}
            badge="Ready"
            badgeColor={colors.success}
            accent={colors.success}
          />
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
  presetRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  preset: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
    minWidth: '22%',
    gap: 2,
  },
  aspectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  dimRow: { flexDirection: 'row', gap: spacing.sm },
  dimInput: { flex: 1 },
  resultCard: { gap: spacing.sm },
});
