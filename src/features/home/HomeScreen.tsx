import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardAdSlot } from '@/components/dashboard/DashboardAdSlot';
import { EmptyToolsState } from '@/components/dashboard/EmptyToolsState';
import { ToolFilterChips } from '@/components/dashboard/ToolFilterChips';
import { ToolSearchBar } from '@/components/dashboard/ToolSearchBar';
import { ToolSection } from '@/components/dashboard/ToolSection';
import {
  DASHBOARD_SECTIONS,
  FilterChipId,
  POPULAR_SECTION,
  getVisibleSections,
  showBannerAd,
  showPopularSection,
} from '@/constants/dashboard';
import { POPULAR_TOOLS, TOOLS, getToolsByCategory, searchTools } from '@/constants/tools';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ToolDashboardCard } from '@/components/tools/ToolDashboardCard';
import { useOpenTool } from '@/hooks/useOpenTool';
import { useTabBarInset } from '@/hooks/useTabBarInset';
import { useAppStore } from '@/store/useAppStore';
import { Tool, ToolCategory } from '@/types/tool';
import { spacing, useTheme } from '@/theme';

const CHIP_CATEGORY_MAP: Record<Exclude<FilterChipId, 'all' | 'popular'>, ToolCategory> = {
  finance: 'finance',
  text: 'text',
  qr: 'qr',
  image: 'image',
  health: 'health',
  fun: 'random',
  converters: 'converters',
  security: 'security',
};

function filterToolsForChip(tools: Tool[], activeChip: FilterChipId): Tool[] {
  if (activeChip === 'all') {
    return tools;
  }

  if (activeChip === 'popular') {
    return tools.filter((tool) => tool.popular);
  }

  return tools.filter((tool) => tool.category === CHIP_CATEGORY_MAP[activeChip]);
}

export function HomeScreen() {
  const [query, setQuery] = useState('');
  const [activeChip, setActiveChip] = useState<FilterChipId>('all');
  const openTool = useOpenTool();
  const tabBarInset = useTabBarInset();
  const setThemePreference = useAppStore((state) => state.setThemePreference);
  const { colors, isDark } = useTheme();
  const dashboardBackground = isDark ? '#020617' : '#F8FAFC';

  const toolsByCategory = useMemo(
    () =>
      Object.fromEntries(
        DASHBOARD_SECTIONS.map((section) => [section.id, getToolsByCategory(section.id)]),
      ) as Record<ToolCategory, Tool[]>,
    [],
  );

  const visibleSections = useMemo(() => getVisibleSections(activeChip), [activeChip]);
  const filteredPopularTools = useMemo(
    () => filterToolsForChip(POPULAR_TOOLS, activeChip),
    [activeChip],
  );
  const nonEmptyVisibleSections = useMemo(
    () => visibleSections.filter((section) => toolsByCategory[section.id].length > 0),
    [toolsByCategory, visibleSections],
  );
  const searchedTools = useMemo(() => {
    const baseTools = filterToolsForChip(TOOLS, activeChip);

    if (!query.trim()) {
      return baseTools;
    }

    const matchingIds = new Set(searchTools(query).map((tool) => tool.id));
    return baseTools.filter((tool) => matchingIds.has(tool.id));
  }, [activeChip, query]);

  const handleThemeToggle = () => {
    setThemePreference(isDark ? 'light' : 'dark');
  };

  const sectionAdIndices = useMemo(() => {
    if (query.trim()) {
      return [] as number[];
    }

    if (activeChip === 'popular') {
      return filteredPopularTools.length > 0 ? [0] : [];
    }

    const totalSections = nonEmptyVisibleSections.length;

    if (totalSections === 0) {
      return [] as number[];
    }

    if (activeChip !== 'all') {
      return [0];
    }

    return Array.from(new Set([0, Math.floor((totalSections - 1) / 2), totalSections - 1]));
  }, [activeChip, filteredPopularTools.length, nonEmptyVisibleSections, query]);

  return (
    <View style={[styles.screen, { backgroundColor: dashboardBackground }]}> 
      <DashboardHeader
        onSettingsPress={() => router.push('/(tabs)/settings')}
        onThemeToggle={handleThemeToggle}
      />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: tabBarInset + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topControls}>
          <ToolSearchBar value={query} onChangeText={setQuery} />
          <ToolFilterChips activeId={activeChip} onSelect={setActiveChip} />
        </View>

        {query.trim() ? (
          <View style={styles.section}>
            <SectionHeader title={`${searchedTools.length} result${searchedTools.length === 1 ? '' : 's'}`} />
            {searchedTools.length === 0 ? (
              <EmptyToolsState query={query} />
            ) : (
              <View style={styles.grid}>
                {searchedTools.map((tool, index) => (
                  <ToolDashboardCard
                    key={tool.id}
                    title={tool.title}
                    icon={tool.icon}
                    category={tool.category}
                    onPress={() => openTool(tool.route)}
                    colorIndex={index}
                  />
                ))}
              </View>
            )}
          </View>
        ) : (
          <>
            {showPopularSection(activeChip) ? (
              <>
                <ToolSection
                  section={POPULAR_SECTION}
                  tools={filteredPopularTools}
                  onToolPress={openTool}
                />
                <DashboardAdSlot visible={sectionAdIndices.includes(0)} />
              </>
            ) : null}

            {nonEmptyVisibleSections.map((section, index) => (
              <View key={section.id}>
                <ToolSection
                  section={section}
                  tools={toolsByCategory[section.id]}
                  onToolPress={openTool}
                />
                <DashboardAdSlot visible={showBannerAd(activeChip) && sectionAdIndices.includes(index)} />
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.base,
    gap: 0,
  },
  topControls: {
    gap: 14,
  },
  section: {
    gap: spacing.base,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
});
