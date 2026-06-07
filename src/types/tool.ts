import { Ionicons } from '@expo/vector-icons';

export type ToolCategory =
  | 'qr'
  | 'image'
  | 'finance'
  | 'health'
  | 'text'
  | 'utility'
  | 'converter';

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
  qr: 'QR',
  image: 'Image',
  finance: 'Finance',
  health: 'Health',
  text: 'Text',
  utility: 'Utility',
  converter: 'Converter',
};
