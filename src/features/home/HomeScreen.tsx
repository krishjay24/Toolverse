import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '@/components/ui/AppHeader';
import { BannerAdBox } from '@/components/ads/BannerAdBox';
import { SearchBar } from '@/components/ui/SearchBar';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CategoryChips } from '@/components/ui/CategoryChips';
import { ToolCard } from '@/components/tools/ToolCard';
import { useOpenTool } from '@/hooks/useOpenTool';
import { useTabBarInset } from '@/hooks/useTabBarInset';
import { getToolById, RECOMMENDED_TOOLS, TOOL_CATEGORIES, searchTools } from '@/constants/tools';
import { useTheme, spacing, radius, createTypography } from '@/theme';

const QUICK_ACTION_IDS = ['qr-scanner', 'image-compressor', 'emi-calculator', 'bmi-calculator'] as const;

interface QuickActionTileProps {
  title: string;
  subtitle: string;
  icon: string;
  bgColor: string;
  onPress: () => void;
}

function QuickActionTile({ title, subtitle, icon, bgColor, onPress }: QuickActionTileProps) {
  const { colors } = useTheme();
  const typography = createTypography(colors);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.quickTile,
        { backgroundColor: colors.surface, borderColor: colors.border },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.quickIcon, { backgroundColor: bgColor }]}>
        <Ionicons name={icon as any} size={22} color={colors.primary} />
      </View>
      <Text style={[typography.label, styles.quickTitle]} numberOfLines={1}>{title}</Text>
      <Text style={[typography.caption, { color: colors.textSecondary }]} numberOfLines={1}>{subtitle}</Text>
    </Pressable>
  );
}

const QUICK_SUBTITLES: Record<string, string> = {
  'qr-scanner': 'Instant scan',
  'image-compressor': 'Reduce size',
  'emi-calculator': 'Plan finance',
  'bmi-calculator': 'Check health',
};

const QUICK_COLORS = ['#EAF1FF', '#E8F5E9', '#FFF3E0', '#F3E5F5'];

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
      <AppHeader showLogo onRightPress={() => router.push('/(tabs)/settings')} />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: tabBarInset + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search utilities..." />

        {query ? (
          <View style={styles.section}>
            <SectionHeader title={`${filteredTools.length} results`} />
            <View style={styles.list}>
              {filteredTools.map((tool, i) => (
                <ToolCard key={tool.id} {...tool} colorIndex={i} onPress={() => openTool(tool.route)} />
              ))}
            </View>
          </View>
        ) : (
          <>
            {/* Hero Card */}
            <Pressable
              style={[styles.heroCard, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/(tabs)/tools')}
            >
              <View style={styles.heroContent}>
                <Text style={[styles.heroTitle, { color: '#FFFFFF' }]}>
                  Your everyday tools,{'\n'}ready in one tap
                </Text>
                <Text style={[styles.heroSub, { color: 'rgba(255,255,255,0.85)' }]}>
                  Scan, calculate, compress, convert and create.
                </Text>
              </View>
              <View style={styles.heroBadge}>
                <Ionicons name="apps-outline" size={80} color="rgba(255,255,255,0.15)" />
              </View>
            </Pressable>

            {/* Quick Actions */}
            <View style={styles.section}>
              <SectionHeader title="Quick Actions" />
              <View style={styles.quickGrid}>
                {quickActions.map((tool, i) => (
                  <QuickActionTile
                    key={tool!.id}
                    title={tool!.title}
                    subtitle={QUICK_SUBTITLES[tool!.id] ?? ''}
                    icon={tool!.icon}
                    bgColor={QUICK_COLORS[i % QUICK_COLORS.length]}
                    onPress={() => openTool(tool!.route)}
                  />
                ))}
              </View>
            </View>

            {/* Categories */}
            <View style={styles.section}>
              <SectionHeader
                title="Categories"
                actionLabel="View all"
                onActionPress={() => router.push('/(tabs)/tools')}
              />
              <CategoryChips
                categories={browseCategories}
                activeId=""
                onSelect={navigateToCategory}
                scrollable
              />
            </View>

            {/* Recommended Tools */}
            <View style={styles.section}>
              <SectionHeader title="Recommended Tools" />
              <View style={styles.list}>
                {RECOMMENDED_TOOLS.map((tool, i) => (
                  <ToolCard key={tool.id} {...tool} colorIndex={i} onPress={() => openTool(tool.route)} />
                ))}
              </View>
            </View>

            <BannerAdBox />
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
    gap: spacing.section,
  },
  section: {},
  heroCard: {
    borderRadius: radius.card,
    padding: spacing.lg,
    minHeight: 160,
    flexDirection: 'row',
    alignItems: 'flex-end',
    overflow: 'hidden',
  },
  heroContent: {
    flex: 1,
    gap: spacing.sm,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
    letterSpacing: -0.3,
  },
  heroSub: {
    fontSize: 13,
    lineHeight: 18,
  },
  heroBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    opacity: 0.6,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  quickTile: {
    width: '47.5%',
    borderRadius: radius.card,
    borderWidth: 1,
    padding: spacing.base,
    gap: spacing.sm,
  },
  quickIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickTitle: {
    fontSize: 15,
  },
  list: { gap: spacing.sm },
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
});
