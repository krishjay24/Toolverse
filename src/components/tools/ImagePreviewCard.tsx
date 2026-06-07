import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppCard } from '@/components/ui/AppCard';
import { useTheme, spacing, createTypography } from '@/theme';
import { formatFileSize } from '@/utils/formatters';

interface ImagePreviewCardProps {
  title: string;
  uri: string;
  fileSize?: number;
  width?: number;
  height?: number;
  badge?: string;
  badgeColor?: string;
  accent?: string;
}

export function ImagePreviewCard({
  title,
  uri,
  fileSize,
  width,
  height,
  badge,
  badgeColor,
  accent,
}: ImagePreviewCardProps) {
  const { colors } = useTheme();
  const typography = createTypography(colors);
  const [dims, setDims] = useState({ width: width ?? 0, height: height ?? 0 });

  useEffect(() => {
    if (width && height) {
      setDims({ width, height });
      return;
    }
    Image.getSize(
      uri,
      (w, h) => setDims({ width: w, height: h }),
      () => setDims({ width: 0, height: 0 }),
    );
  }, [uri, width, height]);

  const aspectRatio = dims.width && dims.height ? dims.width / dims.height : 4 / 3;

  return (
    <AppCard style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          {accent ? (
            <View style={[styles.dot, { backgroundColor: accent }]} />
          ) : null}
          <Text style={typography.label}>{title}</Text>
        </View>
        {badge ? (
          <View style={[styles.badge, { backgroundColor: badgeColor ?? colors.primaryLight }]}>
            <Text style={[typography.caption, { color: badgeColor ? colors.surface : colors.primary, fontWeight: '600' }]}>
              {badge}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={[styles.imageFrame, { backgroundColor: colors.background, borderColor: colors.border }]}>
        <Image
          source={{ uri }}
          style={[styles.image, { aspectRatio }]}
          resizeMode="contain"
        />
      </View>

      <View style={styles.metaRow}>
        {dims.width > 0 ? (
          <View style={styles.metaItem}>
            <Ionicons name="resize-outline" size={14} color={colors.textSecondary} />
            <Text style={typography.caption}>
              {dims.width} × {dims.height} px
            </Text>
          </View>
        ) : null}
        {fileSize !== undefined && fileSize > 0 ? (
          <View style={styles.metaItem}>
            <Ionicons name="document-outline" size={14} color={colors.textSecondary} />
            <Text style={typography.caption}>{formatFileSize(fileSize)}</Text>
          </View>
        ) : fileSize === 0 ? (
          <Text style={typography.caption}>Size unavailable</Text>
        ) : null}
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.sm },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dot: { width: 8, height: 8, borderRadius: 4 },
  badge: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  imageFrame: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
  },
  image: { width: '100%', maxHeight: 280 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
