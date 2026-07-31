import { Ionicons } from '@expo/vector-icons';

export type ToolCategory =
  | 'daily'
  | 'finance'
  | 'text'
  | 'qr'
  | 'image'
  | 'health'
  | 'random'
  | 'converters'
  | 'security';

export type ToolIconName = keyof typeof Ionicons.glyphMap;

export interface Tool {
  id: string;
  title: string;
  description: string;
  icon: ToolIconName;
  category: ToolCategory;
  route: string;
  popular?: boolean;
  recommended?: boolean;
  keywords?: string[];
}

export interface HistoryEntry {
  id: string;
  toolId: string;
  toolTitle: string;
  timestamp: number;
  summary?: string;
}

export interface CategoryFilter {
  id: string;
  label: string;
}

export const CATEGORY_LABELS: Record<ToolCategory, string> = {
  daily: 'Daily Tools',
  finance: 'Finance',
  text: 'Text Tools',
  qr: 'QR & Barcode',
  image: 'Image Tools',
  health: 'Health',
  random: 'Random & Fun',
  converters: 'Converters',
  security: 'Security',
};
