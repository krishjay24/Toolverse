import { CategoryFilter, Tool } from '@/types/tool';

export const TOOL_CATEGORIES: CategoryFilter[] = [
  { id: 'all', label: 'All' },
  { id: 'daily', label: 'Daily Tools' },
  { id: 'finance', label: 'Finance' },
  { id: 'text', label: 'Text Tools' },
  { id: 'qr', label: 'QR & Barcode' },
  { id: 'image', label: 'Image Tools' },
  { id: 'health', label: 'Health' },
  { id: 'random', label: 'Random & Fun' },
  { id: 'converters', label: 'Converters' },
  { id: 'security', label: 'Security' },
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
    keywords: ['barcode', 'scan code', 'create qr', 'url', 'text'],
  },
  {
    id: 'qr-scanner',
    title: 'QR Scanner',
    description: 'Scan QR codes using your device camera.',
    icon: 'scan-outline',
    category: 'qr',
    route: '/tools/qr-scanner',
    popular: true,
    keywords: ['barcode', 'camera', 'scan code', 'reader'],
  },
  {
    id: 'image-compressor',
    title: 'Image Compressor',
    description: 'Reduce image file size on your device.',
    icon: 'contract-outline',
    category: 'image',
    route: '/tools/image-compressor',
    popular: true,
    keywords: ['photo', 'compress', 'reduce size', 'image'],
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
    keywords: ['photo', 'resize', 'dimensions', 'image'],
  },
  {
    id: 'color-picker',
    title: 'Color Picker',
    description: 'Pick colors from real-world objects using camera.',
    icon: 'eyedrop-outline',
    category: 'image',
    route: '/tools/color-picker',
    keywords: ['color', 'picker', 'hex', 'rgb', 'camera', 'palette'],
  },
  {
    id: 'discount-calculator',
    title: 'Discount Calculator',
    description: 'Calculate final price after discount.',
    icon: 'calculator-outline',
    category: 'finance',
    route: '/tools/discount-calculator',
    popular: true,
    keywords: ['sale', 'price', 'offer', 'discount'],
  },
  {
    id: 'emi-calculator',
    title: 'EMI Calculator',
    description: 'Estimate monthly loan payments in rupees.',
    icon: 'calculator-outline',
    category: 'finance',
    route: '/tools/emi-calculator',
    popular: true,
    keywords: ['loan', 'monthly payment', 'interest', 'emi'],
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
    keywords: ['tax', 'invoice', 'gst', 'price'],
  },
  {
    id: 'sip-calculator',
    title: 'SIP Calculator',
    description: 'Estimate SIP maturity value and returns.',
    icon: 'trending-up-outline',
    category: 'finance',
    route: '/tools/sip-calculator',
    popular: true,
    keywords: ['investment', 'mutual fund', 'returns', 'sip'],
  },
  {
    id: 'age-calculator',
    title: 'Age Calculator',
    description: 'Calculate exact age and next birthday.',
    icon: 'calendar-outline',
    category: 'health',
    route: '/tools/age-calculator',
    recommended: true,
    keywords: ['birthday', 'age', 'date', 'years'],
  },
  {
    id: 'bmi-calculator',
    title: 'BMI Calculator',
    description: 'Check body mass index and category.',
    icon: 'fitness-outline',
    category: 'health',
    route: '/tools/bmi-calculator',
    popular: true,
    keywords: ['body mass index', 'weight', 'health', 'fitness'],
  },
  {
    id: 'percentage-calculator',
    title: 'Percentage Calculator',
    description: 'Find percentages, increases, and decreases.',
    icon: 'analytics-outline',
    category: 'finance',
    route: '/tools/percentage-calculator',
    recommended: true,
    keywords: ['percent', 'percentage', 'increase', 'decrease'],
  },
  {
    id: 'password-generator',
    title: 'Password Generator',
    description: 'Generate secure random passwords.',
    icon: 'key-outline',
    category: 'security',
    route: '/tools/password-generator',
    popular: true,
    keywords: ['security', 'password', 'random', 'secure'],
  },
  {
    id: 'unit-converter',
    title: 'Unit Converter',
    description: 'Convert length, weight, and temperature.',
    icon: 'swap-horizontal-outline',
    category: 'converters',
    route: '/tools/unit-converter',
    popular: true,
    keywords: ['length', 'weight', 'temperature', 'convert'],
  },
  {
    id: 'text-counter',
    title: 'Text Counter',
    description: 'Count characters, words, and lines.',
    icon: 'document-text-outline',
    category: 'text',
    route: '/tools/text-counter',
    recommended: true,
    keywords: ['word counter', 'characters', 'lines', 'text'],
  },
  {
    id: 'case-converter',
    title: 'Case Converter',
    description: 'Convert text into different cases.',
    icon: 'text-outline',
    category: 'text',
    route: '/tools/case-converter',
    keywords: ['uppercase', 'lowercase', 'title case', 'text'],
  },
  {
    id: 'remove-extra-spaces',
    title: 'Remove Extra Spaces',
    description: 'Clean extra spaces and empty lines from text.',
    icon: 'document-text-outline',
    category: 'text',
    route: '/tools/remove-extra-spaces',
    keywords: ['trim spaces', 'clean text', 'format text'],
  },
  {
    id: 'password-strength-checker',
    title: 'Password Strength Checker',
    description: 'Check password strength and security suggestions.',
    icon: 'shield-checkmark-outline',
    category: 'security',
    route: '/tools/password-strength-checker',
    keywords: ['password', 'security', 'strength', 'checker'],
  },
  {
    id: 'date-difference-calculator',
    title: 'Date Difference',
    description: 'Calculate days between two dates.',
    icon: 'calendar-outline',
    category: 'daily',
    route: '/tools/date-difference-calculator',
    popular: true,
    recommended: true,
    keywords: ['date', 'days', 'calendar', 'difference'],
  },
  {
  id: 'fd-rd-calculator',
  title: 'FD & RD Calculator',
  description: 'Estimate deposit maturity and interest.',
  icon: 'trending-up-outline',
  category: 'finance',
  route: '/tools/fd-rd-calculator',
  popular: true,
  recommended: true,
  keywords: ['fd', 'rd', 'deposit', 'interest', 'maturity'],
},
  {
    id: 'coin-flip',
    title: 'Coin Flip',
    description: 'Flip a coin for quick decisions.',
    icon: 'sync-outline',
    category: 'random',
    route: '/tools/coin-flip',
    popular: true,
    keywords: ['flip coin', 'heads', 'tails', 'fun'],
  },
  {
    id: 'dice-roll',
    title: 'Dice Roll',
    description: 'Roll one or two dice instantly.',
    icon: 'cube-outline',
    category: 'random',
    route: '/tools/dice-roll',
    popular: true,
    keywords: ['dice', 'roll', 'random', 'fun'],
  },
  {
    id: 'random-number-generator',
    title: 'Random Number',
    description: 'Generate random numbers in a range.',
    icon: 'keypad-outline',
    category: 'random',
    route: '/tools/random-number-generator',
    popular: true,
    keywords: ['random', 'number', 'range', 'generator'],
  },
  {
    id: 'yes-or-no-generator',
    title: 'Yes or No',
    description: 'Get a quick random answer.',
    icon: 'help-circle-outline',
    category: 'random',
    route: '/tools/yes-or-no-generator',
    keywords: ['yes', 'no', 'decision', 'answer'],
  },
  {
    id: 'random-picker',
    title: 'Random Picker',
    description: 'Pick one item from your list.',
    icon: 'shuffle-outline',
    category: 'random',
    route: '/tools/random-picker',
    popular: true,
    keywords: ['pick', 'shuffle', 'choose', 'random'],
  },
  {
    id: 'spin-wheel',
    title: 'Spin Wheel',
    description: 'Spin a wheel to choose an option.',
    icon: 'aperture-outline',
    category: 'random',
    route: '/tools/spin-wheel',
    keywords: ['wheel', 'spin', 'picker', 'random'],
  },
  {
    id: 'team-splitter',
    title: 'Team Splitter',
    description: 'Split names into random teams.',
    icon: 'people-outline',
    category: 'random',
    route: '/tools/team-splitter',
    keywords: ['teams', 'split', 'group', 'random'],
  },
  {
    id: 'decision-maker',
    title: 'Decision Maker',
    description: 'Make quick random decisions.',
    icon: 'flash-outline',
    category: 'random',
    route: '/tools/decision-maker',
    keywords: ['decision', 'choose', 'picker', 'random'],
  },
  {
    id: 'rock-paper-scissors',
    title: 'Rock Paper Scissors',
    description: 'Play a quick classic mini game.',
    icon: 'hand-left-outline',
    category: 'random',
    route: '/tools/rock-paper-scissors',
    keywords: ['game', 'fun', 'rock paper scissors'],
  },
  {
    id: 'guess-the-number',
    title: 'Guess the Number',
    description: 'Guess the hidden number with hints.',
    icon: 'game-controller-outline',
    category: 'random',
    route: '/tools/guess-the-number',
    keywords: ['game', 'guess', 'number', 'fun'],
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
      tool.description.toLowerCase().includes(normalized) ||
      tool.category.toLowerCase().includes(normalized) ||
      getCategoryLabel(tool.category).toLowerCase().includes(normalized) ||
      (tool.keywords?.some((keyword) => keyword.toLowerCase().includes(normalized)) ?? false),
  );
}

export const POPULAR_TOOLS = TOOLS.filter((tool) => tool.popular);

export const RECOMMENDED_TOOLS = TOOLS.filter((tool) => tool.recommended);

export function getCategoryLabel(categoryId: string): string {
  return TOOL_CATEGORIES.find((c) => c.id === categoryId)?.label ?? categoryId;
}
