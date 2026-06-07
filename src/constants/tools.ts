import { CategoryFilter, Tool } from '@/types/tool';

export const TOOL_CATEGORIES: CategoryFilter[] = [
  { id: 'all', label: 'All' },
  { id: 'qr', label: 'QR' },
  { id: 'image', label: 'Image' },
  { id: 'finance', label: 'Finance' },
  { id: 'health', label: 'Health' },
  { id: 'text', label: 'Text' },
  { id: 'utility', label: 'Utility' },
  { id: 'converter', label: 'Converter' },
];

export const TOOLS: Tool[] = [
  {
    id: 'qr-generator',
    title: 'QR Generator',
    description: 'Create QR codes from text or URLs instantly.',
    icon: 'qr-code-outline',
    category: 'qr',
    route: '/tools/qr-generator',
    popular: true,
  },
  {
    id: 'qr-scanner',
    title: 'QR Scanner',
    description: 'Scan QR codes using your device camera.',
    icon: 'scan-outline',
    category: 'qr',
    route: '/tools/qr-scanner',
    popular: true,
  },
  {
    id: 'image-compressor',
    title: 'Image Compressor',
    description: 'Reduce image file size on your device.',
    icon: 'contract-outline',
    category: 'image',
    route: '/tools/image-compressor',
    popular: true,
  },
  {
    id: 'image-resizer',
    title: 'Image Resizer',
    description: 'Resize images to custom dimensions.',
    icon: 'resize-outline',
    category: 'image',
    route: '/tools/image-resizer',
    popular: true,
    recommended: true,
  },
  {
    id: 'emi-calculator',
    title: 'EMI Calculator',
    description: 'Estimate monthly loan payments in rupees.',
    icon: 'calculator-outline',
    category: 'finance',
    route: '/tools/emi-calculator',
    popular: true,
  },
  {
    id: 'gst-calculator',
    title: 'GST Calculator',
    description: 'Calculate GST inclusive and exclusive amounts.',
    icon: 'receipt-outline',
    category: 'finance',
    route: '/tools/gst-calculator',
    popular: true,
    recommended: true,
  },
  {
    id: 'age-calculator',
    title: 'Age Calculator',
    description: 'Calculate exact age and next birthday.',
    icon: 'calendar-outline',
    category: 'health',
    route: '/tools/age-calculator',
    recommended: true,
  },
  {
    id: 'bmi-calculator',
    title: 'BMI Calculator',
    description: 'Check body mass index and category.',
    icon: 'fitness-outline',
    category: 'health',
    route: '/tools/bmi-calculator',
    popular: true,
  },
  {
    id: 'percentage-calculator',
    title: 'Percentage Calculator',
    description: 'Find percentages, increases, and decreases.',
    icon: 'analytics-outline',
    category: 'utility',
    route: '/tools/percentage-calculator',
    recommended: true,
  },
  {
    id: 'password-generator',
    title: 'Password Generator',
    description: 'Generate secure random passwords.',
    icon: 'key-outline',
    category: 'utility',
    route: '/tools/password-generator',
    popular: true,
  },
  {
    id: 'unit-converter',
    title: 'Unit Converter',
    description: 'Convert length, weight, and temperature.',
    icon: 'swap-horizontal-outline',
    category: 'converter',
    route: '/tools/unit-converter',
    popular: true,
  },
  {
    id: 'text-counter',
    title: 'Text Counter',
    description: 'Count characters, words, and lines.',
    icon: 'document-text-outline',
    category: 'text',
    route: '/tools/text-counter',
    recommended: true,
  },
];

export function getToolById(id: string): Tool | undefined {
  return TOOLS.find((tool) => tool.id === id);
}

export function getToolsByCategory(categoryId: string): Tool[] {
  if (categoryId === 'all') {
    return TOOLS;
  }
  return TOOLS.filter((tool) => tool.category === categoryId);
}

export function searchTools(query: string): Tool[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return TOOLS;
  }
  return TOOLS.filter(
    (tool) =>
      tool.title.toLowerCase().includes(normalized) ||
      tool.description.toLowerCase().includes(normalized),
  );
}

export const POPULAR_TOOLS = TOOLS.filter((tool) => tool.popular);

export const RECOMMENDED_TOOLS = TOOLS.filter((tool) => tool.recommended);

export function getCategoryLabel(categoryId: string): string {
  return TOOL_CATEGORIES.find((c) => c.id === categoryId)?.label ?? categoryId;
}
