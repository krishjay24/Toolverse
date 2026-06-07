import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '@/components/ui/AppHeader';
import { AppCard } from '@/components/ui/AppCard';
import { BannerAdBox } from '@/components/ads/BannerAdBox';
import { SearchBar } from '@/components/ui/SearchBar';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CategoryChips } from '@/components/ui/CategoryChips';
import { ToolCard } from '@/components/tools/ToolCard';
import { useOpenTool } from '@/hooks/useOpenTool';
import { useTabBarInset } from '@/hooks/useTabBarInset';
import { getToolById, RECOMMENDED_TOOLS, TOOL_CATEGORIES, searchTools } from '@/constants/tools';
import { useTheme, spacing, radius, createTypography } from '@/theme';

const QUICK_ACTION_IDS = ['qr-scanner', 'image-compressor', 'emi-calculator'] as const;

export function HomeScreen() {
  const [query, setQuery] = useState('');
  const openTool = useOpenTool();
  const tabBarInset = useTabBarInset();
  const { colors } = useTheme();
  const typography = createTypography(colors);

  const filteredTools = useMemo(() => searchTools(query), [query]);
  const browseCategories = TOOL_CATEGORIES.filter((c) => c.id !== 'all');
  const quickActions = QUICK_ACTION_IDS.map((id) => getToolById(id)).filter(Boolean);

  const navigateToCategory = (categoryId: string) => {
    router.push({ pathname: '/(tabs)/tools', params: { category: categoryId } });
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <AppHeader
        showLogo
        subtitle="One app. Endless utilities."
        onRightPress={() => router.push('/(tabs)/settings')}
      />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: tabBarInset + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <SearchBar value={query} onChangeText={setQuery} placeholder="Find a tool..." />

        {query ? (
          <View style={styles.section}>
            <SectionHeader title={`${filteredTools.length} results`} />
            <View style={styles.list}>
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} {...tool} onPress={() => openTool(tool.route)} />
              ))}
            </View>
          </View>
        ) : (
          <>
            <AppCard style={styles.hero}>
              <Text style={typography.h3}>Your everyday tools, ready in one tap</Text>
              <Text style={typography.bodySmall}>
                Scan, calculate, compress, convert and create without leaving your phone.
              </Text>
            </AppCard>

            <View style={styles.section}>
              <SectionHeader title="Quick actions" />
              <View style={styles.quickRow}>
                {quickActions.map((tool) => (
                  <Pressable
                    key={tool!.id}
                    onPress={() => openTool(tool!.route)}
                    style={({ pressed }) => [
                      styles.quickAction,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                      },
                      pressed && styles.pressed,
                    ]}
                  >
                    <View style={[styles.quickIcon, { backgroundColor: colors.primaryLight }]}>
                      <Ionicons name={tool!.icon} size={22} color={colors.primary} />
                    </View>
                    <Text style={[typography.caption, styles.quickLabel]} numberOfLines={2}>
                      {tool!.title}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <SectionHeader
                title="Categories"
                actionLabel="All tools"
                onActionPress={() => router.push('/(tabs)/tools')}
              />
              <CategoryChips
                categories={browseCategories}
                activeId=""
                onSelect={navigateToCategory}
                scrollable
              />
            </View>

            <View style={styles.section}>
              <SectionHeader title="Recommended tools" />
              <View style={styles.list}>
                {RECOMMENDED_TOOLS.map((tool) => (
                  <ToolCard key={tool.id} {...tool} onPress={() => openTool(tool.route)} />
                ))}
              </View>
            </View>
          </>
        )}

        <BannerAdBox />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    paddingHorizontal: spacing.base,
    gap: spacing.xl,
  },
  section: { gap: spacing.sm },
  hero: { gap: spacing.sm },
  quickRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.card,
    padding: spacing.md,
    gap: spacing.sm,
    minHeight: 100,
  },
  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    textAlign: 'center',
    fontWeight: '600',
  },
  list: { gap: spacing.sm },
  pressed: { opacity: 0.9 },
});
