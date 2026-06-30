import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '@/components/ui/AppHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { getToolById } from '@/constants/tools';
import { useOpenTool } from '@/hooks/useOpenTool';
import { useTabBarInset } from '@/hooks/useTabBarInset';
import { useToolStore } from '@/store/useToolStore';
import { useTheme, spacing, radius, createTypography } from '@/theme';
import { formatRelativeTime } from '@/utils/formatters';

export function HistoryScreen() {
  const history = useToolStore((s) => s.history);
  const openTool = useOpenTool();
  const tabBarInset = useTabBarInset();
  const { colors } = useTheme();
  const typography = createTypography(colors);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <AppHeader showLogo onRightPress={() => {}} />
      {history.length === 0 ? (
        <View style={styles.emptyWrapper}>
          <Text style={[typography.h2, { color: colors.textPrimary, marginBottom: spacing.xl, marginLeft: spacing.screen }]}>
            History
          </Text>
          <EmptyState
            icon="time-outline"
            title="No activity yet"
            description="Generate a QR, run a calculator, or compress an image — your results will show up here."
            actionTitle="Browse tools"
            onAction={() => router.push('/(tabs)/tools')}
          />
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.list, { paddingBottom: tabBarInset + spacing.xl }]}
          ListHeaderComponent={
            <Text style={[typography.h2, { color: colors.textPrimary, marginBottom: spacing.base }]}>
              History
            </Text>
          }
          renderItem={({ item }) => {
            const tool = getToolById(item.toolId);
            return (
              <Pressable
                onPress={() => tool && openTool(tool.route)}
                style={({ pressed }) => [
                  styles.card,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                  pressed && styles.pressed,
                ]}
              >
                <View style={[styles.iconWrap, { backgroundColor: colors.primaryLight }]}>
                  <Ionicons
                    name={tool?.icon ?? 'construct-outline'}
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.content}>
                  <Text style={[typography.label, { color: colors.textPrimary }]}>{item.toolTitle}</Text>
                  {item.summary ? (
                    <Text style={[typography.bodySmall, { color: colors.textSecondary }]} numberOfLines={2}>
                      {item.summary}
                    </Text>
                  ) : null}
                  <Text style={[typography.caption, { color: colors.textSecondary }]}>
                    {formatRelativeTime(item.timestamp)}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
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
  emptyWrapper: { flex: 1 },
  list: {
    paddingHorizontal: spacing.screen,
    gap: spacing.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    padding: spacing.base,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1, gap: spacing.xs },
});
