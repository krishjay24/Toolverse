import { ToolIconName, ToolCategory } from '@/types/tool';

export type FilterChipId =
  | 'all'
  | 'popular'
  | 'finance'
  | 'text'
  | 'qr'
  | 'image'
  | 'health'
  | 'fun'
  | 'converters'
  | 'security';

export interface FilterChip {
  id: FilterChipId;
  label: string;
}

export interface DashboardSectionDef {
  id: ToolCategory;
  label: string;
  icon: ToolIconName;
  chipId: FilterChipId | null;
}

export const FILTER_CHIPS: FilterChip[] = [
  { id: 'all', label: 'All' },
  { id: 'popular', label: 'Popular' },
  { id: 'finance', label: 'Finance' },
  { id: 'text', label: 'Text' },
  { id: 'qr', label: 'QR' },
  { id: 'image', label: 'Image' },
  { id: 'health', label: 'Health' },
  { id: 'fun', label: 'Fun' },
  { id: 'converters', label: 'Converters' },
  { id: 'security', label: 'Security' },
];

export const POPULAR_SECTION = {
  id: 'daily',
  label: 'Popular Tools',
  icon: 'star-outline',
  chipId: 'popular',
} satisfies {
  id: ToolCategory;
  label: string;
  icon: ToolIconName;
  chipId: FilterChipId;
};

export const DASHBOARD_SECTIONS: DashboardSectionDef[] = [
  { id: 'daily', label: 'Daily Tools', icon: 'apps-outline', chipId: null },
  { id: 'finance', label: 'Finance', icon: 'trending-up-outline', chipId: 'finance' },
  { id: 'text', label: 'Text Tools', icon: 'text-outline', chipId: 'text' },
  { id: 'qr', label: 'QR & Barcode', icon: 'qr-code-outline', chipId: 'qr' },
  { id: 'image', label: 'Image Tools', icon: 'image-outline', chipId: 'image' },
  { id: 'health', label: 'Health', icon: 'fitness-outline', chipId: 'health' },
  { id: 'random', label: 'Random & Fun', icon: 'game-controller-outline', chipId: 'fun' },
  { id: 'converters', label: 'Converters', icon: 'swap-horizontal-outline', chipId: 'converters' },
  { id: 'security', label: 'Security', icon: 'shield-checkmark-outline', chipId: 'security' },
];

export function getVisibleSections(chip: FilterChipId): DashboardSectionDef[] {
  if (chip === 'all') {
    return DASHBOARD_SECTIONS;
  }

  if (chip === 'popular') {
    return [];
  }

  return DASHBOARD_SECTIONS.filter((section) => section.chipId === chip);
}

export function showPopularSection(chip: FilterChipId): boolean {
  return chip === 'popular';
}

export function showBannerAd(chip: FilterChipId): boolean {
  return true;
}