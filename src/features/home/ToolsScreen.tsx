import { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { AppHeader } from '@/components/ui/AppHeader';
import { BannerAdBox } from '@/components/ads/BannerAdBox';
import { EmptyState } from '@/components/ui/EmptyState';
import { SearchBar } from '@/components/ui/SearchBar';
import { CategoryChips } from '@/components/ui/CategoryChips';
import { ToolCard } from '@/components/tools/ToolCard';
import { useOpenTool } from '@/hooks/useOpenTool';
import { useTabBarInset } from '@/hooks/useTabBarInset';
import { getToolsByCategory, searchTools, TOOL_CATEGORIES } from '@/constants/tools';
import { useTheme, spacing } from '@/theme';

export function ToolsScreen() {
  const params = useLocalSearchParams<{ category?: string }>();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const openTool = useOpenTool();
  const tabBarInset = useTabBarInset();
  const { colors } = useTheme();

  useEffect(() => {
    if (params.category && typeof params.category === 'string') {
      setActiveCategory(params.category);
    }
  }, [params.category]);

  const tools = useMemo(() => {
    const categoryTools = getToolsByCategory(activeCategory);
    if (!query.trim()) {
      return categoryTools;
    }
    const searched = searchTools(query);
    return categoryTools.filter((tool) => searched.some((item) => item.id === tool.id));
  }, [activeCategory, query]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <AppHeader title="Tools" subtitle={`${tools.length} utilities available`} />
      <FlatList
        data={tools}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.content, { paddingBottom: tabBarInset + spacing.xl }]}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <SearchBar value={query} onChangeText={setQuery} placeholder="Search all tools..." />
            <CategoryChips
              categories={TOOL_CATEGORIES}
              activeId={activeCategory}
              onSelect={setActiveCategory}
              scrollable
            />
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon="search-outline"
            title="No tools found"
            description="Try a different search term or switch to another category."
          />
        }
        ListFooterComponent={<BannerAdBox />}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <ToolCard {...item} onPress={() => openTool(item.route)} />
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    paddingHorizontal: spacing.base,
  },
  headerBlock: {
    gap: spacing.base,
    marginBottom: spacing.base,
  },
  listItem: {
    marginBottom: spacing.sm,
  },
});
