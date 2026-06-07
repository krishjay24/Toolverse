import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '@/components/ui/AppHeader';
import { AppCard } from '@/components/ui/AppCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { getToolById } from '@/constants/tools';
import { useOpenTool } from '@/hooks/useOpenTool';
import { useTabBarInset } from '@/hooks/useTabBarInset';
import { useToolStore } from '@/store/useToolStore';
import { useTheme, spacing, createTypography } from '@/theme';
import { formatRelativeTime } from '@/utils/formatters';

export function HistoryScreen() {
  const history = useToolStore((s) => s.history);
  const openTool = useOpenTool();
  const tabBarInset = useTabBarInset();
  const { colors } = useTheme();
  const typography = createTypography(colors);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <AppHeader title="History" subtitle="Completed tool actions" />
      {history.length === 0 ? (
        <EmptyState
          icon="time-outline"
          title="No activity yet"
          description="Generate a QR, run a calculator, or compress an image — your results will show up here."
          actionTitle="Browse tools"
          onAction={() => router.push('/(tabs)/tools')}
        />
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.list, { paddingBottom: tabBarInset + spacing.xl }]}
          renderItem={({ item }) => {
            const tool = getToolById(item.toolId);
            return (
              <Pressable onPress={() => tool && openTool(tool.route)}>
                <AppCard style={styles.card}>
                  <View style={styles.row}>
                    <View style={[styles.iconWrap, { backgroundColor: colors.primaryLight }]}>
                      <Ionicons
                        name={tool?.icon ?? 'construct-outline'}
                        size={20}
                        color={colors.primary}
                      />
                    </View>
                    <View style={styles.content}>
                      <Text style={typography.label}>{item.toolTitle}</Text>
                      {item.summary ? (
                        <Text style={typography.bodySmall} numberOfLines={2}>
                          {item.summary}
                        </Text>
                      ) : null}
                      <Text style={typography.caption}>{formatRelativeTime(item.timestamp)}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
                  </View>
                </AppCard>
              </Pressable>
            );
          }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  list: {
    paddingHorizontal: spacing.base,
    gap: spacing.sm,
  },
  card: { marginBottom: spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1, gap: spacing.xs },
});
