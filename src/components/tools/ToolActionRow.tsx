import { StyleSheet, View } from 'react-native';
import { AppButton } from '@/components/ui/AppButton';
import { spacing } from '@/theme';

interface ToolActionRowProps {
  onDownload?: () => void;
  onShare?: () => void;
  onCopy?: () => void;
  downloadLoading?: boolean;
  downloadLabel?: string;
  shareLabel?: string;
  copyLabel?: string;
}

export function ToolActionRow({
  onDownload,
  onShare,
  onCopy,
  downloadLoading,
  downloadLabel = 'Download',
  shareLabel = 'Share',
  copyLabel = 'Copy',
}: ToolActionRowProps) {
  const actions = [
    onDownload ? { key: 'download', title: downloadLabel, icon: 'download-outline' as const, onPress: onDownload, loading: downloadLoading, variant: 'primary' as const } : null,
    onShare ? { key: 'share', title: shareLabel, icon: 'share-outline' as const, onPress: onShare, variant: 'secondary' as const } : null,
    onCopy ? { key: 'copy', title: copyLabel, icon: 'copy-outline' as const, onPress: onCopy, variant: 'secondary' as const } : null,
  ].filter(Boolean);

  if (actions.length === 0) {
    return null;
  }

  if (actions.length === 1) {
    const action = actions[0]!;
    return (
      <AppButton
        title={action.title}
        onPress={action.onPress}
        iconLeft={action.icon}
        variant={action.variant}
        loading={'loading' in action ? action.loading : false}
        fullWidth
      />
    );
  }

  return (
    <View style={styles.row}>
      {actions.map((action) => (
        <View key={action!.key} style={styles.btn}>
          <AppButton
            title={action!.title}
            onPress={action!.onPress}
            iconLeft={action!.icon}
            variant={action!.variant}
            loading={'loading' in action! ? action!.loading : false}
            fullWidth
            size="sm"
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm },
  btn: { flex: 1 },
});
