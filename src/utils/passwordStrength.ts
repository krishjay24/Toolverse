/**
 * Password strength analysis utilities
 */

// Common weak passwords to check against
const COMMON_PASSWORDS = [
  'password',
  'password123',
  '123456',
  '12345678',
  '1234567890',
  'qwerty',
  'abc123',
  'letmein',
  'welcome',
  'monkey',
  '1q2w3e4r',
  'admin',
  'password1',
  '000000',
  '111111',
];

export type PasswordStrengthLevel = 'Very Weak' | 'Weak' | 'Medium' | 'Strong' | 'Very Strong';

export interface PasswordCheck {
  label: string;
  passed: boolean;
}

export interface PasswordStrengthResult {
  score: number; // 0-100
  label: PasswordStrengthLevel;
  percentage: number; // 0-100
  checks: PasswordCheck[];
  suggestions: string[];
}

function checkMinLength(password: string): { passed: boolean; score: number } {
  const passed = password.length >= 8;
  return { passed, score: passed ? 10 : 0 };
}

function checkRecommendedLength(password: string): { passed: boolean; score: number } {
  const passed = password.length >= 12;
  return { passed, score: passed ? 10 : 0 };
}

function checkUppercase(password: string): { passed: boolean; score: number } {
  const passed = /[A-Z]/.test(password);
  return { passed, score: passed ? 10 : 0 };
}

function checkLowercase(password: string): { passed: boolean; score: number } {
  const passed = /[a-z]/.test(password);
  return { passed, score: passed ? 10 : 0 };
}

function checkNumbers(password: string): { passed: boolean; score: number } {
  const passed = /[0-9]/.test(password);
  return { passed, score: passed ? 10 : 0 };
}

function checkSymbols(password: string): { passed: boolean; score: number } {
  const passed = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  return { passed, score: passed ? 10 : 0 };
}

function checkCommonPasswords(password: string): { passed: boolean; score: number } {
  const passed = !COMMON_PASSWORDS.some(
    (common) => password.toLowerCase() === common.toLowerCase(),
  );
  return { passed, score: passed ? 5 : -20 };
}

function checkRepeatingChars(password: string): { passed: boolean; score: number } {
  // Check for 4+ consecutive same characters (like 1111 or aaaa)
  const passed = !/(.)\1{3,}/.test(password);
  return { passed, score: passed ? 5 : -10 };
}

function checkSimpleSequences(password: string): { passed: boolean; score: number } {
  // Check for simple sequences like 123456 or abcdef
  const sequences = [
    '0123456789',
    '9876543210',
    'abcdefghij',
    'jihgfedcba',
    'qwertyuiop',
    'poiuytrewq',
  ];

  let hasSequence = false;
  for (const seq of sequences) {
    if (password.toLowerCase().includes(seq)) {
      hasSequence = true;
      break;
    }
  }

  const passed = !hasSequence;
  return { passed, score: passed ? 5 : -10 };
}

export function analyzePasswordStrength(password: string): PasswordStrengthResult {
  if (password.length === 0) {
    return {
      score: 0,
      label: 'Very Weak',
      percentage: 0,
      checks: [],
      suggestions: ['Enter a password to see strength analysis.'],
    };
  }

  const checks: PasswordCheck[] = [];
  let totalScore = 0;
  const suggestions: string[] = [];

  // Run all checks
  const minLen = checkMinLength(password);
  checks.push({ label: 'At least 8 characters', passed: minLen.passed });
  totalScore += minLen.score;

  const recLen = checkRecommendedLength(password);
  checks.push({ label: 'At least 12 characters (recommended)', passed: recLen.passed });
  totalScore += recLen.score;

  const upper = checkUppercase(password);
  checks.push({ label: 'Contains uppercase letter', passed: upper.passed });
  totalScore += upper.score;

  const lower = checkLowercase(password);
  checks.push({ label: 'Contains lowercase letter', passed: lower.passed });
  totalScore += lower.score;

  const numbers = checkNumbers(password);
  checks.push({ label: 'Contains number', passed: numbers.passed });
  totalScore += numbers.score;

  const symbols = checkSymbols(password);
  checks.push({ label: 'Contains symbol', passed: symbols.passed });
  totalScore += symbols.score;

  const common = checkCommonPasswords(password);
  checks.push({ label: 'Not a common password', passed: common.passed });
  totalScore += common.score;

  const repeating = checkRepeatingChars(password);
  checks.push({ label: 'No repeating characters (1111)', passed: repeating.passed });
  totalScore += repeating.score;

  const sequences = checkSimpleSequences(password);
  checks.push({ label: 'No simple sequences (123456)', passed: sequences.passed });
  totalScore += sequences.score;

  // Clamp score between 0 and 100
  const clampedScore = Math.max(0, Math.min(100, totalScore));

  // Determine strength label and add suggestions
  let label: PasswordStrengthLevel;

  if (clampedScore < 20) {
    label = 'Very Weak';
    if (!minLen.passed) suggestions.push('Use at least 8 characters.');
    if (!upper.passed) suggestions.push('Add an uppercase letter.');
    if (!lower.passed) suggestions.push('Add a lowercase letter.');
    if (!numbers.passed) suggestions.push('Add a number.');
  } else if (clampedScore < 40) {
    label = 'Weak';
    if (!recLen.passed) suggestions.push('Consider 12+ characters for better security.');
    if (!symbols.passed) suggestions.push('Add a symbol for stronger security.');
    if (!upper.passed) suggestions.push('Add an uppercase letter.');
    if (!numbers.passed) suggestions.push('Add a number.');
  } else if (clampedScore < 60) {
    label = 'Medium';
    if (!symbols.passed) suggestions.push('Add a symbol to strengthen.');
    if (!recLen.passed) suggestions.push('Consider 12+ characters.');
  } else if (clampedScore < 80) {
    label = 'Strong';
    suggestions.push('Well done! This is a strong password.');
  } else {
    label = 'Very Strong';
    suggestions.push('Excellent! This is a very strong password.');
  }

  return {
    score: clampedScore,
    label,
    percentage: clampedScore,
    checks,
    suggestions,
  };
}
